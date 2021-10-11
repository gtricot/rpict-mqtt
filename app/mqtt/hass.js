/**
 * Home Assistant related stuff.
 */
const log = require('../log');

const {
    mqttBaseTopic,
    hassDiscoveryPrefix,
} = require('../config');

/**
 * Get frame topic.
 * @param nodeID
 * @returns {string}
 */
function getFrameTopic(nodeID) {
    return `${mqttBaseTopic}/${nodeID}`;
}

/**
 * Get hass device class.
 * @param tag
 * @param deviceMapping
 * @returns {string}
 */
function getDeviceClass(tag, deviceMapping) {
    return deviceMapping[tag].device_class;
}

/**
 * Get hass unit of measurement.
 * @param tag
 * @param deviceMapping
 * @returns {string}
 */
function getUnitOfMeasurement(tag, deviceMapping) {
    return deviceMapping[tag].unit_of_measurement;
}

/**
 * Get hass value template.
 * @param tag
 * @param deviceMapping
 * @returns {string}
 */
function getValueTemplate(tag) {
    return `{{ value_json.${tag} }}`;
}

/**
 * Publish Configuration for home-assistant discovery.
 * @param client
 * @param nodeID
 * @param frame
 */
async function publishConfigurationForHassDiscovery(client, nodeID, frame) {
    const promises = Object.keys(frame.data).filter((key) => key !== 'deviceMapping').map(async (tag) => {
        const discoveryTopic = `${hassDiscoveryPrefix}/sensor/${mqttBaseTopic}/${nodeID}_${tag.toLowerCase()}/config`;
        log.debug(`Publish configuration for tag ${tag} for discovery to topic [${discoveryTopic}]`);
        return client.publish(discoveryTopic, JSON.stringify({
            unique_id: `rpict_${nodeID}_${tag}`,
            name: `RPICT ${nodeID} ${tag}`,
            state_topic: getFrameTopic(nodeID),
            value_template: getValueTemplate(tag),
            device_class: getDeviceClass(tag, frame.deviceMapping),
            unit_of_measurement: getUnitOfMeasurement(tag, frame.deviceMapping),
            device: {
                identifiers: [nodeID],
                manufacturer: 'LeChacal',
                model: `rpict_${nodeID}`,
                name: `RPICT ${nodeID}`,
            },
        }), {
            retain: true,
        });
    });
    return Promise.all(promises);
}

module.exports = {
    publishConfigurationForHassDiscovery,
};
