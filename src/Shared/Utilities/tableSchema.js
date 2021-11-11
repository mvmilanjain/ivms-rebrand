import {getAddressLabel} from './common.util';

export const ROUTE_SCHEMA = [
    {id: 'route_code', header: 'Route Code', sort: true},
    {id: 'name', header: 'Route Name', sort: true},
    {id: 'source_address', header: 'Source', sort: true, render: (row) => getAddressLabel(row.source_address)},
    {id: 'destination_address', header: 'Destination', sort: true, render: (row) => getAddressLabel(row.destination_address)},
    {id: 'std_distance_cycle', header: 'Distance (KM)', sort: true},
    {id: 'std_cycle_hours', header: 'Cycle Hours', sort: true}
];