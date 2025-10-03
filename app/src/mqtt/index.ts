import mqtt, { IClientOptions, AsyncMqttClient } from 'async-mqtt';
import log from '../log/index';
import config from '../config/index';
import { publishConfigurationForHassDiscovery } from '../hass/index';
import { Frame } from '../types';

const { mqttUrl, mqttUser, mqttPassword, mqttBaseTopic, hassDiscovery } = config;

/**
 * True when hass discovery configuration has been published.
 * @type {boolean}
 */
let discoveryConfigurationPublished = false;

/**
 * MQTT Client.
 */
let client: AsyncMqttClient;

/**
 * Get frame topic.
 * @param {string} nodeID Node ID
 * @returns {string} Frame topic
 */
function getFrameTopic(nodeID: string): string {
    return `${mqttBaseTopic}/${nodeID}`;
}

/**
 * Get MQTT client options.
 * @returns {IClientOptions} MQTT client options
 */
function getMqttClientOptions(): IClientOptions {
    const options: IClientOptions = {};
    if (mqttUser) {
        options.username = mqttUser;
    }
    if (mqttPassword) {
        options.password = mqttPassword;
    }
    return options;
}

/**
 * Connect to MQTT broker.
 */
export async function connectMqtt() {
    log.info(`Connecting to MQTT broker [${mqttUrl}]`);
    try {
        client = await mqtt.connectAsync(mqttUrl, getMqttClientOptions());
        log.info(`Connected to MQTT broker [${mqttUrl}]`);
    } catch (e) {
        log.error(`MQTT connection error [${(e as Error).message}]`);
        throw e;
    }
    try {
        if (client) {
            client.on('connect', () => {
                // Workaround to avoid reconnect issue (see https://github.com/mqttjs/MQTT.js/issues/1213)
                (client as any)._client.options.properties = {};
            });
            client.on('reconnect', () => {
                log.info('Reconnecting to the MQTT broker...');
            });
            client.on('error', (err) => {
                log.warn(`Error when publishing to the mqtt broker (${err.message})`);
            });
        }
    } catch (e) {
        log.error(`MQTT connection error [${(e as Error).message}]`);
        throw e;
    }
}

/**
 * Disconnect from MQTT broker.
 */
export async function disconnectMqtt() {
    log.info(`Disconnecting from MQTT broker [${mqttUrl}]`);
    try {
        await client.end();
        log.info(`Disconnected from MQTT broker [${mqttUrl}]`);
    } catch (e) {
        log.error(`Error on disconnecting from MQTT broker [${mqttUrl}]`);
        throw e;
    }
}

/**
 * Publish a frame to MQTT.
 * @param {Frame} frame Frame data
 */
export async function publishMqttFrame(frame: Frame): Promise<void> {
    const nodeID = frame.data ? String(frame.data.NodeID) : undefined;
    if (!nodeID) {
        log.warn(`Cannot publish a frame without NodeID property : ${frame}`);
    } else {
        if (hassDiscovery && !discoveryConfigurationPublished) {
            try {
                await publishConfigurationForHassDiscovery(client, nodeID, frame);
                discoveryConfigurationPublished = true;
            } catch (e) {
                log.warn(`Unable to publish discovery configuration (${(e as Error).message}) : ${e}`);
            }
        }
        const frameTopic = getFrameTopic(nodeID);
        log.debug(`Publish frame data ${frame.data} to topic ${frameTopic}`);
        try {
            await client.publish(frameTopic, JSON.stringify(frame.data));
        } catch (e) {
            log.warn(`Unable to publish frame to ${frameTopic} (${(e as Error).message}) : ${e}`);
        }
    }
}
