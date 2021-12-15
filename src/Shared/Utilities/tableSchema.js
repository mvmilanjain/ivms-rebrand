import {Badge} from '@mantine/core';

import {capitalizeStr, formatDate, formatDateTime, getAddressLabel, getFullName, getOptionLabel} from './common.util';
import {VEHICLE_STATUS} from './referenceData.util';

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
    {accessor: 'vehicle.name', Header: 'Vehicle', Cell: ({value}) => value || ''},
    {accessor: 'description', Header: 'Description', disableSortBy: true}
];

export const INSPECTION = {
    INSPECTION_FORM: [],
    INSPECTION_REPORT: [
        {accessor: 'report_number', Header: 'Report No.'},
        {accessor: 'created_at', Header: 'Date', Cell: ({value}) => formatDateTime(value)},
        {accessor: 'vehicle.vehicle_number', Header: 'Vehicle'},
        {
            accessor: 'location', Header: 'Location',
            Cell: ({row}) => row.original.location ? getAddressLabel(row.original.location) : ''
        },
        {
            accessor: 'inspector', Header: 'Inspector', disableSortBy: true,
            Cell: ({row}) => getFullName(row.original.inspector.first_name, row.original.inspector.last_name)
        }
    ]
};

export const MAINTENANCE = {
    LABOR_CODE_SCHEMA: [
        {accessor: 'code', Header: 'Labor Code'},
        {accessor: 'hourly_rate', Header: 'Hourly Rate'},
        {accessor: 'supplier.name', Header: 'Supplier'},
        {accessor: 'travel', Header: 'Travel'},
        {accessor: 'call_out', Header: 'Call Out'}
    ],
    ORDER_SCHEMA: [
        {accessor: 'work_order_number', Header: 'Order no.'},
        {accessor: 'created_at', Header: 'Create Date', Cell: ({value}) => value ? formatDateTime(value) : ''},
        {accessor: 'vehicle.vehicle_number', Header: 'Vehicle'},
        {accessor: 'due_date', Header: 'Due Date', Cell: ({value}) => value ? formatDateTime(value) : ''},
        {accessor: 'status', Header: 'Status'},
        {accessor: 'priority', Header: 'Priority'},
        {
            accessor: 'assignee', Header: 'Assigned To', disableSortBy: true,
            Cell: ({row}) => getFullName(row.original.assignee.first_name, row.original.assignee.last_name)
        }
    ],
    SCHEDULE_SCHEMA: [
        {accessor: 'title', Header: 'Name'},
        {accessor: 'vehicle.vehicle_number', Header: 'Truck No.'},
        {accessor: 'workorder', Header: 'Workorder'}
    ]
};

export const VEHICLE = {
    TRUCK_SCHEMA: [
        {accessor: 'vehicle_number', Header: 'Truck No.'},
        {accessor: 'name', Header: 'Name'},
        {accessor: 'vehicle_category.name', Header: 'Category'},
        {accessor: 'model', Header: 'Model'},
        {
            accessor: 'meter_reading', Header: 'Meter Reading',
            Cell: ({value}) => value ? <Badge radius="sm">{value} KM</Badge> : ''
        },
        {accessor: 'status', Header: 'Status', align: 'center', Cell: renderVehicleStatus}
    ],
    TRAILER_SCHEMA: [
        {accessor: 'name', Header: 'Name'},
        {accessor: 'trailer_category.name', Header: 'Category'},
        {accessor: 'vin_number', Header: 'VIN No.'},
        {accessor: 'model', Header: 'Model', disableFilters: true},
        {
            accessor: 'meter_reading', Header: 'Meter', align: 'center',
            Cell: ({value}) => value ? <Badge radius="sm">{value} KM</Badge> : ''
        },
        {
            accessor: 'status', Header: 'Status', align: 'center',
            Cell: renderVehicleStatus
        },
        {
            accessor: 'license_expiry', Header: 'License Expiry', align: 'center',
            Cell: ({value}) => value ? <Badge radius="sm" color="cyan">{formatDate(value)}</Badge> : ''
        }
    ]
};