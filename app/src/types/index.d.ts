// Type declaration for Frame

export interface DeviceMappingEntry {
    type: 'integer' | 'float' | 'string';
    unit_of_measurement?: string;
    device_class?: string;
}

export interface Frame {
    data: Record<string, string | number>;
    timestamp: number;
    deviceMapping: Record<string, DeviceMappingEntry>;
}
