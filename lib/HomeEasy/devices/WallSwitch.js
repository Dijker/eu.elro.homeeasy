'use strict';

const HomeEasy = require('../HomeEasy');

module.exports = RFDevice => class WallSwitch extends HomeEasy(RFDevice) {
    
    onFlowTriggerReceived(args, state) {
		const settings = this.getSettings(args.device);
		if (this.config.rotateUnit && settings.rotated === '180') {
			if (args.unit === '1010') {
				args.unit = '1011';
			} else if (args.unit === '1011') {
				args.unit = '1010';
			}
		}
		super.onFlowTriggerReceived(args, state);
	}

	onFlowActionSend(args) {
		const settings = this.getSettings(args.device);
		if (settings.rotated === '180') {
			if (this.config.rotateUnit && settings.rotated === '180') {
				if (args.unit === '1010') {
					args.unit = '1011';
				} else if (args.unit === '1011') {
					args.unit = '1010';
				}
			}
		}
		super.onFlowActionSend(args);
	}
}
