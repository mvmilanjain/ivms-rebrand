import {Col, Grid} from '@mantine/core';

import {ContentArea} from 'Components';
import {CONFIG_FIELD_TYPE} from 'Shared/Utilities/constant';
import ConfigCard from './ConfigCard';

const CONFIG_LIST = [
    {title: 'Vehicle - Business Unit', type: CONFIG_FIELD_TYPE.BUSINESS_UNIT},
    {title: 'Vehicle - Category', type: CONFIG_FIELD_TYPE.VEHICLE_CATEGORY},
    {title: 'Vehicle - Depo', type: CONFIG_FIELD_TYPE.VEHICLE_DEPO},
    {title: 'Parts Inventory - Type', type: CONFIG_FIELD_TYPE.PART_INVENTORY_TYPE},
    {title: 'Trailer - Category', type: CONFIG_FIELD_TYPE.TRAILER_CATEGORY},
    {title: 'Planning - Contractor', type: CONFIG_FIELD_TYPE.ROUTE_PLANNER_CONTRACTOR}
];

const Configuration = () => (
    <ContentArea withPadding={false}>
        <Grid gutter="md">
            {CONFIG_LIST.map(item => (
                <Col key={item.type} span={4}>
                    <ConfigCard title={item.title} type={item.type}/>
                </Col>
            ))}
        </Grid>
    </ContentArea>
);

export default Configuration;