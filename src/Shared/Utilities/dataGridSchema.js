import Chip from "@material-ui/core/Chip";
import Typography from "@material-ui/core/Typography";
import DateFilter from '@inovua/reactdatagrid-community/DateFilter';
import NumberFilter from '@inovua/reactdatagrid-community/NumberFilter';
import SelectFilter from '@inovua/reactdatagrid-community/SelectFilter';

import {
    capitalizeStr,
    formatDate,
    formatDateTime,
    getAddressLabel,
    getFullName,
    getOptionLabel,
    renderBoolean
} from "./common.util";
import {EMPLOYMENT_STATUS, MEMBER_ROLE, TOOL_STATUS, TRIP_STATUS, VEHICLE_STATUS} from "./referenceData.util";

export const RouteSchema = {
    columns: [
        {name: 'route_code', header: 'Route Code', defaultFlex: 1},
        {name: 'name', header: 'Route Name', defaultFlex: 2},
        {
            name: 'source_address_address1', header: 'Source', defaultFlex: 1,
            render: ({data}) => (data.source_address && data.source_address.address1) || ''
        },
        {
            name: 'destination_address_address1', header: 'Destination', defaultFlex: 1,
            render: ({data}) => (data.destination_address && data.destination_address.address1) || ''
        },
        {name: 'std_distance_cycle', header: 'Distance (KM)', defaultFlex: 1},
        {name: 'std_cycle_hours', header: 'Cycle Hours', defaultFlex: 1}
    ],
    filter: [
        {name: 'route_code', type: 'string', operator: 'contains', value: ''},
        {name: 'name', type: 'string', operator: 'contains', value: ''}
    ]
};

export const PlanSchema = {
    columns: [
        {name: 'order_number', header: 'Order #'},
        {name: 'status', header: 'Status', render: ({value}) => getOptionLabel(TRIP_STATUS, value)},
        {
            name: 'planned_load_start_time',
            header: 'Planned Start Time',
            filterEditor: DateFilter,
            render: ({value}) => formatDateTime(value)
        },
        {
            name: 'planned_eta_destination',
            header: 'Planned End Time',
            filterEditor: DateFilter,
            render: ({value}) => formatDateTime(value)
        },
        {name: 'vehicle_name', header: 'Truck'},
        {name: 'member_first_name', header: 'Driver'},
        {name: 'route_route_code', header: 'Route'},
        {name: 'product_name', header: 'Product'},
        {name: 'planned_distance', header: 'Distance (KM)', filterEditor: NumberFilter},
        {name: 'planned_cycle_time', header: 'Cycle time (Hrs)', filterEditor: NumberFilter},
        {name: 'rate_per_tone', header: 'Current Rate', filterEditor: NumberFilter},
        {name: 'is_empty_leg', header: 'Empty Leg', render: ({value}) => renderBoolean(value)},
        {name: 'equivalent_loads', header: 'Equivalent Loads', filterEditor: NumberFilter},
        {name: 'planned_fuel', header: 'Fuel required', filterEditor: NumberFilter}
    ],
    filter: [
        {name: 'planned_load_start_time', type: 'date', operator: 'eq', value: ''},
        {name: 'planned_eta_destination', type: 'date', operator: 'eq', value: ''},
        {name: 'vehicle_name', type: 'string', operator: 'eq', value: ''},
        {name: 'route_route_code', type: 'string', operator: 'eq', value: ''},
        {name: 'product_name', type: 'string', operator: 'eq', value: ''},
        {name: 'planned_distance', type: 'number', operator: 'eq', value: ''},
        {name: 'planned_cycle_time', type: 'number', operator: 'eq', value: ''},
        {name: 'rate_per_tone', type: 'number', operator: 'eq', value: ''},
        {name: 'equivalent_loads', type: 'number', operator: 'eq', value: ''},
        {name: 'planned_fuel', type: 'number', operator: 'eq', value: ''}
    ]
};

