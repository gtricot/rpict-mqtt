# Introduction

![Docker pulls](https://img.shields.io/docker/pulls/gtricot/rpict-mqtt)
![License](https://img.shields.io/github/license/gtricot/rpict-mqtt)
![Travis](https://img.shields.io/travis/gtricot/rpict-mqtt/master)
![Maintainability](https://img.shields.io/codeclimate/maintainability/gtricot/rpict-mqtt)
![Coverage](https://img.shields.io/codeclimate/coverage/gtricot/rpict-mqtt)

**rpict-mqtt** allows you to read LeChacal RPICT series device data from a Serial port and publish them to an Mqtt broker.

## Quick start

### Run the Docker image
The easiest way to start is to deploy the official _**rpict-mqtt**_ image.

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

## Contact & Support

- Create a [GitHub issue](https://github.com/gtricot/rpict-mqtt/issues) for bug reports, feature requests, or questions
- Add a ⭐️ [star on GitHub](https://github.com/gtricot/rpict-mqtt) to support the project!

## License

This project is licensed under the [MIT license](https://github.com/gtricot/rpict-mqtt/blob/master/LICENSE).

<!-- GitHub Buttons -->
<script async defer src="https://buttons.github.io/buttons.js"></script>