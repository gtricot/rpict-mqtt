import fs from 'fs';

// Configuration (default values)
const config = {
    mqttUrl: 'mqtt://localhost:1883',
    mqttUser: undefined,
    mqttPassword: undefined,
    mqttBaseTopic: 'rpict',
    hassDiscovery: true,
    hassDiscoveryPrefix: 'homeassistant',
    serial: '/dev/ttyAMA0',
    baudRate: 38400,
    deviceMapping: 'RPICT7V1.json',
    precision: 2,
    absoluteValues: false,
    sensorValueThreshold: 0,
    logLevel: 'info',
};

/**
 * Override default configuration with object in arg.
 * @param overrideObject the object containing the overridden values
 */
function overrideConfiguration(overrideObject) {
    if (overrideObject.MQTT_URL) {
        config.mqttUrl = overrideObject.MQTT_URL;
    }
    if (overrideObject.MQTT_USER && overrideObject.MQTT_USER !== '') {
        config.mqttUser = overrideObject.MQTT_USER;
    }
    if (overrideObject.MQTT_PASSWORD && overrideObject.MQTT_PASSWORD !== '') {
        config.mqttPassword = overrideObject.MQTT_PASSWORD;
    }
    if (overrideObject.MQTT_BASE_TOPIC) {
        config.mqttBaseTopic = overrideObject.MQTT_BASE_TOPIC;
    }
    if (overrideObject.HASS_DISCOVERY !== undefined) {
        config.hassDiscovery =
            typeof overrideObject.HASS_DISCOVERY === 'string'
                ? overrideObject.HASS_DISCOVERY.toLowerCase() === 'true'
                : overrideObject.HASS_DISCOVERY;
    }
    if (overrideObject.HASS_DISCOVERY_PREFIX) {
        config.hassDiscoveryPrefix = overrideObject.HASS_DISCOVERY_PREFIX;
    }
    if (overrideObject.SERIAL) {
        config.serial = overrideObject.SERIAL;
    }
    if (overrideObject.BAUD_RATE) {
        config.baudRate = overrideObject.BAUD_RATE;
    }
    if (overrideObject.DEVICE_MAPPING) {
        config.deviceMapping = overrideObject.DEVICE_MAPPING;
    }
    if (overrideObject.PRECISION) {
        config.precision = overrideObject.PRECISION;
    }
    if (overrideObject.ABSOLUTE_VALUES !== undefined) {
        config.absoluteValues =
            typeof overrideObject.ABSOLUTE_VALUES === 'string'
                ? overrideObject.ABSOLUTE_VALUES.toLowerCase() === 'true'
                : overrideObject.ABSOLUTE_VALUES;
    }
    if (overrideObject.SENSOR_VALUE_THRESHOLD) {
        config.sensorValueThreshold = overrideObject.SENSOR_VALUE_THRESHOLD;
    }
    if (overrideObject.LOG_LEVEL) {
        config.logLevel = overrideObject.LOG_LEVEL;
    }
}

// 1. Load env var and override default values
overrideConfiguration(process.env);

// 2. Load options.json and override default values (only if hass.io addon environment)
if (process.env.HASSIO_ADDON && process.env.HASSIO_ADDON.toLowerCase() === 'true') {
    const optionsFile = process.env.HASSIO_OPTIONS_FILE || '/data/options.json';
    const optionsBuffer = fs.readFileSync(optionsFile, 'utf8');
    const options = JSON.parse(optionsBuffer);
    overrideConfiguration(options);
}

// 3. Export the resolved configuration
export default config;
