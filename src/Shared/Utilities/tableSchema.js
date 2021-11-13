import get from 'lodash/get';
import {Badge} from '@mantine/core';

import {capitalizeStr, formatDate, getAddressLabel, getOptionLabel} from './common.util';
import {VEHICLE_STATUS} from "./referenceData.util";

const renderVehicleStatus = (status) => {
    let result = '';
    if(status === 'available') {
        result = <Badge variant="filled" color="green" fullWidth>{getOptionLabel(VEHICLE_STATUS, status)}</Badge>;
    } else if(status === 'in_maintenance') {
        result = <Badge variant="filled" color="yellow" fullWidth>{getOptionLabel(VEHICLE_STATUS, status)}</Badge>;
    } else if(status === 'maintenance_required') {
        result = <Badge variant="filled" color="orange" fullWidth>{getOptionLabel(VEHICLE_STATUS, status)}</Badge>;
    } else if(status === 'breakdown') {
        result = <Badge variant="filled" color="red" fullWidth>{getOptionLabel(VEHICLE_STATUS, status)}</Badge>;
    } else if(status === 'discontinue') {
        result = <Badge variant="filled" color="gray" fullWidth>{getOptionLabel(VEHICLE_STATUS, status)}</Badge>;
    }
    return result;
};

export const ROUTE_SCHEMA = [
    {id: 'route_code', header: 'Route Code', sort: true, width: 150},
    {id: 'name', header: 'Route Name', sort: true},
    {id: 'source_address', header: 'Source', render: (row) => getAddressLabel(row.source_address)},
    {id: 'destination_address', header: 'Destination', render: (row) => getAddressLabel(row.destination_address)},
    {id: 'std_distance_cycle', header: 'Distance (KM)', sort: true, width: 162},
    {id: 'std_cycle_hours', header: 'Cycle Hours', sort: true, width: 148}
];

export const PRODUCT_SCHEMA = [
    {id: 'name', header: 'Product Name', sort: true},
    {id: 'std_tonnage', header: 'Tonnage', sort: true},
    {id: 'volume', header: 'Volume', sort: true}
];

export const FAULT_SCHEMA = [
    {id: 'name', header: 'Name', sort: true},
    {id: 'fault_type', header: 'Type', render: (row) => capitalizeStr(row.fault_type), sort: true},
    {
        id: 'vehicle.vehicle_number', header: 'Vehicle No.', sort: true,
        render: (row) => get(row, 'vehicle.vehicle_number', '')
    },
    {id: 'description', header: 'Description'}
];

export const TRUCK_SCHEMA = [
    {id: 'vehicle_number', header: 'Truck No.', sort: true},
    {
        id: 'vehicle_category.name', header: 'Vehicle Category', sort: true,
        render: (row) => get(row, 'vehicle_category.name', '')
    },
    {id: 'name', header: 'Vehicle Name', sort: true},
    {id: 'model', header: 'Model', sort: true},
    {
        id: 'meter_reading', header: 'Meter Reading', sort: true, align: 'center',
        render: (row) => row.meter_reading ? <Badge variant="dot" fullWidth>{row.meter_reading} KM</Badge> : ''
    },
    {id: 'status', header: 'Status', sort: true, align: 'center', render: ({status}) => renderVehicleStatus(status)}
];

export const TRAILER_SCHEMA = [
    {id: 'name', header: 'Name', sort: true},
    {id: 'trailer_category_name', header: 'Category', sort: true},
    {id: 'vin_number', header: 'VIN No.', sort: true},
    {id: 'model', header: 'Model', sort: true},
    {
        id: 'meter_reading', header: 'Meter', sort: true, align: 'center',
        render: (row) => row.meter_reading ? <Badge variant="dot" fullWidth>{row.meter_reading} KM</Badge> : ''
    },
    {id: 'status', header: 'Status', sort: true, align: 'center', render: ({status}) => renderVehicleStatus(status)},
    {id: 'license_expiry', header: 'License Expiry', sort: true, render: ({license_expiry}) => formatDate(license_expiry)}
];