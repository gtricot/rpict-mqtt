const config = require('./config');
const rpict = require('./rpict');
const mqtt = require('./mqtt');
const log = require('./log');

async function disconnect() {
    await rpict.disconnect();
    await mqtt.disconnect();
}

async function run() {
    const configHidden = { ...config, mqttPassword: '<hidden>' };
    log.info('Starting rpict-mqtt with configuration =', configHidden);

    try {
        // Connect to MQTT
        await mqtt.connect();

        // Connect to serial port
        const rpictEventEmitter = await rpict.connect();

        // Register to frame events and publish to mqtt
        rpictEventEmitter.on('frame', (frame) => {
            mqtt.publishFrame(frame);
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
