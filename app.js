'use strict';

const Homey = require('homey');

class HomeEasy extends Homey.App {
	onInit() {
		this.log('HomeEasy is running...');
	}
}

module.exports = HomeEasy;