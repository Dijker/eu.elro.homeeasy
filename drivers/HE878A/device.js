'use strict';

const Socket = require('../../lib/Smartwares/devices/Socket');

module.exports = RFDriver => class HE878ADevice extends Socket(RFDriver) {};
