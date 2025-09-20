const path = require('path');

// Store original env
const originalEnv = { ...process.env };

// Test options file path
const TEST_OPTIONS_FILE = path.resolve(__dirname, 'options.test.json');

describe('config module', () => {
    beforeEach(() => {
        // Clear module cache before each test
        jest.resetModules();
        
        // Reset process.env to original state
        process.env = { ...originalEnv };
    });

    afterEach(() => {
        // Restore process.env to original state after each test
        process.env = { ...originalEnv };
    });

    test('default values', () => {
        const config = require('./index');
        expect(config).toEqual({
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
            logLevel: 'info'
        });
    });

    test('environment variables', () => {
        process.env.MQTT_URL = 'mqtt://test:1883';
        process.env.MQTT_USER = 'testuser';
        process.env.MQTT_PASSWORD = 'testpass';
        process.env.MQTT_BASE_TOPIC = 'test/rpict';
        process.env.HASS_DISCOVERY = 'false';
        process.env.HASS_DISCOVERY_PREFIX = 'test/homeassistant';
        process.env.SERIAL = '/dev/ttyUSB0';
        process.env.BAUD_RATE = '9600';
        process.env.DEVICE_MAPPING = 'RPICT8.json';
        process.env.PRECISION = '3';
        process.env.ABSOLUTE_VALUES = 'true';
        process.env.SENSOR_VALUE_THRESHOLD = '0.5';
        process.env.LOG_LEVEL = 'debug';

        const config = require('./index');

        expect(config.mqttUrl).toBe('mqtt://test:1883');
        expect(config.mqttUser).toBe('testuser');
        expect(config.mqttPassword).toBe('testpass');
        expect(config.mqttBaseTopic).toBe('test/rpict');
        expect(config.hassDiscovery).toBe(false);
        expect(config.hassDiscoveryPrefix).toBe('test/homeassistant');
        expect(config.serial).toBe('/dev/ttyUSB0');
        expect(config.baudRate).toBe('9600');
        expect(config.deviceMapping).toBe('RPICT8.json');
        expect(config.precision).toBe('3');
        expect(config.absoluteValues).toBe(true);
        expect(config.sensorValueThreshold).toBe('0.5');
        expect(config.logLevel).toBe('debug');
    });

    test('hassio addon options', () => {
        process.env.HASSIO_ADDON = 'true';
        process.env.HASSIO_OPTIONS_FILE = TEST_OPTIONS_FILE;

        const config = require('./index');

        expect(config).toEqual({
            mqttUrl: 'mqtt://test-server:1883',
            mqttUser: 'test-user',
            mqttPassword: 'test-password',
            mqttBaseTopic: 'test/rpict',
            hassDiscovery: false,
            hassDiscoveryPrefix: 'test/homeassistant',
            serial: '/dev/ttyTEST0',
            baudRate: 57600,
            deviceMapping: 'RPICT8.json',
            precision: 3,
            absoluteValues: true,
            sensorValueThreshold: 1.5,
            logLevel: 'debug'
        });
    });

    test('empty strings for optional values', () => {
        process.env.MQTT_USER = '';
        process.env.MQTT_PASSWORD = '';

        const config = require('./index');

        expect(config.mqttUser).toBeUndefined();
        expect(config.mqttPassword).toBeUndefined();
    });
});