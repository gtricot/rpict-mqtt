import { EventEmitter } from 'events';

// Mock all dependencies before importing
jest.mock('./config/index', () => ({
    __esModule: true,
    default: {
        mqttUrl: 'mqtt://localhost:1883',
        mqttUser: 'testuser',
        mqttPassword: 'secretpassword',
        mqttBaseTopic: 'rpict',
        hassDiscovery: true,
        hassDiscoveryPrefix: 'homeassistant',
        serial: '/dev/ttyTEST0',
        baudRate: 38400,
        deviceMapping: 'test-mapping.json',
        precision: 2,
        absoluteValues: false,
        sensorValueThreshold: 1.0,
        logLevel: 'info',
    },
}));

jest.mock('./rpict/index', () => ({
    __esModule: true,
    connectRpict: jest.fn(),
    disconnectRpict: jest.fn(),
}));

jest.mock('./mqtt/index', () => ({
    __esModule: true,
    connectMqtt: jest.fn(),
    disconnectMqtt: jest.fn(),
    publishMqttFrame: jest.fn(),
}));

jest.mock('./log/index', () => ({
    __esModule: true,
    default: {
        info: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
        debug: jest.fn(),
    },
}));

// Import modules after mocking
import { run } from './index';
import { connectRpict, disconnectRpict } from './rpict/index';
import { connectMqtt, disconnectMqtt, publishMqttFrame } from './mqtt/index';
import log from './log/index';

// Cast mocked functions for better type checking
const mockedConnectMqtt = connectMqtt as jest.MockedFunction<typeof connectMqtt>;
const mockedDisconnectMqtt = disconnectMqtt as jest.MockedFunction<typeof disconnectMqtt>;
const mockedConnectRpict = connectRpict as jest.MockedFunction<typeof connectRpict>;
const mockedDisconnectRpict = disconnectRpict as jest.MockedFunction<typeof disconnectRpict>;
const mockedPublishMqttFrame = publishMqttFrame as jest.MockedFunction<typeof publishMqttFrame>;
const mockedLog = {
    info: log.info as jest.MockedFunction<any>,
    error: log.error as jest.MockedFunction<any>,
    warn: log.warn as jest.MockedFunction<any>,
    debug: log.debug as jest.MockedFunction<any>,
};

