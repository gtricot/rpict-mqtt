/* eslint no-underscore-dangle: ["error", { "allow": ["__get__", "__set__"] }] */

import { AsyncMqttClient } from 'async-mqtt';
import mqttAsync from 'async-mqtt';
import { Frame } from '../types';

// Mock async-mqtt
jest.mock('async-mqtt');
const mockedMqttAsync = mqttAsync as jest.Mocked<typeof mqttAsync>;

// Create a more complete mock client
const mockClient = {
    publish: jest.fn().mockResolvedValue(undefined),
    subscribe: jest.fn().mockResolvedValue(undefined),
    unsubscribe: jest.fn().mockResolvedValue(undefined),
    end: jest.fn().mockResolvedValue(undefined),
    on: jest.fn(),
    off: jest.fn(),
    connected: true,
    reconnecting: false,
} as unknown as AsyncMqttClient;

mockedMqttAsync.connectAsync = jest.fn().mockResolvedValue(mockClient);

// Mock config
jest.mock('../config/index', () => ({
    __esModule: true,
    default: {
        mqttUrl: 'mqtt://localhost:1883',
        mqttUser: undefined,
        mqttPassword: undefined,
        mqttBaseTopic: 'rpict',
        hassDiscovery: true,
        hassDiscoveryPrefix: 'homeassistant',
    },
}));

import { connectMqtt, disconnectMqtt, publishMqttFrame } from './index';

const sampleFrame: Omit<Frame, 'timestamp'> = {
    data: {
        NodeID: 11,
        RP1: 180.5,
        RP2: 20.2,
        RP3: 450.8,
        RP4: 1280.4,
        RP5: 60.8,
        RP6: 120.3,
        RP7: 5.1,
        Irms1: 917.5,
        Irms2: 136.6,
        Irms3: 3138.1,
        Irms4: 9404.3,
        Irms5: 432.6,
        Irms6: 837.5,
        Irms7: 32.8,
        Vrms: 235.7,
    },
    deviceMapping: {
        NodeID: {
            type: 'integer',
            unit_of_measurement: '#',
        },
        RP1: {
            type: 'float',
            unit_of_measurement: 'W',
            device_class: 'power',
        },
    },
};

describe('MQTT module', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('connect should be called as expected', async () => {
        await connectMqtt();
        expect(mqttAsync.connectAsync).toHaveBeenCalledWith('mqtt://localhost:1883', {});
    });

    test('disconnect should be called as expected', async () => {
        // First connect to establish the client
        await connectMqtt();

        // Now disconnect - this should use the mocked client
        await disconnectMqtt();

        expect(mockClient.end).toHaveBeenCalledTimes(1);
    });

    test('publishFrame should be called as expected', async () => {
        // Mock the frame data
        const sampleFrameWithTimestamp = {
            ...sampleFrame,
            timestamp: Date.now(),
        } as Frame;

        // This test verifies the function doesn't throw when client is not available
        // The function should handle the case gracefully by logging a warning
        await expect(publishMqttFrame(sampleFrameWithTimestamp)).resolves.toBeUndefined();
    });
});
