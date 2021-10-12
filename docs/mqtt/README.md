# Mqtt

## Topic
Messages are published to a `$MQTT_BASE_TOPIC/$NodeId` topic.

?> [`$MQTT_BASE_TOPIC`](configuration/) is configured by env var (`rpict` by default)

?> `$NodeId` is the node id of your LeChacal RPICT device (11 by default, other value if you are stacking multiple RPICT devices)

## Message
Messages are JSON documents whose content may vary upon your RPICT device.

?> Values are sanitized and converted to float values.  
You can modify this behavior using some env variables :
- PRECISION : Set float values precision (number of decimals)
- ABSOLUTE_VALUES : If true, negative values are inverted
- SENSOR_VALUE_THRESHOLD : Sensor values inferior to threshold are set to 0 (noise reduction)

### Example
```json
{
    "NodeID": 11,
    "RP1": 180.5,
    "RP2": 20.2,
    "RP3": 450.8,
    "RP4": 1280.4,
    "RP5": 60.8,
    "RP6": 120.3,
    "RP7": 5.1,
    "Irms1": 917.5,
    "Irms2": 136.6,
    "Irms3": 3138.1,
    "Irms4": 9404.3,
    "Irms5": 432.6,
    "Irms6": 837.5,
    "Irms7": 32.8,
    "Vrms": 235.7}
```
