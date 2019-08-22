'use strict';

const Socket = require('../../lib/HomeEasy/devices/Socket');

module.exports = RFDriver => class HE333EUDevice extends Socket(RFDriver) {};
