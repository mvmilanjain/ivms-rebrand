import {Group, Title, Center,Grid, Col} from '@mantine/core';

import {AddressDropdown, VehicleDropdown} from 'Components';

const Dashboard = (props) => {

    const handleItemSelection = (item) => {
        console.log(item);
    };

    return (
        <>
            <Group position="apart" mb="sm"><Title order={2}>Dashboard</Title></Group>

            <div style={{height: 'calc(100% - 60px)'}}>
                <Grid justify="center">
                    <Col span={4}>
                        <Group direction="column" grow>
                            <VehicleDropdown label="Truck" showIcon onSelection={handleItemSelection}/>

                            <AddressDropdown label="Address" showIcon onSelection={handleItemSelection}/>
                        </Group>
                    </Col>
                </Grid>
            </div>
        </>
    );
};

export default Dashboard;