describe('Main Application (index.ts)', () => {
    let mockEventEmitter: EventEmitter;
    let processExitSpy: jest.SpyInstance;
    let processOnSpy: jest.SpyInstance;

    beforeEach(() => {
        jest.clearAllMocks();

        // Create a mock event emitter
        mockEventEmitter = new EventEmitter();

        // Mock successful connections by default
        mockedConnectMqtt.mockResolvedValue();
        mockedConnectRpict.mockResolvedValue(mockEventEmitter);
        mockedDisconnectMqtt.mockResolvedValue();
        mockedDisconnectRpict.mockResolvedValue();

        // Mock process methods
        processExitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {
            throw new Error('process.exit called');
        });
        processOnSpy = jest.spyOn(process, 'on').mockImplementation();
    });

    afterEach(() => {
        processExitSpy.mockRestore();
        processOnSpy.mockRestore();
    });

    describe('Successful startup', () => {
        it('should start application successfully with all connections', async () => {
            await run();

            // Verify startup sequence
            expect(mockedLog.info).toHaveBeenCalledWith(
                'Starting rpict-mqtt with configuration =',
                expect.objectContaining({
                    mqttUrl: 'mqtt://localhost:1883',
                    mqttUser: 'testuser',
                    mqttPassword: '<hidden>',
                    mqttBaseTopic: 'rpict',
                    hassDiscovery: true,
                }),
            );

            expect(mockedConnectMqtt).toHaveBeenCalled();
            expect(mockedConnectRpict).toHaveBeenCalled();

            // Verify signal handlers are registered
            expect(processOnSpy).toHaveBeenCalledWith('SIGTERM', expect.any(Function));
            expect(processOnSpy).toHaveBeenCalledWith('SIGINT', expect.any(Function));
        });

        it('should register frame event handler and publish frames', async () => {
            await run();

            // Create a test frame
            const testFrame = {
                timestamp: Date.now(),
                deviceMapping: { NodeID: { type: 'integer' }, RP1: { type: 'float' }, RP2: { type: 'float' } },
                data: { NodeID: 11, RP1: 123.45, RP2: 67.89 },
            };

            // Emit frame event
            mockEventEmitter.emit('frame', testFrame);

            // Verify frame was published to MQTT
            expect(mockedPublishMqttFrame).toHaveBeenCalledWith(testFrame);
        });
    });

    describe('Error handling', () => {
        it('should handle MQTT connection error gracefully', async () => {
            const mqttError = new Error('MQTT connection failed');
            mockedConnectMqtt.mockRejectedValue(mqttError);

            try {
                await run();
            } catch {
                // Expect process.exit to be called via our mock
            }

            expect(mockedLog.error).toHaveBeenCalledWith('Unable to run => See errors below');
            expect(mockedLog.error).toHaveBeenCalledWith(mqttError);
            expect(mockedDisconnectMqtt).toHaveBeenCalled();
            expect(mockedDisconnectRpict).toHaveBeenCalled();
        });

        it('should handle RPICT connection error gracefully', async () => {
            const rpictError = new Error('RPICT connection failed');
            mockedConnectRpict.mockRejectedValue(rpictError);

            try {
                await run();
            } catch {
                // Expect process.exit to be called via our mock
            }

            expect(mockedLog.error).toHaveBeenCalledWith('Unable to run => See errors below');
            expect(mockedLog.error).toHaveBeenCalledWith(rpictError);
            expect(mockedDisconnectMqtt).toHaveBeenCalled();
            expect(mockedDisconnectRpict).toHaveBeenCalled();
        });

        it('should handle both MQTT and RPICT connection successfully', async () => {
            await run();

            // Should not call error handling
            expect(mockedLog.error).not.toHaveBeenCalled();
            expect(processExitSpy).not.toHaveBeenCalled();

            // Should have connected to both services
            expect(mockedConnectMqtt).toHaveBeenCalled();
            expect(mockedConnectRpict).toHaveBeenCalled();
        });
    });

    describe('Graceful shutdown', () => {
        it('should handle SIGTERM signal and disconnect all services', async () => {
            await run();

            // Get the SIGTERM handler
            const sigtermHandler = processOnSpy.mock.calls.find((call) => call[0] === 'SIGTERM')?.[1];

            expect(sigtermHandler).toBeDefined();

            // Execute the SIGTERM handler
            if (sigtermHandler) {
                await sigtermHandler();
            }

            expect(mockedDisconnectMqtt).toHaveBeenCalled();
            expect(mockedDisconnectRpict).toHaveBeenCalled();
        });

        it('should handle SIGINT signal and disconnect all services', async () => {
            await run();

            // Get the SIGINT handler
            const sigintHandler = processOnSpy.mock.calls.find((call) => call[0] === 'SIGINT')?.[1];

            expect(sigintHandler).toBeDefined();

            // Execute the SIGINT handler
            if (sigintHandler) {
                await sigintHandler();
            }

            expect(mockedDisconnectMqtt).toHaveBeenCalled();
            expect(mockedDisconnectRpict).toHaveBeenCalled();
        });

        it('should handle disconnection errors gracefully during shutdown', async () => {
            const disconnectionError = new Error('Disconnection failed');
            mockedDisconnectMqtt.mockRejectedValue(disconnectionError);

            await run();

            // Get the SIGTERM handler and execute it
            const sigtermHandler = processOnSpy.mock.calls.find((call) => call[0] === 'SIGTERM')?.[1];

            if (sigtermHandler) {
                // The handler should not throw
                await sigtermHandler();
            }

            expect(mockedDisconnectMqtt).toHaveBeenCalled();
            expect(mockedDisconnectRpict).toHaveBeenCalled();
            expect(mockedLog.error).toHaveBeenCalledWith('Error disconnecting MQTT:', disconnectionError);
        });
    });

    describe('Configuration security', () => {
        it('should hide password in logged configuration', async () => {
            await run();

            // Verify that the logged configuration has password hidden
            expect(mockedLog.info).toHaveBeenCalledWith(
                'Starting rpict-mqtt with configuration =',
                expect.objectContaining({
                    mqttPassword: '<hidden>',
                }),
            );
        });
    });

    describe('Event integration', () => {
        it('should handle multiple frame events', async () => {
            await run();

            const frame1 = {
                timestamp: Date.now(),
                deviceMapping: {},
                data: { NodeID: 11, RP1: 100 },
            };

            const frame2 = {
                timestamp: Date.now() + 1000,
                deviceMapping: {},
                data: { NodeID: 12, RP2: 200 },
            };

            // Emit multiple frame events
            mockEventEmitter.emit('frame', frame1);
            mockEventEmitter.emit('frame', frame2);

            // Verify both frames were published
            expect(mockedPublishMqttFrame).toHaveBeenCalledTimes(2);
            expect(mockedPublishMqttFrame).toHaveBeenNthCalledWith(1, frame1);
            expect(mockedPublishMqttFrame).toHaveBeenNthCalledWith(2, frame2);
        });

        it('should continue processing frames even if publishing fails', async () => {
            // Make the first publish call fail
            const publishError = new Error('Publishing failed');
            mockedPublishMqttFrame.mockImplementationOnce(() => {
                throw publishError;
            });

            await run();

            const frame = {
                timestamp: Date.now(),
                deviceMapping: {},
                data: { NodeID: 11, RP1: 100 },
            };

            // Should not throw error when publishing fails
            expect(() => {
                mockEventEmitter.emit('frame', frame);
            }).not.toThrow();

            expect(mockedPublishMqttFrame).toHaveBeenCalledWith(frame);
            expect(mockedLog.error).toHaveBeenCalledWith('Error publishing frame to MQTT:', publishError);
        });
    });
});
