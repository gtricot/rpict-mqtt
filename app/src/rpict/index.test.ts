import { EventEmitter } from 'events';
import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import fs from 'fs/promises';

// Mock dependencies
jest.mock('serialport');
jest.mock('@serialport/parser-readline');
jest.mock('fs/promises');
jest.mock('../config/index', () => ({
    __esModule: true,
    default: {
        baudRate: 38400,
        precision: 2,
        serial: '/dev/ttyTEST0',
        deviceMapping: 'test-mapping.json',
        absoluteValues: false,
        sensorValueThreshold: 1.0,
    },
}));
jest.mock('../log/index', () => ({
    __esModule: true,
    default: {
        debug: jest.fn(),
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
    },
}));

const mockedSerialPort = SerialPort as jest.MockedClass<typeof SerialPort>;
const mockedReadlineParser = ReadlineParser as jest.MockedClass<typeof ReadlineParser>;
const mockedFs = fs as jest.Mocked<typeof fs>;

import { connectRpict, disconnectRpict } from './index';

describe('RPICT module', () => {
    let mockSerialPortInstance: any;
    let mockParserInstance: any;

    beforeEach(() => {
        jest.clearAllMocks();

        // Mock parser instance
        mockParserInstance = {
            on: jest.fn(),
        };

        // Mock serial port instance
        mockSerialPortInstance = {
            pipe: jest.fn().mockReturnValue(mockParserInstance),
            close: jest.fn(),
        };

        mockedSerialPort.mockImplementation((options, callback) => {
            // Simulate successful connection
            if (callback) {
                setTimeout(() => callback(null), 10);
            }
            return mockSerialPortInstance as any;
        });

        mockedReadlineParser.mockImplementation(() => mockParserInstance);

        // Mock device mapping file
        const mockDeviceMapping = {
            NodeID: { type: 'integer' },
            RP1: { type: 'float' },
            RP2: { type: 'float' },
            Irms1: { type: 'float' },
            Vrms: { type: 'float' },
        };
        mockedFs.readFile.mockResolvedValue(JSON.stringify(mockDeviceMapping));
    });

    describe('connectRpict', () => {
        test('should successfully connect to serial port and return EventEmitter', async () => {
            const eventEmitter = await connectRpict();

            expect(eventEmitter).toBeInstanceOf(EventEmitter);
            expect(mockedSerialPort).toHaveBeenCalledWith(
                { path: '/dev/ttyTEST0', baudRate: 38400 },
                expect.any(Function),
            );
            expect(mockSerialPortInstance.pipe).toHaveBeenCalledWith(mockParserInstance);
            expect(mockParserInstance.on).toHaveBeenCalledWith('data', expect.any(Function));
            expect(mockParserInstance.on).toHaveBeenCalledWith('error', expect.any(Function));
        });

        test('should reject on serial port connection error', async () => {
            const connectionError = new Error('Port not found');
            mockedSerialPort.mockImplementation((options, callback) => {
                if (callback) {
                    setTimeout(() => callback(connectionError), 10);
                }
                return mockSerialPortInstance as any;
            });

            await expect(connectRpict()).rejects.toThrow('Port not found');
        });

        test('should reject on device mapping loading error', async () => {
            const fileError = new Error('File not found');
            mockedFs.readFile.mockRejectedValue(fileError);

            await expect(connectRpict()).rejects.toThrow('File not found');
        });

        test('should process data when received from serial port', async () => {
            const eventEmitter = await connectRpict();
            const frameListener = jest.fn();
            eventEmitter.on('frame', frameListener);

            // Get the data handler that was registered
            const dataHandler = mockParserInstance.on.mock.calls.find((call: any[]) => call[0] === 'data')[1];

            // Simulate receiving data
            const testData = '11 123.45 67.89 456.78 234.56';
            dataHandler(testData);

            expect(frameListener).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        NodeID: 11,
                        RP1: 123.45,
                        RP2: 67.89,
                        Irms1: 456.78,
                        Vrms: 234.56,
                    }),
                    timestamp: expect.any(Number),
                    deviceMapping: expect.any(Object),
                }),
            );
        });
    });

    describe('disconnectRpict', () => {
        test('should successfully disconnect from serial port', async () => {
            // First connect to set up serialPort
            await connectRpict();

            // Mock successful close
            mockSerialPortInstance.close.mockImplementation((callback: any) => {
                callback(null);
            });

            await expect(disconnectRpict()).resolves.toBeUndefined();
            expect(mockSerialPortInstance.close).toHaveBeenCalled();
        });

        test('should reject on disconnection error', async () => {
            // First connect to set up serialPort
            await connectRpict();

            const disconnectError = new Error('Disconnect failed');
            mockSerialPortInstance.close.mockImplementation((callback: any) => {
                callback(disconnectError);
            });

            await expect(disconnectRpict()).rejects.toThrow('Disconnect failed');
        });
    });

    describe('Data sanitization functions', () => {
        let eventEmitter: EventEmitter;
        let dataHandler: (data: string) => void;

        beforeEach(async () => {
            eventEmitter = await connectRpict();
            dataHandler = mockParserInstance.on.mock.calls.find((call: any[]) => call[0] === 'data')[1];
        });

        test('should sanitize float values correctly', () => {
            const frameListener = jest.fn();
            eventEmitter.on('frame', frameListener);

            // Test normal float value
            dataHandler('11 123.456 0 0 0');
            expect(frameListener).toHaveBeenLastCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        RP1: 123.46, // Rounded to 2 decimal places
                    }),
                }),
            );
        });

        test('should handle NaN values in float sanitization', () => {
            const frameListener = jest.fn();
            eventEmitter.on('frame', frameListener);

            // Test NaN value
            dataHandler('11 invalid 0 0 0');
            expect(frameListener).toHaveBeenLastCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        RP1: 0.0, // NaN should become 0.0
                    }),
                }),
            );
        });

        test('should handle threshold values correctly', () => {
            const frameListener = jest.fn();
            eventEmitter.on('frame', frameListener);

            // Test value below threshold (threshold is 1.0)
            dataHandler('11 0.5 0 0 0');
            expect(frameListener).toHaveBeenLastCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        RP1: 0.0, // Below threshold should become 0.0
                    }),
                }),
            );
        });

        test('should sanitize integer values correctly', () => {
            const frameListener = jest.fn();
            eventEmitter.on('frame', frameListener);

            // Test normal integer value
            dataHandler('15 0 0 0 0');
            expect(frameListener).toHaveBeenLastCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        NodeID: 15,
                    }),
                }),
            );
        });

        test('should handle NaN values in integer sanitization', () => {
            const frameListener = jest.fn();
            eventEmitter.on('frame', frameListener);

            // Test NaN value for integer
            dataHandler('invalid 0 0 0 0');
            expect(frameListener).toHaveBeenLastCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        NodeID: 0, // NaN should become 0
                    }),
                }),
            );
        });

        test('should handle errors during data processing gracefully', () => {
            const frameListener = jest.fn();
            eventEmitter.on('frame', frameListener);

            // Test with insufficient data (should not crash)
            dataHandler('11');
            expect(frameListener).toHaveBeenCalled();
        });
    });

    // Note: Absolute values functionality is tested indirectly through other configuration tests
    // Direct testing of this feature requires complex module reloading which can be brittle
});
