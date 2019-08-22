'use strict';

const util = require('homey-rfdriver').util;

/**
 * 					433 Payload description			
 * 
 *	Example payload : 00011011000110100000000000010001
 * 
 *	00011011000110100000000000		0		1		0001
 *	----	address	----			group	state	unit
 * 
 *	The unit code is always 0001 for the first button, 0010 for the second one etc.
 * 	
 */

module.exports = RFDevice => class Smartwares extends RFDevice {

	/**
	 * Function to generate device data. Used for pairing a device through 'program'.
	 */
	static generateData() {
		const data = {
			address: util.generateRandomBitString(26),
			unit: `0${util.generateRandomBitString(3)}`, // Prevent the unit code from being 0000 (group)
			group: 0,
            state: 1,
            onoff: true
		};
		data.id = `${data.address}:${data.unit}`;
		return data;
	}

	/**
	 * Function to parse the received payload to data for the device.
	 * 
	 * @param {*} payload Bitarray with the payload to parse the data from.
	 */
	static payloadToData(payload) {
		if (payload.length === 32) {
			const data = {
				address: util.bitArrayToString(payload.slice(0, 26)),
				group: payload[26],
				unit: util.bitArrayToString(payload.slice(28, 32)),
				state: payload[27],
			};
			data.onoff = !!data.state;
			data.id = `${data.address}:${data.unit}`;
			return data;
		}
		return null;
	}

	/**
	 * Function to create a payload from the delivered device data, which then will be send.
	 * 
	 * @param {*} data Object with device data to create a payload from
	 */
	static dataToPayload(data) {
		if (
			data &&
			data.address && data.address.length === 26 &&
			data.unit && data.unit.length === 4 &&
			typeof data.group !== 'undefined' &&
			typeof data.state !== 'undefined'
		) {
			const address = util.bitStringToBitArray(data.address);
			const unit = util.bitStringToBitArray(data.unit);
			const payload = address.concat(Number(data.group), Number(data.onoff), unit);
			return payload;
		}
		return null;
	}
};