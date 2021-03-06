export const BOOLEAN_LIST = [{value: true, label: 'Yes'}, {value: false, label: 'No'}];
export const ITEM_QUANTITY_TYPE = ['piece', 'kg', 'gram', 'gallon', 'quart', 'ltr', 'ml'];
export const METER_READING = ['miles', 'km', 'hours'];
export const VEHICLE_STATUS = [
    {value: 'initial', label: 'Initial'},
    {value: 'available', label: 'Available'},
    {value: 'in_maintenance', label: 'In Maintenance'},
    {value: 'maintenance_required', label: 'Maintenance Required'},
    {value: 'breakdown', label: 'Breakdown'},
    {value: 'discontinue', label: 'Discontinue'}
];
export const PRIORITY = ['normal', 'low', 'medium', 'high', 'emergency'];
export const PRIORITY2 = [
    {value:'normal', label: 'Normal'},
    {value:'low', label: 'Low'},
    {value:'medium', label: 'Medium'},
    {value:'high', label: 'High'},
    {value:'emergency', label: 'Emergency'}
];
export const TRIP_STATUS = [
    {label: 'Not Started', value: 'not_started'},
    {label: 'In-Progress', value: 'in_progress'},
    {label: 'Completed', value: 'completed'},
    {label: 'Cancelled', value: 'cancelled'}
];
export const POD_STATUS = [
    {value: 'awaited', label: 'Load completed - Awaiting POD pack'},
    {value: 'in_progress', label: 'In-Progress'},
    {value: 'incomplete', label: 'POD pack received - Incomplete'},
    {value: 'received', label: 'POD pack received - In Full'},
    {value: 'cancelled', label: 'Lead Cancelled'}
];
export const POD_STATUS_EMPTY_LEG = [
    {value: 'empty_leg', label: 'Empty Leg'}
];
export const FAULT_TYPE = ['repair', 'replace'];
export const TOOL_STATUS = [
    {value: 'available', label: 'Available'},
    {value: 'unavailable', label: 'Not Available'},
    {value: 'in_maintenance', label: 'In Maintenance'},
    {value: 'out_of_service', label: 'Out Of Service'}
];
export const WORKORDER_TYPE = [
    'general',
    'preventive',
    'breakdown',
    'corrective',
    'safety',
    'upgrade',
    'cleaning',
    'testing',
    'project',
    'electrical',
    'inspection',
    'calibration',
    'other'
];
export const TASK_STATUS = [
    {label: 'Initiated', value: 'initiated'},
    {label: 'In-Progress', value: 'in_progress'},
    {label: 'On Hold', value: 'on_hold'},
    {label: 'Completed', value: 'completed'}
]
export const CONGESTION_SEVERITY = ['average', 'bad', 'excessive'];
export const MEMBER_ROLE = [
    {value: 'admin', label: 'Admin'},
    {value: 'driver', label: 'Driver'},
    {value: 'route_planner', label: 'TripRoutes Planner'},
    {value: 'route_operations', label: 'TripRoutes Operation'}
];
export const ADDRESS_TYPE = [
    {value: 'stoppage', label: 'Truck Stop'},
    {value: 'fuel', label: 'Fuel Station'},
    {value: 'washing', label: 'Washing Station'},
    {value: 'service_provider', label: 'Service Provider'},
    {value: 'service_dealership', label: 'Service Dealership'},
    {value: 'loading', label: 'Loading Point'},
    {value: 'off_loading', label: 'Off Loading Point'},
    {value: 'rest', label: 'Authorized Rest Point'},
    {value: 'tyre_change', label: 'Tyre Point'}
];
export const EMPLOYMENT_STATUS = [
    {value: 'active', label:'Active', id: 0},
    {value: 'inactive', label: 'In Active', id: 1}
];
export const INSPECTION_FORM_FIELD_TYPE = [
    {value: 'good_repair_replace', label: 'Good-Repair-Replace-NA'},
    {value: 'yes_no_na', label: 'Yes-No-NA'},
    {value: 'pass_fail_na', label: 'Pass-Fail-NA'},
    {value: 'ok_faulty_na', label: 'Ok-Faulty-NA'},
    {value: 'text_field', label: 'Textfield'},
    {value: 'number', label: 'Number'}
];
export const INSPECTION_REPORT_CONDITION = [
    {value: 'excellent_condition', label: 'Excellent Condition'},
    {value: 'good_condition', label: 'Good Condition'},
    {value: 'little_wear', label: 'A little wear'},
    {value: 'minor_repair_required', label: 'Minor Repair required'},
    {value: 'major_repair_required', label: 'Major Repair required'},
    {value: 'cannot_determine', label: 'Cannot determine'},
    {value: 'na', label: 'Not Applicable'}
];
