'use strict';

const HomeEasy = require('../HomeEasy');

module.exports = RFDevice => class Remote extends HomeEasy(RFDevice) {
    static payloadToData(payload) { // Convert received data to usable variables
		const data = super.payloadToData(payload);
		if (!data) return data;

		data.id = data.address;
		return data;
    }
    
    onFlowTriggerReceived(args, state) {
		if (args.unit === 'g' || args.button === 'g') {
			args.unit = '0000';
			args.group = 1;
			delete args.button;
			delete args.channel;
		} else {
			args.group = 0;
		}
		super.onFlowTriggerReceived(args, state);
	}

	onFlowActionSend(args) {
		if (args.unit === 'g') {
			args.unit = '0000';
			args.group = 1;
		} else if (args.group && args.channel) {
			args.unit = undefined;
			args.group = 0;
		} else {
			args.group = 0;
		}
		super.onFlowActionSend(args);
	}
}