export const OperationSchema = {
    columns: [
        {name: 'order_number', header: 'Order #'},
        {
            name: 'route_route_code', header: 'Route Code',
            render: ({data}) => (data.route && data.route.route_code) || ''
        },
        {
            name: 'route_order_actual_info_start_time',
            header: 'Start time',
            dateFormat: 'YYYY-MM-DD',
            filterEditor: DateFilter,
            render: ({data}) => data.route_order_actual_info ? formatDateTime(data.route_order_actual_info.start_time) : ''
        },
        {
            name: 'route_order_actual_info_end_time',
            header: 'End Time',
            dateFormat: 'YYYY-MM-DD',
            filterEditor: DateFilter,
            render: ({data}) => data.route_order_actual_info ? formatDateTime(data.route_order_actual_info.end_time) : ''
        },
        {
            name: 'route_order_actual_info_fuel_liters_filled', header: 'Fuel Filled', filterEditor: NumberFilter,
            render: ({data}) => (data.route_order_actual_info && data.route_order_actual_info.fuel_liters_filled) || ''
        },
        {
            name: 'route_order_actual_info_distance', header: 'Distance', filterEditor: NumberFilter,
            render: ({data}) => (data.route_order_actual_info && data.route_order_actual_info.distance) || ''
        },
        {
            name: 'route_order_actual_info_tonnage_loaded', header: 'Tonnage Loaded', filterEditor: NumberFilter,
            render: ({data}) => (data.route_order_actual_info && data.route_order_actual_info.tonnage_loaded) || ''
        },
        {
            name: 'route_order_actual_info_pod_number', header: 'POD #', filterEditor: NumberFilter,
            render: ({data}) => (data.route_order_actual_info && data.route_order_actual_info.pod_number) || ''
        },
        {
            name: 'route_order_actual_info_delivery_note_number', header: 'Delivery Note #',
            render: ({data}) => (data.route_order_actual_info && data.route_order_actual_info.delivery_note_number) || ''
        }
    ],
    filter: [
        {name: 'route_route_code', type: 'date', operator: 'contains', value: ''},
        {name: 'route_order_actual_info_start_time', type: 'date', operator: 'eq', value: ''},
        {name: 'route_order_actual_info_end_time', type: 'date', operator: 'eq', value: ''},
        {name: 'route_order_actual_info_fuel_liters_filled', type: 'number', operator: 'eq', value: ''},
        {name: 'route_order_actual_info_distance', type: 'number', operator: 'eq', value: ''},
        {name: 'route_order_actual_info_tonnage_loaded', type: 'number', operator: 'eq', value: ''},
        {name: 'route_order_actual_info_pod_number', type: 'number', operator: 'eq', value: ''}
    ]
};

export const FinanceSchema = {
    columns: [
        {name: 'order_number', header: 'Order #', defaultFlex: 1},
        {
            name: 'document_validated', header: 'Document Validated',
            defaultFlex: 1, render: ({value}) => renderBoolean(value)
        },
        {
            name: 'document_sent_to_client', header: 'Document Send to Client',
            defaultFlex: 1, render: ({value}) => renderBoolean(value)
        },
        {
            name: 'payment_recieved', header: 'Payment Received',
            defaultFlex: 1, render: ({value}) => renderBoolean(value)
        },
        {
            name: 'invoice_recieved', header: 'Invoice Sent',
            defaultFlex: 1, render: ({value}) => renderBoolean(value)
        }
    ]
};

