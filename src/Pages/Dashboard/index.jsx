import {Col, Grid, Group, Title} from '@mantine/core';

import {AddressSelect, ConfigFieldSelect, ContentArea, MemberSelect, RouteSelect, VehicleSelect} from 'Components';
import {CONFIG_FIELD_TYPE} from "../../Shared/Utilities/constant";

const Dashboard = (props) => {

    const handleItemSelection = (item) => console.log(item);

    return (
        <ContentArea withPaper limitToViewPort>
            <Group position="apart" mb="md">
                <Title order={2}>Dashboard</Title>
            </Group>

            <div style={{height: 'calc(100% - 60px)'}}>
                <Grid justify="center">
                    <Col span={4}>
                        <Group direction="column" grow>
                            <RouteSelect label="Route" withIcon clearable onChange={handleItemSelection}/>

                            <AddressSelect label="Address" withIcon clearable onChange={handleItemSelection}/>

                            <VehicleSelect label="Vehicle" withIcon clearable onChange={handleItemSelection}/>

                            <MemberSelect label="Member" withIcon clearable onChange={handleItemSelection}/>

                            <ConfigFieldSelect
                                label="Contractor" clearable
                                onChange={handleItemSelection}
                                fieldType={CONFIG_FIELD_TYPE.ROUTE_PLANNER_CONTRACTOR}
                            />
                        </Group>
                    </Col>
                </Grid>
            </div>
        </ContentArea>
    );
};

export default Dashboard;