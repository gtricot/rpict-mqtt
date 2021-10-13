const hass = require('./hass');

const sampleFrame = {
    data: {
        NodeID: '11',
        RP1: '180.5',
        RP2: '20.2',
        RP3: '450.8',
        RP4: '1280.4',
        RP5: '60.8',
        RP6: '120.3',
        RP7: '5.1',
        Irms1: '917.5',
        Irms2: '136.6',
        Irms3: '3138.1',
        Irms4: '9404.3',
        Irms5: '432.6',
        Irms6: '837.5',
        Irms7: '32.8',
        Vrms: '235.7',
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
        RP2: {
            type: 'float',
            unit_of_measurement: 'W',
            device_class: 'power',
        },
        RP3: {
            type: 'float',
            unit_of_measurement: 'W',
            device_class: 'power',
        },
        RP4: {
            type: 'float',
            unit_of_measurement: 'W',
            device_class: 'power',
        },
        RP5: {
            type: 'float',
            unit_of_measurement: 'W',
            device_class: 'power',
        },
        RP6: {
            type: 'float',
            unit_of_measurement: 'W',
            device_class: 'power',
        },
        RP7: {
            type: 'float',
            unit_of_measurement: 'W',
            device_class: 'power',
        },
        Irms1: {
            type: 'float',
            unit_of_measurement: 'mA',
            device_class: 'current',
        },
        Irms2: {
            type: 'float',
            unit_of_measurement: 'mA',
            device_class: 'current',
        },
        Irms3: {
            type: 'float',
            unit_of_measurement: 'mA',
            device_class: 'current',
        },
        Irms4: {
            type: 'float',
            unit_of_measurement: 'mA',
            device_class: 'current',
        },
        Irms5: {
            type: 'float',
            unit_of_measurement: 'mA',
            device_class: 'current',
        },
        Irms6: {
            type: 'float',
            unit_of_measurement: 'mA',
            device_class: 'current',
        },
        Irms7: {
            type: 'float',
            unit_of_measurement: 'mA',
            device_class: 'current',
        },
        Vrms: {
            type: 'float',
            unit_of_measurement: 'V',
            device_class: 'voltage',
        },
    },
};

