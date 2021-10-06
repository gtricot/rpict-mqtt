const bunyan = require('bunyan');
const config = require('../config');

const log = bunyan.createLogger({
    name: 'rpict-mqtt',
    level: config.logLevel,
});

module.exports = log;
