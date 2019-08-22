'use strict'

const SmartWares = require('../SmartwaresDevice');

// placeholder class for consistency across devices
module.exports = RFDevice => class Socket extends SmartWares(RFDevice) {}