test('publishConfigurationForDiscovery should be called as expected', async () => {
    const mqttClientMock = {
        publish: jest.fn(() => {
        }),
    };
    await hass.publishConfigurationForHassDiscovery(mqttClientMock, '11', sampleFrame);
    expect(mqttClientMock.publish).toHaveBeenCalledTimes(16);
    expect(mqttClientMock.publish).toHaveBeenNthCalledWith(1, 'homeassistant/sensor/rpict/11_nodeid/config', JSON.stringify({
        unique_id: 'rpict_11_NodeID',
        name: 'RPICT 11 NodeID',
        state_topic: 'rpict/11',
        value_template: '{{ value_json.NodeID }}',
        state_class: 'measurement',
        unit_of_measurement: '#',
        device: {
            identifiers: ['11'],
            manufacturer: 'LeChacal',
            model: 'rpict_11',
            name: 'RPICT 11',
        },
    }), { retain: true });
    expect(mqttClientMock.publish).toHaveBeenNthCalledWith(2, 'homeassistant/sensor/rpict/11_rp1/config', JSON.stringify({
        unique_id: 'rpict_11_RP1',
        name: 'RPICT 11 RP1',
        state_topic: 'rpict/11',
        value_template: '{{ value_json.RP1 }}',
        device_class: 'power',
        state_class: 'measurement',
        unit_of_measurement: 'W',
        device: {
            identifiers: ['11'],
            manufacturer: 'LeChacal',
            model: 'rpict_11',
            name: 'RPICT 11',
        },
    }), { retain: true });
    expect(mqttClientMock.publish).toHaveBeenNthCalledWith(3, 'homeassistant/sensor/rpict/11_rp2/config', JSON.stringify({
        unique_id: 'rpict_11_RP2',
        name: 'RPICT 11 RP2',
        state_topic: 'rpict/11',
        value_template: '{{ value_json.RP2 }}',
        device_class: 'power',
        state_class: 'measurement',
        unit_of_measurement: 'W',
        device: {
            identifiers: ['11'],
            manufacturer: 'LeChacal',
            model: 'rpict_11',
            name: 'RPICT 11',
        },
    }), { retain: true });
    expect(mqttClientMock.publish).toHaveBeenNthCalledWith(4, 'homeassistant/sensor/rpict/11_rp3/config', JSON.stringify({
        unique_id: 'rpict_11_RP3',
        name: 'RPICT 11 RP3',
        state_topic: 'rpict/11',
        value_template: '{{ value_json.RP3 }}',
        device_class: 'power',
        state_class: 'measurement',
        unit_of_measurement: 'W',
        device: {
            identifiers: ['11'],
            manufacturer: 'LeChacal',
            model: 'rpict_11',
            name: 'RPICT 11',
        },
    }), { retain: true });
    expect(mqttClientMock.publish).toHaveBeenNthCalledWith(5, 'homeassistant/sensor/rpict/11_rp4/config', JSON.stringify({
        unique_id: 'rpict_11_RP4',
        name: 'RPICT 11 RP4',
        state_topic: 'rpict/11',
        value_template: '{{ value_json.RP4 }}',
        device_class: 'power',
        state_class: 'measurement',
        unit_of_measurement: 'W',
        device: {
            identifiers: ['11'],
            manufacturer: 'LeChacal',
            model: 'rpict_11',
            name: 'RPICT 11',
        },
    }), { retain: true });
    expect(mqttClientMock.publish).toHaveBeenNthCalledWith(6, 'homeassistant/sensor/rpict/11_rp5/config', JSON.stringify({
        unique_id: 'rpict_11_RP5',
        name: 'RPICT 11 RP5',
        state_topic: 'rpict/11',
        value_template: '{{ value_json.RP5 }}',
        device_class: 'power',
        state_class: 'measurement',
        unit_of_measurement: 'W',
        device: {
            identifiers: ['11'],
            manufacturer: 'LeChacal',
            model: 'rpict_11',
            name: 'RPICT 11',
        },
    }), { retain: true });
    expect(mqttClientMock.publish).toHaveBeenNthCalledWith(7, 'homeassistant/sensor/rpict/11_rp6/config', JSON.stringify({
        unique_id: 'rpict_11_RP6',
        name: 'RPICT 11 RP6',
        state_topic: 'rpict/11',
        value_template: '{{ value_json.RP6 }}',
        device_class: 'power',
        state_class: 'measurement',
        unit_of_measurement: 'W',
        device: {
            identifiers: ['11'],
            manufacturer: 'LeChacal',
            model: 'rpict_11',
            name: 'RPICT 11',
        },
    }), { retain: true });
    expect(mqttClientMock.publish).toHaveBeenNthCalledWith(8, 'homeassistant/sensor/rpict/11_rp7/config', JSON.stringify({
        unique_id: 'rpict_11_RP7',
        name: 'RPICT 11 RP7',
        state_topic: 'rpict/11',
        value_template: '{{ value_json.RP7 }}',
        device_class: 'power',
        state_class: 'measurement',
        unit_of_measurement: 'W',
        device: {
            identifiers: ['11'],
            manufacturer: 'LeChacal',
            model: 'rpict_11',
            name: 'RPICT 11',
        },
    }), { retain: true });
    expect(mqttClientMock.publish).toHaveBeenNthCalledWith(9, 'homeassistant/sensor/rpict/11_irms1/config', JSON.stringify({
        unique_id: 'rpict_11_Irms1',
        name: 'RPICT 11 Irms1',
        state_topic: 'rpict/11',
        value_template: '{{ value_json.Irms1 }}',
        device_class: 'current',
        state_class: 'measurement',
        unit_of_measurement: 'mA',
        device: {
            identifiers: ['11'],
            manufacturer: 'LeChacal',
            model: 'rpict_11',
            name: 'RPICT 11',
        },
    }), { retain: true });
    expect(mqttClientMock.publish).toHaveBeenNthCalledWith(10, 'homeassistant/sensor/rpict/11_irms2/config', JSON.stringify({
        unique_id: 'rpict_11_Irms2',
        name: 'RPICT 11 Irms2',
        state_topic: 'rpict/11',
        value_template: '{{ value_json.Irms2 }}',
        device_class: 'current',
        state_class: 'measurement',
        unit_of_measurement: 'mA',
        device: {
            identifiers: ['11'],
            manufacturer: 'LeChacal',
            model: 'rpict_11',
            name: 'RPICT 11',
        },
    }), { retain: true });
    expect(mqttClientMock.publish).toHaveBeenNthCalledWith(11, 'homeassistant/sensor/rpict/11_irms3/config', JSON.stringify({
        unique_id: 'rpict_11_Irms3',
        name: 'RPICT 11 Irms3',
        state_topic: 'rpict/11',
        value_template: '{{ value_json.Irms3 }}',
        device_class: 'current',
        state_class: 'measurement',
        unit_of_measurement: 'mA',
        device: {
            identifiers: ['11'],
            manufacturer: 'LeChacal',
            model: 'rpict_11',
            name: 'RPICT 11',
        },
    }), { retain: true });
    expect(mqttClientMock.publish).toHaveBeenNthCalledWith(12, 'homeassistant/sensor/rpict/11_irms4/config', JSON.stringify({
        unique_id: 'rpict_11_Irms4',
        name: 'RPICT 11 Irms4',
        state_topic: 'rpict/11',
        value_template: '{{ value_json.Irms4 }}',
        device_class: 'current',
        state_class: 'measurement',
        unit_of_measurement: 'mA',
        device: {
            identifiers: ['11'],
            manufacturer: 'LeChacal',
            model: 'rpict_11',
            name: 'RPICT 11',
        },
    }), { retain: true });
    expect(mqttClientMock.publish).toHaveBeenNthCalledWith(13, 'homeassistant/sensor/rpict/11_irms5/config', JSON.stringify({
        unique_id: 'rpict_11_Irms5',
        name: 'RPICT 11 Irms5',
        state_topic: 'rpict/11',
        value_template: '{{ value_json.Irms5 }}',
        device_class: 'current',
        state_class: 'measurement',
        unit_of_measurement: 'mA',
        device: {
            identifiers: ['11'],
            manufacturer: 'LeChacal',
            model: 'rpict_11',
            name: 'RPICT 11',
        },
    }), { retain: true });
    expect(mqttClientMock.publish).toHaveBeenNthCalledWith(14, 'homeassistant/sensor/rpict/11_irms6/config', JSON.stringify({
        unique_id: 'rpict_11_Irms6',
        name: 'RPICT 11 Irms6',
        state_topic: 'rpict/11',
        value_template: '{{ value_json.Irms6 }}',
        device_class: 'current',
        state_class: 'measurement',
        unit_of_measurement: 'mA',
        device: {
            identifiers: ['11'],
            manufacturer: 'LeChacal',
            model: 'rpict_11',
            name: 'RPICT 11',
        },
    }), { retain: true });
    expect(mqttClientMock.publish).toHaveBeenNthCalledWith(15, 'homeassistant/sensor/rpict/11_irms7/config', JSON.stringify({
        unique_id: 'rpict_11_Irms7',
        name: 'RPICT 11 Irms7',
        state_topic: 'rpict/11',
        value_template: '{{ value_json.Irms7 }}',
        device_class: 'current',
        state_class: 'measurement',
        unit_of_measurement: 'mA',
        device: {
            identifiers: ['11'],
            manufacturer: 'LeChacal',
            model: 'rpict_11',
            name: 'RPICT 11',
        },
    }), { retain: true });
    expect(mqttClientMock.publish).toHaveBeenNthCalledWith(16, 'homeassistant/sensor/rpict/11_vrms/config', JSON.stringify({
        unique_id: 'rpict_11_Vrms',
        name: 'RPICT 11 Vrms',
        state_topic: 'rpict/11',
        value_template: '{{ value_json.Vrms }}',
        device_class: 'voltage',
        state_class: 'measurement',
        unit_of_measurement: 'V',
        device: {
            identifiers: ['11'],
            manufacturer: 'LeChacal',
            model: 'rpict_11',
            name: 'RPICT 11',
        },
    }), { retain: true });
});
