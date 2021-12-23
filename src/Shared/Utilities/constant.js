export const FIELD_SIZE = 'small';

export const DATE_FORMAT = 'yyyy-MM-dd';
export const DATE_TIME_FORMAT_12_HR = 'yyyy-MM-dd hh:mm a';
export const DATE_TIME_FORMAT_24_HR = 'yyyy-MM-dd HH:mm';

export const CURRENCY = 'R';
export const KM = 'KM';
export const HOURS = 'Hr(s)';
export const LITERS = 'Ltr(s)';
export const METERS = 'Mtr(s)';
export const RATE_PER_TON = 'R/ton';

export const LATLNG = {lat: -33.9000, lng: 18.6000};
export const GEOFENCE = [
    {lat: -33.9001, lng: 18.5999},
    {lat: -33.8999, lng: 18.5999},
    {lat: -33.8999, lng: 18.6001},
    {lat: -33.9001, lng: 18.6001}
];

export const RECOMMENDATION = {
    YES: {type: 'success', title: 'YES', message: 'Please proceed'},
    MAY_BE: {
        type: 'warning', title: 'MAY BE',
        message: 'If load can be completed efficiently, without impacting overall performance'
    },
    NO: {type: 'error', title: 'NO', message: 'Not recommended'},
    ERROR: {type: 'error', title: 'ERROR', message: 'Check Products selection OR Check Master Data'}
};

export const REPORT_TYPE = {
    REVENUE_MASTER: 'revenue_master',
    DRIVER_LOAD_TRACKER: 'driver_load_tracker',
    REVENUE_ANALYSIS: 'monthly_revenue',
    DAILY_REVENUE_TRACKER: 'vehicle_monthly_revenue',
    STD_VS_ACTUAL: 'std_vs_actuals',
    MONTHLY_REVENUE: 'monthly_revenue'
};

export const CONFIG_FIELD_TYPE = {
    BUSINESS_UNIT: 'business_unit',
    VEHICLE_CATEGORY: 'vehicle_category',
    TRAILER_CATEGORY: 'trailer_category',
    VEHICLE_DEPO: 'depo',
    PART_INVENTORY_TYPE: 'part_inventory_type',
    ROUTE_PLANNER_CONTRACTOR: 'contractor'
};

export const TRIP_STATUS = {
    NOT_STARTED: 'not_started',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
};

export const TRIP_EVENT = {
    START: 'start_trip',
    COMPLETE: 'complete',
    CANCEL: 'cancel'
};