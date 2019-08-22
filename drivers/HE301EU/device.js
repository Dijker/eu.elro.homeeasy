'use strict';

const Remote = require('../../lib/HomeEasy/devices/Remote');

module.exports = RFDriver => class HE301EUDevice extends Remote(RFDriver) {};