export const MemberSchema = {
    columns: [
        {name: 'employee_id', header: 'Employee ID'},
        {name: 'first_name', header: 'First Name'},
        {name: 'last_name', header: 'Last Name'},
        {
            name: 'status', header: 'Status', textAlign: 'center', filterEditor: SelectFilter,
            filterEditorProps: {dataSource: EMPLOYMENT_STATUS.map(item => ({id: item.id, label: item.label}))},
            render: ({value}) => <Chip
                size="small" color={value === 'active' ? 'primary' : 'secondary'}
                label={<Typography variant="overline">{getOptionLabel(EMPLOYMENT_STATUS, value)}</Typography>}
            />
        },
        {name: 'role', header: 'Role', render: ({value}) => getOptionLabel(MEMBER_ROLE, value)},
        {name: 'identification_number', header: 'Identification No.'},
        {
            name: 'passport_end_date', header: 'Passport Expiry', dateFormat: 'YYYY-MM-DD',
            filterEditor: DateFilter, render: ({value}) => formatDate(value)
        },
        {
            name: 'driving_license_expiry_date', header: 'License Expiry', dateFormat: 'YYYY-MM-DD',
            filterEditor: DateFilter, render: ({value}) => formatDate(value)
        },
        {
            name: 'pdp_expiry', header: 'PDP/IDP Expiry', dateFormat: 'YYYY-MM-DD',
            filterEditor: DateFilter, render: ({value}) => formatDate(value)
        },
        {
            name: 'work_permit_end_date', header: 'Work Permit Expiry', dateFormat: 'YYYY-MM-DD',
            filterEditor: DateFilter, render: ({value}) => formatDate(value)
        },
        {
            name: 'medical_expiry_date', header: 'Medical Expiry', dateFormat: 'YYYY-MM-DD',
            filterEditor: DateFilter, render: ({value}) => formatDate(value)
        }
    ],
    filter: [
        {name: 'employee_id', type: 'string', operator: 'contains', value: ''},
        {name: 'first_name', type: 'string', operator: 'contains', value: ''},
        {name: 'last_name', type: 'string', operator: 'contains', value: ''},
        {name: 'status', type: 'select', operator: 'eq', value: 0},
        {name: 'identification_number', type: 'string', operator: 'contains', value: ''},
        {name: 'passport_end_date', type: 'date', operator: 'eq', value: ''},
        {name: 'driving_license_expiry_date', type: 'date', operator: 'eq', value: ''},
        {name: 'pdp_expiry', type: 'date', operator: 'eq', value: ''},
        {name: 'work_permit_end_date', type: 'date', operator: 'eq', value: ''},
        {name: 'medical_expiry_date', type: 'date', operator: 'eq', value: ''}
    ]
};

export const SupplierSchema = {
    columns: [
        {name: 'name', header: 'Name', defaultFlex: 1},
        {name: 'email', header: 'Email', defaultFlex: 1},
        {
            name: 'address_address1', header: 'Address', defaultFlex: 1,
            render: ({data}) => (data.address && data.address.address1) || ''
        }
    ],
    filter: [
        {name: 'name', type: 'string', operator: 'contains', value: ''},
        {name: 'email', type: 'string', operator: 'contains', value: ''},
        {name: 'address_address1', type: 'string', operator: 'contains', value: ''}
    ]
};

export const ProductSchema = {
    columns: [
        {name: 'name', header: 'Product', defaultFlex: 1},
        {name: 'std_tonnage', header: 'Tonnage', defaultFlex: 1},
        {name: 'volume', header: 'Volume', defaultFlex: 1}
    ],
    filter: [
        {name: 'name', type: 'string', operator: 'contains', value: ''}
    ]
};

export const TrailerSchema = {
    columns: [
        {name: 'name', header: 'Name', defaultFlex: 1},
        {name: 'trailer_category_name', header: 'Category', defaultFlex: 1},
        {name: 'vin_number', header: 'VIN No.', defaultFlex: 1},
        {name: 'model', header: 'Model', defaultFlex: 1},
        {name: 'meter_reading', header: 'Meter', defaultFlex: 1},
        {name: 'status', header: 'Status', defaultFlex: 1, render: ({value}) => getOptionLabel(VEHICLE_STATUS, value)},
        {name: 'license_expiry', header: 'License Expiry', defaultFlex: 1, render: ({value}) => formatDate(value)}
    ],
    filter: [
        {name: 'name', type: 'string', operator: 'contains', value: ''},
        {name: 'vin_number', type: 'string', operator: 'contains', value: ''}
    ]
};

export const TruckSchema = {
    columns: [
        {name: 'vehicle_number', header: 'Truck No.', defaultFlex: 1},
        {
            name: 'vehicle_category_name', header: 'Vehicle Category', defaultFlex: 1,
            render: ({data}) => (data.vehicle_category && data.vehicle_category.name) || ''
        },
        {name: 'name', header: 'Vehicle Name', defaultFlex: 1},
        {name: 'model', header: 'Model', defaultFlex: 1},
        {name: 'meter_reading', header: 'Meter', defaultFlex: 1},
        {
            name: 'status', header: 'Status', defaultFlex: 1,
            render: ({value}) => getOptionLabel(VEHICLE_STATUS, value)
        }
    ],
    filter: [
        {name: 'vehicle_number', type: 'string', operator: 'contains', value: ''},
        {name: 'name', type: 'string', operator: 'contains', value: ''},
        {name: 'model', type: 'string', operator: 'contains', value: ''}
    ]
};

