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
 * Get hass state class.
 * @param tag
 * @param deviceMapping
 * @returns {string}
 */
function getStateClass(tag, deviceMapping) {
    return deviceMapping[tag].state_class;
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
function getValueTemplate(tag, deviceMapping) {
    return deviceMapping[tag].value_template;
}

/**
 * Publish Configuration for home-assistant discovery.
 * @param client
 * @param nodeID
 * @param frame
 */
async function publishConfigurationForHassDiscovery(client, nodeID, frame) {
    const promises = Object.keys(frame).filter((key) => key !== 'deviceMapping').map(async (tag) => {
        const discoveryTopic = `${hassDiscoveryPrefix}/sensor/${mqttBaseTopic}/${nodeID}_${tag.toLowerCase()}/config`;
        log.info(`Publish configuration for tag ${tag} for discovery to topic [${discoveryTopic}]`);
        const stateTopic = getFrameTopic(nodeID);
        return client.publish(discoveryTopic, JSON.stringify({
            unique_id: `rpict_${nodeID}_${tag}`,
            name: `RPICT ${nodeID} ${tag}`,
            state_topic: stateTopic,
            state_class: getStateClass(tag),
            device_class: getDeviceClass(tag),
            value_template: getValueTemplate(tag),
            unit_of_measurement: getUnitOfMeasurement(tag),
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
