'use strict';

const Socket = require('../../lib/HomeEasy/devices/Socket');

module.exports = RFDriver => class HE202EUDevice extends Socket(RFDriver) {};
