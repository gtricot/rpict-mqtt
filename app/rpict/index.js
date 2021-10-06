const Readline = require('@serialport/parser-readline');
const SerialPort = require('serialport');
const events = require('events');
const log = require('../log');
const {
    baudRate,
    fractionDigits,
    serial,
    deviceMapping,
    invertNegativeValues,
    sensorValueThreshold,
} = require('../config');

let serialPort;
let deviceMappingJson;

function parseDataFromTemplateParams(data, configItem) {
    let returnValue;
    const valueType = deviceMappingJson[configItem].type;
    log.debug(`Parsing value ${data} with type ${valueType} for config item ${configItem}`);
    switch (valueType) {
    case 'float':

        // Parse value
        returnValue = Number(parseFloat(data).toFixed(fractionDigits));
        log.debug(`Parsed float value ${returnValue} for config item ${configItem} with ${fractionDigits} fraction digits`);

        // Check for NaN value
        if (Number.isNaN(returnValue)) {
            log.warn(`Nan value detected for float type ${configItem} config item. Original value : ${data}. Returning 0.0 instead`);
            returnValue = 0.0;
        }

        // Invert negative value if parameterized
        if (returnValue < 0 && invertNegativeValues) {
            log.debug(`Inverting negative return value ${returnValue} for config item ${configItem}`);
            returnValue = -returnValue;
        }
        // Set value to 0.0 if inferior to threshold
        if (returnValue < sensorValueThreshold) {
            log.debug(`Return value ${returnValue} inferior to threshold ${sensorValueThreshold} for config item ${configItem}. Returning 0.0 instead`);
            returnValue = 0.0;
        }

        break;

    case 'integer':

        // Parse value
        returnValue = parseInt(data, 10);

        // Check for NaN value
        if (Number.isNaN(returnValue)) {
            log.warn(`Nan value detected for integer type ${configItem} config item. Original value : ${data}. Returning 0 instead`);
            returnValue = 0;
        }

        // Invert negative value if parameterized
        if (returnValue < 0 && invertNegativeValues) {
            log.debug(`Inverting negative return value ${returnValue} for config item ${configItem}`);
            returnValue = -returnValue;
        }
        // Set value to 0 if inferior to threshold
        if (returnValue < sensorValueThreshold) {
            log.debug(`Return value ${returnValue} inferior to threshold ${sensorValueThreshold} for config item ${configItem}. Returning 0 instead`);
            returnValue = 0;
        }

        break;
    case 'string':
        returnValue = data;
        break;
    default:
        returnValue = data;
    }

    log.debug(`Parsed value ${returnValue} from raw value ${data} with type ${valueType} for config item ${configItem}`);
    return returnValue;
}

/**
 * Process data.
 * @param {*} data
 * @param {*} rpictEventEmitter
 */
function processData(data, rpictEventEmitter) {
    // Example of values: http://lechacal.com/wiki/index.php?title=RPICT7V1_v2.0
    // NodeID RP1 RP2 RP3 RP4  RP5 RP6 RP7  rms1  Irms2 Irms3 Irms4 Irms5 Irms6  Irms7  Vrms
    // 11     0.0 0.0 0.0 -0.0 0.0 0.0 -0.0 202.1 208.6 235.3 207.2 223.4 3296.3 2310.8 0.9
    // Values from sensor are returned with space/tab between each value.
    const values = data.split(/[ ,]+/);
    let count = 0;

    // Read sensor mapping from JSON file.
    const frame = {
        deviceMapping: deviceMappingJson,
    };
    Object.keys(deviceMappingJson).forEach((key) => {
        try {
            frame[key] = parseDataFromTemplateParams(values[count], key);
        } catch (e) {
            log.error(e);
        }
        count += 1;
    });

    rpictEventEmitter.emit('frame', frame);
}

/**
 * Process errors.
 * @param {*} error
 */
function processError(error) {
    log.error('Error on reading data');
    log.error(error);
}

/**
 * Load device mapping, connect to serial port & start reading.
 */
async function connect() {
    return new Promise((resolve, reject) => {
        // Load device mapping
        log.info(`Loading device mapping [${deviceMapping}]...`);
        // eslint-disable-next-line
        deviceMappingJson = require(`./device-mapping/${deviceMapping}`);
        log.info(`Loaded device mapping [${deviceMapping}]`);
        log.debug(`Device mapping contents [${JSON.stringify(deviceMappingJson)}]`);

        // Connect to serial port
        log.info(`Connecting to port [${serial}]`);
        serialPort = new SerialPort(serial, {
            baudRate,
            autoOpen: false,
        }, (error) => {
            if (error) {
                log.error(`Error when connecting to serial port [${error.message}]`);
                reject(error);
            } else {
                const parser = serialPort.pipe(new Readline());

                const rpictEventEmitter = new events.EventEmitter();

                log.info(`Connected to port [${serial}]`);

                // Process data
                parser.on('data', (data) => processData(data, rpictEventEmitter));

                // Process error
                parser.on('error', processError);

                resolve(rpictEventEmitter);
            }
        });
    });
}

/**
 * Disconnect from serial port.
 */
async function disconnect() {
    log.info(`Disconnecting from serial port [${serial}]`);
    return new Promise((resolve, reject) => {
        serialPort.close((e) => {
            if (e) {
                log.error(`Error on disconnecting from serial port [${serial}]`);
                reject(e);
            } else {
                log.info(`Disconnected from serial port [${serial}]`);
                resolve();
            }
        });
    });
}

module.exports = {
    connect,
    disconnect,
};
