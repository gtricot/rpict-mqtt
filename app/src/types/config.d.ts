// Type declaration for the config module

import { DeviceMappingEntry } from './index';

declare interface Config {
    logLevel: string;
    mqttUrl: string;
    mqttUser: string;
    mqttPassword: string;
    mqttBaseTopic: string;
    hassDiscovery: boolean;
    baudRate: number;
    precision: number;
    serial: string;
    deviceMapping: Record<string, DeviceMappingEntry>;
    absoluteValues: boolean;
    sensorValueThreshold: number;
}

declare const config: Config;
export default config;
