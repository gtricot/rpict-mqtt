import config from './config/index.js';
import { connect as connectRpict, disconnect as disconnectRpict } from './rpict/index.js';
import { connect as connectMqtt, disconnect as disconnectMqtt, publishFrame } from './mqtt/index.js';
import log from './log/index.js';

async function disconnect() {
    await disconnectRpict();
    await disconnectMqtt();
}

async function run() {
    const configHidden = { ...config, mqttPassword: '<hidden>' };
    log.info('Starting rpict-mqtt with configuration =', configHidden);

    try {
        // Connect to MQTT
        await connectMqtt();

        // Connect to serial port
        const rpictEventEmitter = await connectRpict();

        // Register to frame events and publish to mqtt
        rpictEventEmitter.on('frame', (frame) => {
            publishFrame(frame);
        });

        // Graceful exit
        process.on('SIGTERM', disconnect);
        process.on('SIGINT', disconnect);
    } catch (e) {
        log.error('Unable to run => See errors below');
        log.error(e);
        process.exit(1);
    }
}

run();
