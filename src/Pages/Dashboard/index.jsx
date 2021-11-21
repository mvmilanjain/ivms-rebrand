import {useEffect, useState} from 'react';
import {Group, Paper, Title} from '@mantine/core';

import {ReactTable} from 'Components';

const Dashboard = (props) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        getDataSource();
    }, []);

    const getDataSource = () => {
        fetch('https://jsonplaceholder.typicode.com/comments')
            .then(res => res.json()).then(data => setData(data))
    };

    return (
        <Paper padding="sm" withBorder style={{height: '100%'}}>
            <Group position="apart" mb="sm">
                <Title order={2}>Dashboard</Title>
            </Group>
            <div style={{height: 'calc(100% - 60px)'}}>
                <ReactTable
                    schema={[
                        {accessor: 'id', Header: 'Id'},
                        {accessor: 'postId', Header: 'Post Id'},
                        {accessor: 'name', Header: 'Name'},
                        {accessor: 'email', Header: 'Email Address'}
                    ]}
                    data={data}
                    total={data.length}
                    stickyHeader
                    sorting
                    selection
                    pagination
                />
            </div>
        </Paper>
    );
};

export default Dashboard;