import {useEffect, useState} from 'react';
import {Group, Paper, Title} from '@mantine/core';

import {ReactTable} from 'Components';
import {useHttp} from 'Hooks';
import {getSelectDataSource} from 'Shared/Utilities/common.util';
import {getRoutes} from 'Shared/Services';

const Dashboard = (props) => {
    const {requestHandler} = useHttp();

    const [data, setData] = useState([]);

    useEffect(() => {
        getDataSource();
    }, []);

    const getDataSource = () => {
        const params = {per_page: 100, page_no: 1, include: 'source_address,destination_address'};
        getSelectDataSource(requestHandler, getRoutes(params)).then(res => {
            setData(res.data);
        }).catch(e => {
            console.error(e)
        });
    };

    return (
        <Paper padding="sm" withBorder style={{height: '100%'}}>
            <Group position="apart" mb="sm">
                <Title order={2}>Dashboard</Title>
            </Group>
            <div style={{height: 'calc(100% - 60px)'}}>
                <ReactTable
                    schema={[
                        {accessor: 'route_code', Header: 'Route Code'},
                        {accessor: 'name', Header: 'Route Name', disableSortBy: true},
                        {accessor: 'std_distance_cycle', Header: 'Distance (KM)'},
                        {accessor: 'std_cycle_hours', Header: 'Cycle Hours'}
                    ]}
                    data={data}
                    stickyHeader
                    sorting
                    selection
                />
            </div>
        </Paper>
    );
};

export default Dashboard;