import {Badge, Text, ThemeIcon, Tooltip} from '@mantine/core';
import {CalendarIcon, CheckIcon, Cross2Icon} from '@modulz/radix-icons';

import {TRIP_STATUS} from './constant';
import {capitalizeStr, formatDate, formatDateTime, getAddressLabel, getFullName, getOptionLabel} from './common.util';
import {POD_STATUS, TRIP_STATUS as TRIP_STATUS_LIST, VEHICLE_STATUS} from './referenceData.util';

const renderBoolean = ({value}) => {
    let result = '';
    if (typeof value === 'boolean') {
        result = value ?
            <ThemeIcon variant="light" color="green"><CheckIcon/></ThemeIcon> :
            <ThemeIcon variant="light" color="red"><Cross2Icon/></ThemeIcon>;
    }
    return result;
};

const renderDate = (val) => {
    let result = '';
    if (val) {
        result = <Badge radius="sm" color="cyan" leftSection={<CalendarIcon style={{width: 10, height: 10}}/>}>
            {formatDate(val)}
        </Badge>
    }
    return result;
};

const renderDateTime = (val) => {
    let result = '';
    if (val) {
        result = <Badge radius="sm" color="cyan" leftSection={<CalendarIcon style={{width: 10, height: 10}}/>}>
            {formatDateTime(val)}
        </Badge>
    }
    return result;
};

const renderTextWithTooltip = (val) => <Tooltip label={val} withArrow>
    <Text size="sm" lineClamp={1}>{val}</Text>
</Tooltip>;

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

const renderTripStatus = ({value}) => {
    let result = '';
    const label = getOptionLabel(TRIP_STATUS_LIST, value);
    if (value === TRIP_STATUS.NOT_STARTED) {
        result = <Badge variant="filled" radius="sm">{label}</Badge>;
    } else if (value === TRIP_STATUS.COMPLETED) {
        result = <Badge variant="filled" radius="sm" color="green">{label}</Badge>;
    } else if (value === TRIP_STATUS.IN_PROGRESS) {
        result = <Badge variant="filled" radius="sm" color="orange">{label}</Badge>;
    } else if (value === TRIP_STATUS.CANCELLED) {
        result = <Badge variant="filled" radius="sm" color="red">{label}</Badge>;
    }
    return result;
};

const renderPodStatus = ({value}) => {
    let result = '';
    const label = getOptionLabel(POD_STATUS, value);
    if (value === 'awaited') {
        result = <Badge variant="filled" radius="sm">{label}</Badge>;
    } else if (value === 'in_progress') {
        result = <Badge variant="filled" radius="sm" color="orange">{label}</Badge>;
    } else if (value === 'incomplete') {
        result = <Badge variant="filled" radius="sm" color="yellow">{label}</Badge>;
    } else if (value === 'received') {
        result = <Badge variant="filled" radius="sm" color="green">{label}</Badge>;
    } else if (value === 'cancelled') {
        result = <Badge variant="filled" radius="sm" color="red">{label}</Badge>;
    } else if (value === 'empty_leg') {
        result = <Badge variant="filled" radius="sm" color="gray">Empty Leg</Badge>;
    }
    return result;
};

export const ROUTE_SCHEMA = [
    {accessor: 'route_code', Header: 'Code'},
    {accessor: 'name', Header: 'Name', Cell: ({value}) => renderTextWithTooltip(value)},
    {
        accessor: 'source_address.address1', Header: 'Source',
        Cell: ({row}) => renderTextWithTooltip(getAddressLabel(row.original.source_address))
    },
    {
        accessor: 'destination_address.address1', Header: 'Destination',
        Cell: ({row}) => renderTextWithTooltip(getAddressLabel(row.original.destination_address))
    },
    {
        accessor: 'std_distance_cycle', Header: 'Distance', align: 'center',
        Cell: ({value}) => value ? <Badge radius="sm">{value} KM</Badge> : ''
    },
    {
        accessor: 'std_cycle_hours', Header: 'Cycle Hours', align: 'center',
        cellMinWidth: 160, Cell: ({value}) => value ? <Badge radius="sm">{value}</Badge> : ''
    }
];

