'use strict';

const Remote = require('../../lib/HomeEasy/devices/Remote');

module.exports = RFDriver => class HE300WEUDevice extends Remote(RFDriver) {};
