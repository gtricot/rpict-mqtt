import bunyan from 'bunyan';
import config from '../config/index.js';

const log = bunyan.createLogger({
    name: 'rpict-mqtt',
    level: config.logLevel,
});

export default log;
