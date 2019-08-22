'use strict';

const WallSwitch = require('../../lib/HomeEasy/devices/WallSwitch');

module.exports = RFDevice => class HE307EUDevice extends WallSwitch(RFDevice) {};
