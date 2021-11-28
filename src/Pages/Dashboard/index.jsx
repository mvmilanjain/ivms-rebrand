import {Group, Title} from '@mantine/core';

const Dashboard = (props) => {

    return (
        <>
            <Group position="apart" mb="sm">
                <Title order={2}>Dashboard</Title>
            </Group>
            <div style={{height: 'calc(100% - 60px)'}}>

            </div>
        </>
    );
};

export default Dashboard;