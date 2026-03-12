/**
 * Home Assistant related stuff.
 */
import { AsyncMqttClient } from 'async-mqtt';

import config from '../config/index';
import log from '../log/index';
import type { Frame } from '../types/index';

const { mqttBaseTopic, hassDiscoveryPrefix } = config;

interface HassDiscoveryConfig {
    unique_id: string;
    name: string;
    state_topic: string;
    value_template: string;
    state_class: string;
    device: {
        identifiers: string[];
        manufacturer: string;
        model: string;
        name: string;
    };
    device_class?: string;
    unit_of_measurement?: string;
}

/**
 * Get frame topic.
 * @param {string} nodeID Node ID
 * @returns {string} Frame topic
 */
function getFrameTopic(nodeID: string): string {
    return `${mqttBaseTopic}/${nodeID}`;
}

/**
 * Get hass value template.
 * @param {string} tag Tag
 * @returns {string} Value template
 */
function getValueTemplate(tag: string): string {
    return `{{ value_json.${tag} }}`;
}

/**
 * Publish Configuration for home-assistant discovery.
 * @param {AsyncMqttClient} client MQTT client
 * @param {string} nodeID Node ID
 * @param {Frame} frame Frame data
 */
export async function publishConfigurationForHassDiscovery(
    client: AsyncMqttClient,
    nodeID: string,
    frame: Frame,
): Promise<void> {
    const promises = Object.keys(frame.data)
        .filter((key) => key !== 'deviceMapping')
        .map(async (tag) => {
            const discoveryTopic = `${hassDiscoveryPrefix}/sensor/${mqttBaseTopic}/${nodeID}_${tag.toLowerCase()}/config`;
            log.debug(`Publish configuration for tag ${tag} for discovery to topic [${discoveryTopic}]`);
            const deviceClass = frame.deviceMapping[tag].device_class;
            const unitOfMeasurement = frame.deviceMapping[tag].unit_of_measurement;

            const discoveryConfig: HassDiscoveryConfig = {
                unique_id: `rpict_${nodeID}_${tag}`,
                name: `RPICT ${nodeID} ${tag}`,
                state_topic: getFrameTopic(nodeID),
                value_template: getValueTemplate(tag),
                state_class: 'measurement',
                device: {
                    identifiers: [nodeID],
                    manufacturer: 'LeChacal',
                    model: `rpict_${nodeID}`,
                    name: `RPICT ${nodeID}`,
                },
            };

            if (deviceClass) {
                discoveryConfig.device_class = deviceClass;
            }

            if (unitOfMeasurement) {
                discoveryConfig.unit_of_measurement = unitOfMeasurement;
            }

            return client.publish(discoveryTopic, JSON.stringify(discoveryConfig), {
                retain: true,
            });
        });
    await Promise.all(promises);
    return;
}
