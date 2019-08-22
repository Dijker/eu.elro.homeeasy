'use strict';

const Socket = require('../../lib/HomeEasy/devices/Socket');

module.exports = RFDriver => class HE332EUDevice extends Socket(RFDriver) {};
