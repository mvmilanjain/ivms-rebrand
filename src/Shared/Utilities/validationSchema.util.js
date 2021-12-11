import * as yup from 'yup';
import {formatDateTime} from "./common.util";
import {TRIP_STATUS} from "./constant";

export const SIGN_IN = yup.object({
    username: yup.string().required('Username is required'),
    password: yup.string().required('Password is required')
});

export const ROUTE = yup.object({
    route_code: yup.string().required().label('Route code'),
    name: yup.string().required().label('Route name'),
    std_distance_cycle: yup.number().moreThan(0).required().label('Distance'),
    std_cycle_hours: yup.number().moreThan(0).required().label('Cycle hours'),
    source: yup.string().required().label('Source'),
    destination: yup.string().required().label('Destination'),
    equivalent_loads: yup.number().moreThan(0).required().label('Equivalent loads'),
    route_planner: yup.object({
        loading_time: yup.number().min(0).required().label('Loading time'),
        route_stops: yup.array().of(yup.object({
            address_id: yup.string().required().label('Address'),
            stop_duration: yup.number().min(0, 'Should be greater than or equal to 0').required('Required field')
        }))
    })
});

export const ROUTE_PLANNER = {
    PLAN: yup.object({
        vehicle_id: yup.string().label('Truck').required(),
        member_id: yup.string().label('Driver').required(),
        route_id: yup.string().label('Route').required(),
        product_id: yup.string().label('Product').required(),
        // contractor_id: yup.string().label('Contractor').nullable().required(),
        planned_distance: yup.number().label('Route distance').min(0).required(),
        planned_cycle_time: yup.number().label('Route cycle time').min(0).required(),
        planned_load_start_time: yup.date().label('Planned Load Start Time').nullable().required(),
        // planned_origin_departure_time: yup.date().label('Planned Origin Departure Time').nullable().required()
        //     .min(yup.ref('planned_load_start_time'), ({min}) => `Date needs to be after ${formatDateTime(min)}!!`),
        planned_eta_destination: yup.date().label('Planned ETA for Destination').nullable().required()
            .min(yup.ref('planned_load_start_time'), ({min}) => `Date needs to be after ${formatDateTime(min)}!!`),
        route_order_stoppages: yup.array().of(yup.object({
            stop_duration: yup.number().min(0, 'Should be greater than or equal to 0').required('Required field')
        }))
    }),
    OPERATION: yup.object({
        status: yup.string().label('Trip Status').required(),
        rate_per_tone: yup.number().label('Rate').min(0).required(),
        pod_status: yup.string().nullable().when('status', (status, schema) => {
            if(status === TRIP_STATUS.IN_PROGRESS) {
                return yup.string().oneOf(['in_progress'], 'POD Status must be equal to "In progress"')
            } else if(status === TRIP_STATUS.CANCELLED) {
                return yup.string().oneOf(['cancelled'], 'POD Status must be equal to "Lead Cancelled"')
            } else if(status === TRIP_STATUS.COMPLETED) {
                return yup.string().oneOf(
                    ['awaited', 'incomplete', 'received'],
                    'POD Status must be one of the following values: ' +
                    '"Load completed - Awaiting POD pack", ' +
                    '"POD pack received - Incomplete", ' +
                    '"POD pack received - In Full"'
                )
            }
        }),
        route_order_actual_info: yup.object({
            route_order_id: yup.string().label('Order').required(),
            fuel_liters_filled: yup.number().label('Actual Fuel Filled').min(0).required(),
            cycle_time: yup.number().label('Actual Cycle Time').min(0).required(),
            distance: yup.number().label('Actual Distance').min(0).required(),
            tonnage_loaded: yup.number().label('Actual Tonnage Loaded').min(0).required(),
            route_order_actual_stop_infos: yup.array().of(yup.object({
                actual_arrival_time: yup.date().nullable().when('status', (arg1, schema, params) => {
                    const from = (params.from && params.from.length && params.from[params.from.length - 1].value) || {};
                    if (from.status === 'completed') {
                        return yup.date().nullable().required('Required Field').typeError('Invalid format')
                    }
                })
            }))
        })
    })
};

export const ADDRESS = yup.object({
    name: yup.string().label('Address name').nullable().required(),
    address_type: yup.string().label('Address type').nullable().required(),
    address1: yup.string().label('Address Line 1').nullable().required()
});

export const INSPECTION_REPORT = {
    STEP_1: yup.object({
        location_id: yup.string().required().label('Location'),
        inspector_id: yup.string().required().label('Inspector'),
        vehicle_id: yup.string().required().label('Vehicle'),
        inspection_form_id: yup.string().required().label('Inspection Form')
    }),
    STEP_3: yup.object({
        condition: yup.string().required().label('Overall Condition'),
        additional_note: yup.string().required().label('Additional Note')
    })
};

export const MEMBER = yup.object({
    employee_id: yup.string().label('Employee ID').required(),
    status: yup.string().label('Employment Status').required(),
    first_name: yup.string().label('First Name').required(),
    email: yup.string().label('Email').email().required(),
    identification_number: yup.string().label('Identification No.').required(),
    role: yup.string().label('Role').required(),
    employment_start_date: yup.date().label('Employment Start Date').nullable().typeError('Invalid format').required(),
    bank_account_details: yup.object({
        bank_name: yup.string().label('Bank Name').required(),
        account_number: yup.string().label('Account Number').required()
    })
});

export const TRUCK = yup.object({
    name: yup.string().label('Name').required(),
    model: yup.string().label('Model').required(),
    meter_reading: yup.number().label('Meter Reading').min(0).required(),
    status: yup.string().label('Status').required(),
    vin_number: yup.string().label('VIN No.').required()
});

export const ADD_ROUTE_STOP = yup.object({
    address_id: yup.string().required().label('Address'),
    stop_duration: yup.number().min(0).required().label('Stop Duration')
});

export const PRODUCT = yup.object({
    name: yup.string().required().label('Product name'),
    volume: yup.number().moreThan(0).required().label('Volume')
});

export const PRODUCT_ROUTE = yup.object({
    route_id: yup.string().required().label('Route'),
    contractor_id: yup.string().required().label('Contractor'),
    std_tonnage: yup.number().moreThan(0).required().label('Tonnage'),
    avg_rate: yup.number().moreThan(0).required().label('Average rate'),
    avg_load_weight: yup.number().moreThan(0).required().label('Average  load weight'),
    max_load_weight: yup.number().moreThan(0).required().label('Max load weight'),
    route_rate: yup.object({
        count_in_hand: yup.number().moreThan(0).required().label('Count'),
        rate_per_tone: yup.number().moreThan(0).required().label('Rate per tone'),
        avg_tonnage: yup.number().moreThan(0).required().label('Average tonnage')
    })
});

export const FAULT = yup.object({
    name: yup.string().required().label('Name'),
    fault_type: yup.string().required().label('Fault type'),
    vehicle_id: yup.string().required().label('Vehicle'),
});