export const FaultSchema = {
    columns: [
        {name: 'name', header: 'Name', defaultFlex: 1},
        {name: 'fault_type', header: 'Type', defaultFlex: 1, render: ({value}) => capitalizeStr(value)},
        {
            name: 'vehicle_vehicle_number', header: 'Vehicle', defaultFlex: 1,
            render: ({data}) => (data.vehicle && data.vehicle.vehicle_number) || ''
        },
        {name: 'description', header: 'Description', defaultFlex: 3, sortable: false}
    ]
};

export const InspectionReportSchema = {
    columns: [
        {name: 'report_number', header: 'Report No.', defaultFlex: 1},
        {name: 'created_at', header: 'Date', defaultFlex: 1, render: ({value}) => formatDateTime(value)},
        {
            name: 'vehicle_vehicle_number', header: 'Vehicle', defaultFlex: 1,
            render: ({data}) => (data.vehicle && data.vehicle.vehicle_number) || ''
        },
        {
            name: 'location_address1', header: 'Location', defaultFlex: 1,
            render: ({data}) => (data.location && getAddressLabel(data.location)) || ''
        },
        {
            name: 'inspector_first_name', header: 'Inspector', defaultFlex: 1,
            render: ({data}) => getFullName(data.inspector.first_name, data.inspector.last_name)
        }
    ]
};

export const PartsInventorySchema = {
    columns: [
        {name: 'item_number', header: 'Item No.', defaultFlex: 1},
        {name: 'name', header: 'Name', defaultFlex: 1},
        {
            name: 'item_type_name', header: 'Type', defaultFlex: 1,
            render: ({data}) => (data.item_type && data.item_type.name) || ''
        },
        {name: 'quantity', header: 'Quantity', defaultFlex: 1},
        {name: 'quantity_unit', header: 'Unit', defaultFlex: 1},
        {name: 'cost', header: 'Cost', defaultFlex: 1},
        {name: 'location', header: 'Location', defaultFlex: 1},
        {
            name: 'supplier_name', header: 'Supplier', defaultFlex: 1,
            render: ({data}) => (data.supplier && data.supplier.name) || ''
        }
    ]
};

export const SchedulerSchema = {
    columns: [
        {name: 'title', header: 'Schedule', defaultFlex: 1},
        {
            name: 'vehicle_vehicle_number', header: 'Vehicle Number', defaultFlex: 1,
            render: ({data}) => (data.vehicle && data.vehicle.vehicle_number) || ''
        },
        {name: 'workorder', header: 'Workorder', defaultFlex: 1}
    ]
};

export const LaborCodeSchema = {
    columns: [
        {name: 'code', header: 'Labor Code', defaultFlex: 1},
        {name: 'hourly_rate', header: 'Hourly Rate', defaultFlex: 1},
        {
            name: 'supplier_name', header: 'Supplier', defaultFlex: 1,
            render: ({data}) => (data.supplier && data.supplier.name) || ''
        },
        {name: 'travel', header: 'Travel', defaultFlex: 1},
        {name: 'call_out', header: 'Call Out', defaultFlex: 1}
    ]
};

export const OrderSchema = {
    columns: [
        {name: 'work_order_number', header: 'Order no.', defaultFlex: 1},
        {
            name: 'created_at', header: 'Create Date', defaultFlex: 1,
            render: ({data}) => data.created_at ? formatDateTime(data.created_at) : ''
        },
        {
            name: 'vehicle_vehicle_number', header: 'Vehicle', defaultFlex: 1,
            render: ({data}) => (data.vehicle && data.vehicle.vehicle_number) || ''
        },
        {
            name: 'due_date', header: 'Due Date', defaultFlex: 1,
            render: ({data}) => data.due_date ? formatDateTime(data.due_date) : ''
        },
        {name: 'status', header: 'Status', defaultFlex: 1},
        {name: 'priority', header: 'Priority', defaultFlex: 1},
        {
            name: 'assignedTo', header: 'Assigned To', defaultFlex: 1,
            render: ({data}) => getFullName(data.assignee.first_name, data.assignee.last_name)
        }
    ]
};

