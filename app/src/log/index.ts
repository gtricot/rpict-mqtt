import bunyan from 'bunyan';
import config from '../config/index';

const log = bunyan.createLogger({
    name: 'rpict-mqtt',
    level: config.logLevel as bunyan.LogLevel,
});

export default log;
