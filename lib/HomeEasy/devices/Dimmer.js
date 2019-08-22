'use strict';

const HomeEasy = require('../HomeEasy');

module.exports = RFDevice => class Dimmer extends HomeEasy(RFDevice) {
    updateState(frame) {
		if (frame.dim === undefined || frame.dim === null) {
			delete frame.dim;
		}
		this.setState(frame.id, Object.assign({}, this.getState(frame.id), frame));
	}

	updateRealtime(device, state, oldState) {
		super.updateRealtime(device, state, oldState);
		if (state.dim === undefined || state.dim === null) {
			if (oldState.dim === undefined || oldState.dim === null && Number(state.state) !== Number(oldState.state)) {
				this.realtime(device, 'dim', Number(state.state));
			}
		} else if (state.dim !== oldState.dim) {
			this.realtime(device, 'dim', state.dim);
		}
	}
}
