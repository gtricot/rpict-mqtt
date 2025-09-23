# MQTT Protocol

## Topic Structure

RPICT-MQTT publishes data to MQTT topics in the following format:

```
$MQTT_BASE_TOPIC/$NodeId
```

Where:
- `$MQTT_BASE_TOPIC`: Base topic prefix (default: `rpict`)
  - Configurable via [`MQTT_BASE_TOPIC`](configuration/) environment variable
  - Example: `rpict/11/state` if using Home Assistant discovery
- `$NodeId`: Your RPICT device ID (default: `11`)
  - Useful when using multiple RPICT devices
  - Each device should have a unique ID

## Message Format

Messages are published as JSON documents with the following characteristics:

### Data Processing

All measurements are processed before publishing:
- Values are converted to floating-point numbers
- Values can be rounded using `PRECISION` setting
- Negative values can be converted to positive using `ABSOLUTE_VALUES`
- Small values can be filtered using `SENSOR_VALUE_THRESHOLD`

### Configuration Options

| Option | Description | Default | Example |
|--------|-------------|---------|---------|
| `PRECISION` | Number of decimal places | 2 | `3.14` vs `3.142` |
| `ABSOLUTE_VALUES` | Convert negative to positive | `false` | `-5.2` → `5.2` |
| `SENSOR_VALUE_THRESHOLD` | Minimum value (noise filter) | 0 | Values < threshold → `0` |

### Message Structure

The JSON payload varies by RPICT model but follows this pattern:
- `NodeID`: Device identifier
- `RPx`: Real power measurements (Watts)
- `Irmsx`: Current measurements (Amperes)
- `Vrms`: Voltage measurement (Volts)

### Example Message

```json
{
    "NodeID": 11,
    "RP1": 180.5,      // Real Power Channel 1 (W)
    "RP2": 20.2,       // Real Power Channel 2 (W)
    "RP3": 450.8,      // Real Power Channel 3 (W)
    "RP4": 1280.4,     // Real Power Channel 4 (W)
    "RP5": 60.8,       // Real Power Channel 5 (W)
    "RP6": 120.3,      // Real Power Channel 6 (W)
    "RP7": 5.1,        // Real Power Channel 7 (W)
    "Irms1": 917.5,    // RMS Current Channel 1 (mA)
    "Irms2": 136.6,    // RMS Current Channel 2 (mA)
    "Irms3": 3138.1,   // RMS Current Channel 3 (mA)
    "Irms4": 9404.3,   // RMS Current Channel 4 (mA)
    "Irms5": 432.6,    // RMS Current Channel 5 (mA)
    "Irms6": 837.5,    // RMS Current Channel 6 (mA)
    "Irms7": 32.8,     // RMS Current Channel 7 (mA)
    "Vrms": 235.7      // RMS Voltage (V)
}
```

## Topic Examples

Here are some common topic patterns:

1. Basic MQTT topic:
```
rpict/11
```

2. With Home Assistant discovery:
```
rpict/11/state              # State updates
homeassistant/sensor/...    # Discovery messages
```

3. Multiple devices:
```
rpict/11/state    # Device 1
rpict/12/state    # Device 2
```

?> All measurements are published at regular intervals as configured by your RPICT device.
