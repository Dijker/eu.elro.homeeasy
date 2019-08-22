'use strict';

const Smartwares = require('../SmartwaresDevice');

module.exports = RFDevice => class WallSwitch extends Smartwares(RFDevice) {

	onRFInit() {
		super.onRFInit();
		this.options.buttonCount = this.options.buttonCount || 1;
	}

	/**
	 * Additional payloadToData function to prevent the unit being used in the id.
	 * This is neccessary for the rotation settings since that will change the unit.
	 * 
	 * @param {*} payload The payload to convert
	 */
	static payloadToData(payload) { // Convert received data to usable variables
		const data = super.payloadToData(payload);
		if (!data) return data;

		data.id = data.address;
		return data;
	}

	/**
	 * Small function to swap the unit code if the buttons are rotated
	 * This is possible because the first button is always 0001 and the second 0010
	 * 
	 * @param {*} unit : The base unit code to swap
	 */
	swapUnit(unit) {
		if (unit === '0001') return '0010';
		if (unit === '0010') return '0001';
	}

	/**
	 * In this function the rotation settings will be altered before sending the data to Homey.
	 * 
	 * @param {*} outgoingData : The data to modify.
	 */
	parseIncomingData(outgoingData) {
		if (this.getSettings().rotated === '180') {
			// If there are 2 buttons we need to swap the unit
			if (this.options.buttonCount === 2) outgoingData.unit = this.swapUnit(outgoingData.unit);
				
			outgoingData.state = outgoingData.state ? 0 : 1;
			outgoingData.onoff = !!outgoingData.state;
		}
		// always return the data
		return outgoingData;
	}
};
