# Introduction

![Docker pulls](https://img.shields.io/docker/pulls/gtricot/rpict-mqtt)
![License](https://img.shields.io/github/license/gtricot/rpict-mqtt)
![GitHub Actions](https://img.shields.io/github/actions/workflow/status/gtricot/rpict-mqtt/ci.yml)
![Maintainability](https://img.shields.io/codeclimate/maintainability/gtricot/rpict-mqtt)
![Coverage](https://img.shields.io/codeclimate/coverage/gtricot/rpict-mqtt)

[**rpict-mqtt**](https://github.com/gtricot/rpict-mqtt) is a modern bridge between [LeChacal RPICT series devices](http://lechacal.com/wiki/index.php?title=Raspberrypi_Current_and_Temperature_Sensor_Adaptor) and MQTT, designed for seamless integration with home automation systems like Home Assistant.

## Features

- 📊 Real-time monitoring of electrical measurements
- 🔌 Easy integration with MQTT systems
- 🏠 Native Home Assistant support with auto-discovery
- 🐳 Available as Docker container and Home Assistant add-on
- ⚡ Support for multiple RPICT models and measurements:
  - Voltage (V)
  - Current (A)
  - Power (W)
  - Energy (kWh)
  - Power Factor (%)

## Supported Devices

All major RPICT models are supported:

- [RPICT3T1](http://lechacal.com/wiki/index.php?title=RPICT3T1) / [RPIZ_CT3T1](http://lechacal.com/wiki/index.php?title=RPIZ_CT3T1)
- [RPICT3V1](http://lechacal.com/wiki/index.php?title=RPICT3V1) / [RPIZ_CT3V1](http://lechacal.com/wiki/index.php?title=RPIZ_CT3V1)
- [RPICT4V3](http://lechacal.com/wiki/index.php?title=RPICT4V3_Version_5)
- [RPICT7V1](http://lechacal.com/wiki/index.php?title=RPICT7V1_Version_5)
- [RPICT8](http://lechacal.com/wiki/index.php?title=RPICT8_Version_5)

## Quick start

### 1. Setup your RPICT Device

1. Follow the [LeChacal official documentation](http://lechacal.com/wiki/index.php?title=Raspberrypi_Current_and_Temperature_Sensor_Adaptor#First_time_use) to set up your device
2. Connect your RPICT device to your system
3. Note the serial port (default is `/dev/ttyAMA0`)

### 2. Choose Your Installation Method

#### A. Home Assistant Add-on (Recommended)

1. Add our repository to your Home Assistant add-on store
2. Install the "RPICT MQTT" add-on
3. Configure and start the add-on

See the [Home Assistant Integration](hass/) section for detailed instructions.

#### B. Docker Container

Deploy using the [official rpict-mqtt image](https://hub.docker.com/r/gtricot/rpict-mqtt).

See the [configuration page](configuration/) for all available options.

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

## Documentation

- [Configuration Options](configuration/) - Customize your setup
- [Home Assistant Integration](hass/) - Set up Home Assistant auto-discovery
- [MQTT Topics](mqtt/) - Understand the MQTT message structure
- [Changelog](changelog/) - See version history and updates

## Need Help?

- 📚 Check the documentation sections above
- 🐛 Report bugs or request features on [GitHub Issues](https://github.com/gtricot/rpict-mqtt/issues)
- 💡 Ask questions in [GitHub Discussions](https://github.com/gtricot/rpict-mqtt/discussions)
- ⭐ Support the project by [starring it on GitHub](https://github.com/gtricot/rpict-mqtt)!

## License

This project is licensed under the [MIT license](https://github.com/gtricot/rpict-mqtt/blob/master/LICENSE).

?> Last updated: September 2025

<!-- GitHub Buttons -->
<script async defer src="https://buttons.github.io/buttons.js"></script>