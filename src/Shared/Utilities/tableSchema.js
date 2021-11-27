import get from 'lodash/get';
import {Badge} from '@mantine/core';

import {capitalizeStr, formatDate, getAddressLabel, getOptionLabel} from './common.util';
import {VEHICLE_STATUS} from "./referenceData.util";

const renderVehicleStatus = ({value}) => {
    let result = '';
    const label = getOptionLabel(VEHICLE_STATUS, value);
    if (value === 'initial') {
        result = <Badge variant="filled" radius="sm">{label}</Badge>;
    } else if (value === 'available') {
        result = <Badge variant="filled" radius="sm" color="green">{label}</Badge>;
    } else if (value === 'in_maintenance') {
        result = <Badge variant="filled" radius="sm" color="yellow">{label}</Badge>;
    } else if (value === 'maintenance_required') {
        result = <Badge variant="filled" radius="sm" color="orange">{label}</Badge>;
    } else if (value === 'breakdown') {
        result = <Badge variant="filled" radius="sm" color="red">{label}</Badge>;
    } else if (value === 'discontinue') {
        result = <Badge variant="filled" radius="sm" color="gray">{label}</Badge>;
    }
    return result;
};

export const ROUTE_SCHEMA = [
    {accessor: 'route_code', Header: 'Route Code'},
    {accessor: 'name', Header: 'Route Name'},
    {
        accessor: 'source_address.address1', Header: 'Source', disableFilters: true,
        Cell: ({row}) => getAddressLabel(row.original.source_address)
    },
    {
        accessor: 'destination_address.address1', Header: 'Destination', disableFilters: true,
        Cell: ({row}) => getAddressLabel(row.original.destination_address)
    },
    {accessor: 'std_distance_cycle', Header: 'Distance (KM)', disableFilters: true},
    {accessor: 'std_cycle_hours', Header: 'Cycle Hours', disableFilters: true}
];

export const PRODUCT_SCHEMA = [
    {accessor: 'name', Header: 'Product Name'},
    {accessor: 'std_tonnage', Header: 'Tonnage', disableFilters: true},
    {accessor: 'volume', Header: 'Volume', disableSortBy: true, disableFilters: true}
];

export const FAULT_SCHEMA = [
    {accessor: 'name', Header: 'Name'},
    {accessor: 'fault_type', Header: 'Type', Cell: ({value}) => capitalizeStr(value)},
    {accessor: 'vehicle.vehicle_number', Header: 'Vehicle No.', Cell: ({value}) => value || ''},
    {accessor: 'description', Header: 'Description', disableSortBy: true}
];

export const TRUCK_SCHEMA = [
    {accessor: 'vehicle_number', Header: 'Truck No.'},
    {accessor: 'vehicle_category.name', Header: 'Vehicle Category', disableFilters: true},
    {accessor: 'name', Header: 'Vehicle Name', cellMinWidth: 200},
    {accessor: 'model', Header: 'Model'},
    {
        accessor: 'meter_reading', Header: 'Meter Reading', disableFilters: true,
        Cell: ({value}) => value ? <Badge radius="sm">{value} KM</Badge> : ''
    },
    {accessor: 'status', Header: 'Status', align: 'center', disableFilters: true, Cell: renderVehicleStatus}
];

export const TRAILER_SCHEMA = [
    {accessor: 'name', Header: 'Name'},
    {accessor: 'trailer_category.name', Header: 'Category', disableFilters: true},
    {accessor: 'vin_number', Header: 'VIN No.'},
    {accessor: 'model', Header: 'Model', disableFilters: true},
    {
        accessor: 'meter_reading', Header: 'Meter', align: 'center', disableFilters: true,
        Cell: ({value}) => value ? <Badge radius="sm">{value} KM</Badge> : ''
    },
    {
        accessor: 'status', Header: 'Status', align: 'center',
        disableFilters: true, Cell: renderVehicleStatus
    },
    {
        accessor: 'license_expiry', Header: 'License Expiry', align: 'center', disableFilters: true,
        Cell: ({value}) => value ? <Badge radius="sm" color="cyan">{formatDate(value)}</Badge> : ''
    }
];