import {Col, Grid, Group, Title} from '@mantine/core';

import {AddressSelect, ConfigFieldSelect, RouteSelect, ContentArea, MemberSelect, VehicleSelect} from 'Components';
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
                            <AddressSelect
                                label="Address"
                                withIcon
                                clearable
                                isMulti
                                onChange={handleItemSelection}
                            />

                            <RouteSelect
                                label="Route"
                                withIcon
                                clearable
                                isMulti
                                onChange={handleItemSelection}
                            />

                            <VehicleSelect
                                label="Vehicle"
                                withIcon
                                clearable
                                isMulti
                                onChange={handleItemSelection}
                            />

                            <MemberSelect
                                label="Member"
                                withIcon
                                clearable
                                isMulti
                                onChange={handleItemSelection}
                            />

                            <ConfigFieldSelect
                                label="Contractor"
                                fieldType={CONFIG_FIELD_TYPE.ROUTE_PLANNER_CONTRACTOR}
                                withIcon
                                clearable
                                isMulti
                                onChange={handleItemSelection}
                            />
                        </Group>
                    </Col>
                </Grid>
            </div>
        </ContentArea>
    );
};

export default Dashboard;