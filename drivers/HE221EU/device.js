'use strict';

const Remote = require('../../lib/HomeEasy/devices/Remote');

module.exports = RFDriver => class HE221EUDevice extends Remote(RFDriver) {};
