const fs = require('fs');
const log = require('../log');

// Location of hass.io addon options file
const HASSIO_ADDON_OPTIONS_FILE = '/data/options.json';

// Configuration (default values)
const config = {
    mqttUrl: process.env.MQTT_URL || 'mqtt://localhost:1883',
    mqttUser: process.env.MQTT_USER,
    mqttPassword: process.env.MQTT_PASSWORD,
    mqttBaseTopic: process.env.MQTT_BASE_TOPIC || 'rpict',
    hassDiscovery: process.env.HASS_DISCOVERY ? process.env.HASS_DISCOVERY.toLowerCase() === 'true' : true,
    hassDiscoveryPrefix: process.env.HASS_DISCOVERY_PREFIX || 'homeassistant',
    serial: process.env.SERIAL || '/dev/ttyAMA0',
    baudRate: process.env.BAUD_RATE || 38400,
    deviceMapping: process.env.DEVICE_MAPPING || 'RPICT7V1.json',
    precision: process.env.PRECISION || 2,
    absoluteValues: process.env.ABSOLUTE_VALUES ? process.env.HASS_DISCOVERY.toLowerCase() === 'true' : true || false,
    sensorValueThreshold: process.env.SENSOR_VALUE_THRESHOLD || 0,
    logLevel: process.env.LOG_LEVEL || 'info',
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
    if (overrideObject.HASS_DISCOVERY) {
        config.hassDiscovery = overrideObject.HASS_DISCOVERY;
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
    if (overrideObject.ABSOLUTE_VALUES) {
        config.absoluteValues = overrideObject.ABSOLUTE_VALUES;
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
    const optionsBuffer = fs.readFileSync(HASSIO_ADDON_OPTIONS_FILE, 'utf8');
    const options = JSON.parse(optionsBuffer);
    const optionsHidden = { ...config, MQTT_PASSWORD: '<hidden>' };
    log.debug('Hass.io add-on mode - Parsed options from /data/options.json = ', optionsHidden);
    overrideConfiguration(options);
}

// 3. Export the resolved configuration
module.exports = config;
