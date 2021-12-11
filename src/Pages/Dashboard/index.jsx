import {Col, Grid, Group, Title} from '@mantine/core';

import {AddressDropdown, ContentArea, ContractorDropdown, RouteDropdown, VehicleDropdown} from 'Components';

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
                            <VehicleDropdown label="Truck" withIcon onChange={handleItemSelection}/>

                            <AddressDropdown label="Address" withIcon onChange={handleItemSelection}/>

                            <RouteDropdown label="Route" withIcon onChange={handleItemSelection}/>

                            <ContractorDropdown label="Contractor" onChange={handleItemSelection}/>
                        </Group>
                    </Col>
                </Grid>
            </div>
        </ContentArea>
    );
};

export default Dashboard;