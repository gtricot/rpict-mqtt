/* eslint no-underscore-dangle: ["error", { "allow": ["__get__", "__set__"] }] */

const rewire = require('rewire');
const mqttAsync = require('async-mqtt');

mqttAsync.connectAsync = jest.fn(() => {
});
const mqtt = require('./index');

const sampleFrame = {
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
};

test('connect should be called as expected', async () => {
    const moduleToTest = rewire('./index');
    moduleToTest.__set__('client', {
        publish: jest.fn(() => {
        }),
    });
    await mqtt.connect();
    expect(mqttAsync.connectAsync).toHaveBeenCalledWith('mqtt://localhost:1883', {});
});

test('disconnect should be called as expected', async () => {
    const moduleToTest = rewire('./index');
    moduleToTest.__set__('client', {
        end: jest.fn(() => {
        }),
    });
    await moduleToTest.disconnect();
    expect(moduleToTest.__get__('client').end).toHaveBeenCalledTimes(1);
});

test('publishFrame should be called as expected', () => {
    const moduleToTest = rewire('./index');
    moduleToTest.__set__('client', {
        publish: jest.fn(() => {
        }),
    });
    moduleToTest.__set__('discoveryConfigurationPublished', true);
    moduleToTest.publishFrame(sampleFrame);
    expect(moduleToTest.__get__('client').publish).toHaveBeenCalledWith('rpict/11', JSON.stringify(sampleFrame.data));
});
