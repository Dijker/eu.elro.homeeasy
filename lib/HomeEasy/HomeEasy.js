'use strict';

const util = require('homey-rfdriver').util;

const decodeMap = new Map([
	['000111', '0000'],
	['001011', '0001'],
	['001101', '0010'],
	['001110', '0011'],
	['010011', '0100'],
	['010101', '0101'],
	['010110', '0110'],
	['011001', '0111'],
	['011010', '1000'],
	['011100', '1001'],
	['100011', '1010'],
	['100101', '1011'],
	['100110', '1100'],
	['101001', '1101'],
	['101010', '1110'],
	['101100', '1111'],
	['100000', '00d1'],
	['100001', '01d1'],
	['100010', '10d1'],
	['100100', '11d1'],
]);

const encodeMap = new Map(Array.from(decodeMap.entries()).map(entry => entry.reverse()));

module.exports = RFDevice => class HomeEasy extends RFDevice {
    onRFInit() {
        super.onRFInit();

        this.decodeMap = decodeMap;
		this.encodeMap = encodeMap;
		//setTimeout(this.registerSignal.bind(this), 1000);
		this.on('frame', this.updateState.bind(this));
		this.on('new_state', this.updateRealtime.bind(this));
		this.on('new_pairing_device', device => this.updateState(device.data));
    }

    static generateData() {
		const data = {
			address: util.generateRandomBitString(26),
			unit: util.generateRandomBitString(4),
			state: 0,
			group: 0,
		};
		data.unit = data.unit === '0000' ? '0001' : data.unit;
		data.id = `${data.address}:${data.unit}`;

		return data;
	}

    static payloadToData(payload) { // Convert received data to usable variables
		if (payload && payload.length === 55 || payload.length === 62) {
			const bitStrings = new Array(9)
				.fill(undefined)
				.map((val, index) => decodeMap.get(payload.slice(index * 7, (index + 1) * 7 - 1).join('')));

			// Hacky way to make our homeeasy group signal work. Do not know if this is a fix for all remotes
			if (!bitStrings[6]) {
				bitStrings[6] = decodeMap.get(payload.slice(43, 48).concat(1).join(''));
			} else if (payload.length === 62 && bitStrings[6].slice(-2, -1) !== 'd') {
				return null;
			}

			if (!bitStrings.slice(0, (payload.length + 1) / 7).every(Boolean)) {
				return null;
			}

			const data = {
				address: bitStrings.slice(0, 7).join('').slice(0, -2),
				unit: bitStrings[7],
				channel: bitStrings[7].slice(0, 2),
				button: bitStrings[7].slice(2, 4),
				dim: bitStrings[8] ? util.bitArrayToNumber(bitStrings[8].split('').map(Number)) / 15 : undefined,
				state: bitStrings[6].slice(-1) === '1' ? 1 : 0,
				group: bitStrings[6].slice(-2, -1) === '1' ? 1 : 0,
			};
			data.state = isNaN(data.dim) ? data.state : 1;
			data.id = `${data.address}:${data.unit}`;
			return data;
		}
		return null;
    }
    
    static dataToPayload(data) {
		if (
			data &&
			(
				(data.unit && data.unit.length === 4) ||
				(data.button && data.button.length === 2 && data.channel && data.channel.length === 2)
			) &&
			data.address && data.address.length === 26 &&
			(typeof data.state !== 'undefined' || typeof data.dim !== 'undefined')
		) {
			const dim = typeof data.dim === 'number' ?
            util.numberToBitArray(Math.round(Math.max(Math.min(data.dim, 1), 0) * 15), 4).join('') :
				'';
			const state = Number(data.state) ? '1' : '0';
			const group = Number(data.group) ? '1' : '0';
			const unit = data.unit && data.unit.length === 4 ? data.unit : data.channel.concat(data.button);

			return `${data.address}${dim ? 'd' : group}${dim ? '1' : state}${unit}${dim}`
				.split('')
				.reduce((prev, next) => {
					if (prev[prev.length - 1].length < 4) {
						prev[prev.length - 1] += next;
						return prev;
					}
					return prev.concat(next);
				}, [''])
				.map((bitString, index, arr) =>
					encodeMap
						.get(bitString)
						.split('')
						.map(Number)
						.concat(index === (arr.length - 1) ? [] : 1)
				)
				.reduce((prev, next) => prev.concat(next), []);
		}
		return null;
    }
    
    updateState(frame) {
		this.setState(frame.id, Object.assign({}, this.getState(frame.id), frame));
	}

	updateRealtime(device, state, oldState) {
		if (Boolean(Number(state.state)) !== Boolean(Number(oldState.state))) {
			this.realtime(device, 'onoff', Boolean(Number(state.state)));
		}
	}
}