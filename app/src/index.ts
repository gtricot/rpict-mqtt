import config from './config/index';
import { connectRpict, disconnectRpict } from './rpict/index';
import { connectMqtt, disconnectMqtt, publishMqttFrame } from './mqtt/index';
import log from './log/index';
import { EventEmitter } from 'events';
import { Frame } from './types';

async function disconnectAll() {
    try {
        await disconnectMqtt();
    } catch (error) {
        log.error('Error disconnecting MQTT:', error);
    }

    try {
        await disconnectRpict();
    } catch (error) {
        log.error('Error disconnecting RPICT:', error);
    }
}

export async function run() {
    const configHidden = { ...config, mqttPassword: '<hidden>' };
    log.info('Starting rpict-mqtt with configuration =', configHidden);

    try {
        // Connect to MQTT
        await connectMqtt();

        // Connect to serial port
        const rpictEventEmitter: EventEmitter = await connectRpict();

        // Register to frame events and publish to mqtt
        rpictEventEmitter.on('frame', (frame: Frame) => {
            try {
                publishMqttFrame(frame);
            } catch (error) {
                log.error('Error publishing frame to MQTT:', error);
            }
        });

        // Graceful exit
        process.on('SIGTERM', disconnectAll);
        process.on('SIGINT', disconnectAll);
    } catch (e) {
        log.error('Unable to run => See errors below');
        log.error(e);
        disconnectAll();
        process.exit(1);
    }
}

// Only run when not in test environment
if (process.env.NODE_ENV !== 'test') {
    run();
}