export const ToolInventorySchema = {
    columns: [
        {name: 'serial_number', header: 'Serial no.', defaultFlex: 1},
        {name: 'name', header: 'Name', defaultFlex: 1},
        {name: 'tool_type', header: 'Type', defaultFlex: 1},
        {name: 'quantity', header: 'Quantity', defaultFlex: 1},
        {
            name: 'status', header: 'Status', defaultFlex: 1,
            render: ({value}) => getOptionLabel(TOOL_STATUS, value)
        },
        {name: 'location', header: 'Location', defaultFlex: 1},
        {name: 'manufacture', header: 'Manufacture', defaultFlex: 1}
    ]
};

// REPORTS
export const REVENUE_MASTER = [
    {name: 'order_number', header: 'Order no.'},
    {name: 'order_date', header: 'Date', render: ({value}) => formatDate(value)},
    {name: 'driver_name', header: 'Driver', resizable: true},
    {name: 'vehicle_number', header: 'Truck Reg.'},
    {name: 'route_name', header: 'Trip (to & from)'},
    {name: 'type_of_load', header: 'Type of Load'},
    {name: 'pod_status', header: 'Pod Status'},
    {name: 'pod_number', header: 'Pod no.'},
    {name: 'delivery_note_number', header: 'Delivery note no.'},
    {name: 'tonnage_loaded', header: 'Load Weight (ton)'},
    {name: 'rate_per_ton', header: 'Rate'},
    {name: 'loading_distance', header: 'Planned Distance'},
    {name: 'actual_distance', header: 'Actual Distance'},
    {name: 'planned_cost', header: 'Planned Cost'},
    {name: 'actual_cost', header: 'Actual Cost'},
    {name: 'pod_collected', header: 'POD Collected', render: ({value}) => renderBoolean(value)},
    {name: 'loading_odo_km', header: 'Loading KM\'s'},
    {name: 'offloading_odo_km', header: 'Off Loading KM\'s'},
    {name: 'invoice_recieved', header: 'Invoice Received'}
];

export const DRIVER_LOAD_TRACKER = [
    {name: 'name', header: 'Name', render: ({data}) => getFullName(data.first_name, data.last_name)},
    {name: 'email', header: 'Email'},
    {name: 'role', header: 'Role'},
    {name: 'orders_count', header: 'Order Count'},
    {name: 'total_weight', header: 'Total Weight'},
    {name: 'actual_cost', header: 'Actual Cost'},
    {name: 'recieved_pod', header: 'Received Pod'},
    {name: 'fully_recieved_pod', header: 'Fully Received Pod'},
    {name: 'not_recieved_pod', header: 'Not Received Pod'},
    {name: 'invoice_recieved', header: 'Invoice Received'},
    {name: 'invoice_not_recieved', header: 'Invoice Not Received'}
];

export const REVENUE_ANALYSIS = [
    {name: 'calender_date', header: 'Date', defaultFlex: 1, render: ({value}) => formatDate(value)},
    {name: 'total_cost', header: 'Total Cost per Trip', defaultFlex: 1}
];

export const STD_VS_ACTUAL = [
    {name: 'order_number', header: 'Order #'},
    {name: 'order_date', header: 'Order Date'},
    {name: 'driver_name', header: 'Driver'},
    {name: 'vehicle_number', header: 'Truck Reg.'},
    {name: 'route_name', header: 'Trip (to & from)'},
    {name: 'type_of_load', header: 'Commodity'},
    {name: 'planned_tonnage', header: 'Standard Load Weight (Kg)'},
    {name: 'planned_cycle_time', header: 'Standard Cycle Time'},
    {name: 'planned_load_start_time', header: 'Planned Start Time', render: ({value}) => formatDateTime(value)},
    {name: 'planned_eta_destination', header: 'Planned End Time', render: ({value}) => formatDateTime(value)},
    {name: 'actual_start_time', header: 'Actual Start Time', render: ({value}) => formatDateTime(value)},
    {name: 'actual_end_time', header: 'Actual End Time', render: ({value}) => formatDateTime(value)},
    {name: 'actual_tonnage_loaded', header: 'Actual Load Weight (Kg)'},
    {name: 'is_one_day', header: 'One Day', render: ({value}) => renderBoolean(value)},
    {name: 'full_loaded', header: 'In Full', render: ({value}) => renderBoolean(value)},
    {name: 'on_time', header: 'On Time', render: ({value}) => renderBoolean(value)},
    {name: 'actual_time_cycle', header: 'Actual Time Cycle'},
    {name: 'std_act', header: 'Standard vs Actual'}
];