'use strict';

const Smartwares = require('../SmartwaresDevice');

module.exports = RFDevice => class Remote extends Smartwares(RFDevice) {

	/**
	 * Use the normal data to payload, then strip the unit from the data before returning.
	 * The unit is depending on the button so it will not be unique for a remote.
	 * 
	 * @param {*} payload 
	 */
	static payloadToData(payload) {
		const data = super.payloadToData(payload);
		if (!data) return data;

		data.id = data.address;
		return data;
	}

	/**
	 * Smartwares doesn't have a native group signal.
	 * To emulate the group signal, send every unit to the desired state.
	 * 
	 * @param {*} data Object with device data to create a group signal from.
	 */
	sendGroupSignal(data) {
		if (data && Number(data.group) === 1) {
			['0001', '0010', '0011', '0100'].forEach(unit => {
				const payload = this.dataToPayload(Object.assign({}, data, { group: 0, unit })).map(Number);
				if (payload && payload.length === 32) {
					this.signal.signal.tx(new Buffer(payload), () => {
						Homey.log('Simulated smartware group payload: ', payload.join(''));
					});
				}
			});
		}
	}

	/**
	 * Create the Smartwares 0000 groupid from the default group unit.
	 * @param {*} args 
	 */
	onFlowActionFrameSend(args) {
		if (args.unit === 'g') {
			args.unit = '0000';
			args.group = '1';
		} else {
			args.group = '0';
		}
		super.onFlowActionFrameSend(args);
	}
};
