'use strict';

const Socket = require('../../lib/HomeEasy/devices/Socket');

module.exports = RFDriver => class HE432EUDevice extends Socket(RFDriver) {};