export const ROUTE_PLANNER_SCHEMA = {
    PLANNING: [
        {accessor: 'order_number', Header: 'Order #', cellMinWidth: 120},
        {accessor: 'status', Header: 'Status', align: 'center', Cell: renderTripStatus},
        {
            accessor: 'planned_load_start_time', Header: 'Planned Start Time',
            cellMinWidth: 200, Cell: ({value}) => renderDateTime(value)
        },
        {
            accessor: 'planned_eta_destination', Header: 'Planned End Time', cellMinWidth: 200,
            Cell: ({value}) => renderDateTime(value)
        },
        {accessor: 'vehicle.name', Header: 'Truck', cellMinWidth: 120, Cell: ({value}) => renderTextWithTooltip(value)},
        {
            accessor: 'member', Header: 'Driver', Cell: ({row}) => renderTextWithTooltip(
                getFullName(row.original.member.first_name, row.original.member.last_name)
            ),
            exportValue: (member) => getFullName(member.first_name, member.last_name)
        },
        {
            accessor: 'route.route_code', Header: 'Route', cellMinWidth: 100,
            Cell: ({value}) => renderTextWithTooltip(value)
        },
        {accessor: 'product.name', Header: 'Product', cellMinWidth: 150},
        {
            accessor: 'planned_distance', Header: 'Distance', align: 'center',
            Cell: ({value}) => value ? <Badge radius="sm">{value} KM</Badge> : ''
        },
        {accessor: 'planned_cycle_time', Header: 'Cycle Time', cellMinWidth: 140, align: 'center'},
        // {accessor: 'rate_per_tone', Header: 'Current Rate'},
        {accessor: 'is_empty_leg', Header: 'Empty Leg', cellMinWidth: 140, align: 'center', Cell: renderBoolean},
        // {accessor: 'equivalent_loads', Header: 'Equivalent Loads'},
        // {accessor: 'planned_fuel', Header: 'Fuel required'},
        {accessor: 'pod_status', Header: 'POD Status', align: 'center', Cell: renderPodStatus}
    ],
    OPERATIONS: [
        {accessor: 'order_number', Header: 'Order #', cellMinWidth: 120},
        {accessor: 'status', Header: 'Status', align: 'center', Cell: renderTripStatus},
        {
            accessor: 'route_order_actual_info.start_time', Header: 'Actual Start Time',
            cellMinWidth: 182, Cell: ({value}) => renderDateTime(value)
        },
        {
            accessor: 'route_order_actual_info.end_time', Header: 'Actual End Time',
            cellMinWidth: 180, Cell: ({value}) => renderDateTime(value)
        },
        {accessor: 'vehicle.name', Header: 'Truck', cellMinWidth: 120, Cell: ({value}) => renderTextWithTooltip(value)},
        {
            accessor: 'member', Header: 'Driver', Cell: ({row}) => renderTextWithTooltip(
                getFullName(row.original.member.first_name, row.original.member.last_name)
            ),
            exportValue: (member) => getFullName(member.first_name, member.last_name)
        },
        {
            accessor: 'route.route_code', Header: 'Route', cellMinWidth: 100,
            Cell: ({value}) => renderTextWithTooltip(value)
        },
        {
            accessor: 'route_order_actual_info.fuel_liters_filled', Header: 'Fuel Filled', align: 'center',
            cellMinWidth: 140, Cell: ({value}) => value ? <Badge radius="sm">{value} ltr</Badge> : ''
        },
        {
            accessor: 'route_order_actual_info.distance', Header: 'Distance', align: 'center',
            Cell: ({value}) => value ? <Badge radius="sm">{value} KM</Badge> : ''
        },
        {
            accessor: 'route_order_actual_info.tonnage_loaded',
            Header: 'Tonnage Loaded', align: 'center', cellMinWidth: 180
        },
        {accessor: 'route_order_actual_info.pod_number', Header: 'POD #', cellMinWidth: 140},
        {accessor: 'route_order_actual_info.delivery_note_number', Header: 'Delivery Note #', cellMinWidth: 170}
    ],
    FINANCE: [
        {accessor: 'order_number', Header: 'Order #', cellMinWidth: 120},
        {accessor: 'status', Header: 'Status', align: 'center', Cell: renderTripStatus},
        {accessor: 'document_validated', Header: 'Document Validated', align: 'center', Cell: renderBoolean},
        {accessor: 'document_sent_to_client', Header: 'Document Send to Client', align: 'center', Cell: renderBoolean},
        {accessor: 'payment_recieved', Header: 'Payment Received', align: 'center', Cell: renderBoolean},
        {accessor: 'invoice_recieved', Header: 'Invoice Sent', align: 'center', Cell: renderBoolean}
    ]
};

