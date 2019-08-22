'use strict';

const Remote = require('../../lib/Smartwares/devices/Remote');

module.exports = RFDriver => class HE844ADevice extends Remote(RFDriver) {};
