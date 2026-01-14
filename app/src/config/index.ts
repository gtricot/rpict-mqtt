import fs from 'fs';

// Configuration (default values)
interface OverrideObject {
    MQTT_URL?: string;
    MQTT_USER?: string;
    MQTT_PASSWORD?: string;
    MQTT_BASE_TOPIC?: string;
    HASS_DISCOVERY?: boolean | string;
    HASS_DISCOVERY_PREFIX?: string;
    SERIAL?: string;
    BAUD_RATE?: number | string;
    DEVICE_MAPPING?: string;
    PRECISION?: number | string;
    ABSOLUTE_VALUES?: boolean | string;
    SENSOR_VALUE_THRESHOLD?: number | string;
    LOG_LEVEL?: string;
}

const config: {
    mqttUrl: string;
    mqttUser?: string;
    mqttPassword?: string;
    mqttBaseTopic: string;
    hassDiscovery: boolean;
    hassDiscoveryPrefix: string;
    serial: string;
    baudRate: number;
    deviceMapping: string;
    precision: number;
    absoluteValues: boolean;
    sensorValueThreshold: number;
    logLevel: string;
} = {
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
function overrideConfiguration(overrideObject: Partial<OverrideObject>): void {
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
        config.baudRate =
            typeof overrideObject.BAUD_RATE === 'string'
                ? parseInt(overrideObject.BAUD_RATE, 10)
                : overrideObject.BAUD_RATE;
    }
    if (overrideObject.DEVICE_MAPPING) {
        config.deviceMapping = overrideObject.DEVICE_MAPPING;
    }
    if (overrideObject.PRECISION) {
        config.precision =
            typeof overrideObject.PRECISION === 'string'
                ? parseInt(overrideObject.PRECISION, 10)
                : overrideObject.PRECISION;
    }
    if (overrideObject.ABSOLUTE_VALUES) {
        config.absoluteValues =
            typeof overrideObject.ABSOLUTE_VALUES === 'string'
                ? overrideObject.ABSOLUTE_VALUES.toLowerCase() === 'true'
                : overrideObject.ABSOLUTE_VALUES;
    }
    if (overrideObject.SENSOR_VALUE_THRESHOLD) {
        config.sensorValueThreshold =
            typeof overrideObject.SENSOR_VALUE_THRESHOLD === 'string'
                ? parseFloat(overrideObject.SENSOR_VALUE_THRESHOLD)
                : overrideObject.SENSOR_VALUE_THRESHOLD;
    }
    if (overrideObject.LOG_LEVEL) {
        config.logLevel = overrideObject.LOG_LEVEL;
    }
}

// 1. Load env var and override default values
overrideConfiguration(process.env as Partial<OverrideObject>);

// 2. Load options.json and override default values (only if hass.io addon environment)
if (process.env.HASSIO_ADDON && process.env.HASSIO_ADDON.toLowerCase() === 'true') {
    const optionsFile = process.env.HASSIO_OPTIONS_FILE || '/data/options.json';
    const optionsBuffer = fs.readFileSync(optionsFile, 'utf8');
    const options = JSON.parse(optionsBuffer);
    overrideConfiguration(options);
}

// 3. Export the resolved configuration
export default config;
