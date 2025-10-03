import path from 'path';

// Store original environment variables
const originalEnv = { ...process.env };

// Test options file path
const TEST_OPTIONS_FILE = path.resolve(__dirname, 'options.test.json');

describe('config module', () => {
    beforeEach(() => {
        // Clear module cache before each test
        jest.resetModules();

        // Reset process.env to original state and clear config variables
        process.env = { ...originalEnv };
        delete process.env.MQTT_URL;
        delete process.env.MQTT_USER;
        delete process.env.MQTT_PASSWORD;
        delete process.env.MQTT_BASE_TOPIC;
        delete process.env.HASS_DISCOVERY;
        delete process.env.HASS_DISCOVERY_PREFIX;
        delete process.env.SERIAL;
        delete process.env.BAUD_RATE;
        delete process.env.DEVICE_MAPPING;
        delete process.env.PRECISION;
        delete process.env.ABSOLUTE_VALUES;
        delete process.env.SENSOR_VALUE_THRESHOLD;
        delete process.env.LOG_LEVEL;
        delete process.env.HASSIO_ADDON;
        delete process.env.HASSIO_OPTIONS_FILE;
    });

    afterEach(() => {
        // Restore process.env to original state after each test
        process.env = { ...originalEnv };
    });

    test('default values', async () => {
        const { default: config } = await import('./index');
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
            logLevel: 'info',
        });
    });

    test('environment variables', async () => {
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

        jest.resetModules();
        const { default: config } = await import('./index');

        expect(config.mqttUrl).toBe('mqtt://test:1883');
        expect(config.mqttUser).toBe('testuser');
        expect(config.mqttPassword).toBe('testpass');
        expect(config.mqttBaseTopic).toBe('test/rpict');
        expect(config.hassDiscovery).toBe(false);
        expect(config.hassDiscoveryPrefix).toBe('test/homeassistant');
        expect(config.serial).toBe('/dev/ttyUSB0');
        expect(config.baudRate).toBe(9600);
        expect(config.deviceMapping).toBe('RPICT8.json');
        expect(config.precision).toBe(3);
        expect(config.absoluteValues).toBe(true);
        expect(config.sensorValueThreshold).toBe(0.5);
        expect(config.logLevel).toBe('debug');
    });

    test('hassio addon options', async () => {
        process.env.HASSIO_ADDON = 'true';
        process.env.HASSIO_OPTIONS_FILE = TEST_OPTIONS_FILE;

        jest.resetModules();
        const { default: config } = await import('./index');

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
            sensorValueThreshold: 0.1,
            logLevel: 'debug',
        });
    });
});