export const ALL_MONTH_SCHEMA = [
    {accessor: '1', Header: 'Jan'},
    {accessor: '2', Header: 'Feb'},
    {accessor: '3', Header: 'Mar'},
    {accessor: '4', Header: 'Apr'},
    {accessor: '5', Header: 'May'},
    {accessor: '6', Header: 'Jun'},
    {accessor: '7', Header: 'Jul'},
    {accessor: '8', Header: 'Aug'},
    {accessor: '9', Header: 'Sep'},
    {accessor: '10', Header: 'Oct'},
    {accessor: '11', Header: 'Nov'},
    {accessor: '12', Header: 'Dec'}
];

export const DASHBOARD = {
    SUMMARY_REVENUE: [
        {accessor: 'type', Header: 'Load Type'},
        {accessor: 'total', Header: 'Total'},
        ...ALL_MONTH_SCHEMA
    ],
    SUMMARY_POD: [
        {accessor: 'type', Header: 'POD Type'},
        {accessor: 'total', Header: 'Total'},
        ...ALL_MONTH_SCHEMA
    ],
    SUMMARY_INVOICE: [
        {accessor: 'type', Header: 'Invoice Type'},
        {accessor: 'total', Header: 'Total'},
        ...ALL_MONTH_SCHEMA
    ],
    REPORTS: {
        REVENUE_MASTER: [
            {accessor: 'order_number', Header: 'Order #', align: 'center', cellMinWidth: 80},
            {accessor: 'order_date', Header: 'Order Date', Cell: ({value}) => renderDate(value)},
            {accessor: 'driver_name', Header: 'Driver', Cell: ({value}) => renderTextWithTooltip(value)},
            {accessor: 'vehicle_number', Header: 'Registration No.', align: 'center', cellMinWidth: 140},
            {
                accessor: 'route_name', Header: 'Trip (Start to End)', cellMinWidth: 180,
                Cell: ({value}) => renderTextWithTooltip(value)
            },
            {accessor: 'type_of_load', Header: 'Type of Load', cellMinWidth: 160},
            {accessor: 'pod_status', Header: 'Pod Status', align: 'center', Cell: renderPodStatus},
            {
                accessor: 'pod_number', Header: 'Pod #', align: 'center',
                Cell: ({value}) => value ? <Badge radius="sm">{value}</Badge> : ''
            },
            {accessor: 'delivery_note_number', Header: 'Delivery note #', cellMinWidth: 130},
            {accessor: 'tonnage_loaded', Header: 'Load Weight', cellMinWidth: 110},
            {accessor: 'rate_per_ton', Header: 'Rate'},
            {accessor: 'loading_distance', Header: 'Planned Distance', cellMinWidth: 144},
            {accessor: 'actual_distance', Header: 'Actual Distance', cellMinWidth: 134},
            {accessor: 'planned_cost', Header: 'Planned Cost', cellMinWidth: 120},
            {accessor: 'actual_cost', Header: 'Actual Cost', cellMinWidth: 110},
            {accessor: 'pod_collected', Header: 'POD Collected', cellMinWidth: 124, Cell: renderBoolean},
            {accessor: 'loading_odo_km', Header: "Loading KM's", cellMinWidth: 120},
            {accessor: 'offloading_odo_km', Header: "Off Loading KM's", cellMinWidth: 150},
            {accessor: 'invoice_recieved', Header: 'Invoice Received', cellMinWidth: 140}
        ],
        DRIVER_LOAD_TRACKER: [
            {
                accessor: 'name', Header: 'Name',
                Cell: ({row}) => getFullName(row.original.first_name, row.original.last_name)
            },
            {accessor: 'email', Header: 'Email'},
            {accessor: 'role', Header: 'Role'},
            {accessor: 'orders_count', Header: 'Order Count'},
            {accessor: 'total_weight', Header: 'Total Weight'},
            {accessor: 'actual_cost', Header: 'Actual Cost'},
            {accessor: 'recieved_pod', Header: 'Received Pod'},
            {accessor: 'fully_recieved_pod', Header: 'Fully Received Pod'},
            {accessor: 'not_recieved_pod', Header: 'Not Received Pod'},
            {accessor: 'invoice_recieved', Header: 'Invoice Received'},
            {accessor: 'invoice_not_recieved', Header: 'Invoice Not Received'}
        ],
        REVENUE_ANALYSIS: [
            {accessor: 'calender_date', Header: 'Date', Cell: ({value}) => formatDate(value)},
            {accessor: 'total_cost', Header: 'Total Cost per Trip'}
        ],
        STD_VS_ACTUAL: [
            {accessor: 'order_number', Header: 'Order #'},
            {accessor: 'order_date', Header: 'Order Date'},
            {accessor: 'driver_name', Header: 'Driver'},
            {accessor: 'vehicle_number', Header: 'Truck Reg.'},
            {accessor: 'route_name', Header: 'Trip (to & from)'},
            {accessor: 'type_of_load', Header: 'Commodity'},
            {accessor: 'planned_tonnage', Header: 'Standard Load Weight (Kg)'},
            {accessor: 'planned_cycle_time', Header: 'Standard Cycle Time'},
            {
                accessor: 'planned_load_start_time',
                Header: 'Planned Start Time',
                Cell: ({value}) => formatDateTime(value)
            },
            {accessor: 'planned_eta_destination', Header: 'Planned End Time', Cell: ({value}) => formatDateTime(value)},
            {accessor: 'actual_start_time', Header: 'Actual Start Time', Cell: ({value}) => formatDateTime(value)},
            {accessor: 'actual_end_time', Header: 'Actual End Time', Cell: ({value}) => formatDateTime(value)},
            {accessor: 'actual_tonnage_loaded', Header: 'Actual Load Weight (Kg)'},
            {accessor: 'is_one_day', Header: 'One Day', Cell: renderBoolean},
            {accessor: 'full_loaded', Header: 'In Full', Cell: renderBoolean},
            {accessor: 'on_time', Header: 'On Time', Cell: renderBoolean},
            {accessor: 'actual_time_cycle', Header: 'Actual Time Cycle'},
            {accessor: 'std_act', Header: 'Standard vs Actual'}
        ]
    }
};

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
        {accessor: 'created_at', Header: 'Create Date', Cell: ({value}) => renderDateTime(value)},
        {accessor: 'vehicle.vehicle_number', Header: 'Vehicle'},
        {accessor: 'due_date', Header: 'Due Date', Cell: ({value}) => renderDateTime(value)},
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

export const FAULT_SCHEMA = [
    {accessor: 'name', Header: 'Name'},
    {accessor: 'fault_type', Header: 'Type', Cell: ({value}) => capitalizeStr(value)},
    {accessor: 'vehicle.name', Header: 'Vehicle', Cell: ({value}) => value || ''},
    {accessor: 'description', Header: 'Description', disableSortBy: true}
];

export const PRODUCT_SCHEMA = [
    {accessor: 'name', Header: 'Product Name'},
    {accessor: 'std_tonnage', Header: 'Tonnage'},
    {accessor: 'volume', Header: 'Volume', disableSortBy: true}
];

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
        {accessor: 'model', Header: 'Model'},
        {
            accessor: 'meter_reading', Header: 'Meter', align: 'center',
            Cell: ({value}) => value ? <Badge radius="sm">{value} KM</Badge> : ''
        },
        {accessor: 'status', Header: 'Status', align: 'center', Cell: renderVehicleStatus},
        {accessor: 'license_expiry', Header: 'License Expiry', Cell: ({value}) => renderDate(value)}
    ]
};