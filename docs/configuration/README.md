# Configuration
rpict-mqtt can be configured using Environment Variables.

## Environment variables

| Env var              | Description                                                                                                 | Default value          |
|----------------------|-------------------------------------------------------------------------------------------------------------|------------------------|
|SERIAL                | Serial Port location                                                                                        | /dev/ttyAMA0           |
|BAUD_RATE             | Serial Port baud rate                                                                                       | 38400                  |
|DEVICE_MAPPING        | Device mapping file (RPICT3T1.json, RPICT3V1.json, RPICT4V3_v2.0.json, RPICT7V1.json or RPICT8.json)        | RPICT7V1.json          |
|PRECISION             | Sensor precision (number of decimals returned for each sensor value)                                        | 2                      |
|ABSOLUTE_VALUES       | If true, all sensor values are in absolute value, even if some CT clamp is inverted                         | false                  |
|SENSOR_VALUE_THRESHOLD| Sensor values inferior to threshold are set to 0 (noise reduction)                                          | 0                      |
|MQTT_URL              | MQTT Broker connection URL                                                                                  | mqtt://localhost:1883  |
|MQTT_USER             | MQTT user     (optional)                                                                                    |                        |
|MQTT_PASSWORD         | MQTT password (optional)                                                                                    |                        |
|MQTT_BASE_TOPIC       | MQTT Base topic                                                                                             | rpict                  |
|HASS_DISCOVERY        | Publish configuration for Home-Assistant discovery                                                          | true                   |
|HASS_DISCOVERY_PREFIX | Topic prefix for Home-Assistant Discovery                                                                   | homeassistant          |
|LOG_LEVEL             | Log level (INFO, DEBUG, ERROR)                                                                              | INFO                   |
|LOG_FORMAT            | Log format (text, json)                                                                                     | text                   |

## Complete example

<!-- tabs:start -->
#### **Docker Compose**
```yaml
version: '3'

services:
  rpict2mqtt:
    image: gtricot/rpict-mqtt
    device:
      - /dev/ttyAMA0:/dev/ttyAMA0
    environment:
      - MQTT_URL=mqtt://my_mqtt_broker:1883
      - MQTT_USER=my-super-user
      - MQTT_PASSWORD=my-secret-password
      - MQTT_BASE_TOPIC=custom-rpict-topic
      - ABSOLUTE_VALUES=true
      - SENSOR_VALUE_THRESHOLD=2
    restart: unless-stopped
```
#### **Docker**
```bash
docker run -d --name rpict2mqtt \
  --device=/dev/ttyAMA0:/dev/ttyAMA0 \
  -e MQTT_URL="mqtt://my_mqtt_broker:1883" \
  -e MQTT_USER="my-super-user" \
  -e MQTT_PASSWORD="my-secret-password" \
  -e MQTT_BASE_TOPIC="custom-rpict-topic" \
  -e ABSOLUTE_VALUES=true \
  -e SENSOR_VALUE_THRESHOLD=2 \
  gtricot/rpict-mqtt
```
<!-- tabs:end -->