import {useEffect, useState} from 'react';
import {Button, Group, Paper, Title} from '@mantine/core';
import {PlusSquare as CreateIcon} from 'react-feather';

import {Table} from 'Components';
import {useHttp} from 'Hooks';
import {getRoutes} from 'Shared/Services';
import {getSelectDataSource} from 'Shared/Utilities/common.util';
import {ROUTE_SCHEMA} from 'Shared/Utilities/tableSchema';

const Route = (props) => {
    const {requestHandler} = useHttp();
    const [data, setData] = useState([]);
    // const [pagination, setPagination] = useState({total: 0});
    const [loading, toggleLoading] = useState(false);

    useEffect(() => {
        toggleLoading(true);
        const params = {per_page: 100, page_no: 1, include: 'source_address,destination_address'};
        getSelectDataSource(requestHandler, getRoutes(params))
            .then(res => {
                const {data, meta: {pagination}} = res;
                setData(data);
                // setPagination({total: pagination.count});
            })
            .catch(e => console.error(e))
            .finally(() => toggleLoading(false));
    }, []);

    return (
        <Paper padding="sm" withBorder style={{height: '100%'}}>
            <Group position="apart" mb="sm">
                <Title order={2} color="red">Routes</Title>
                <Button leftIcon={<CreateIcon size={16}/>} variant="light">Create Route</Button>
            </Group>
            <div style={{height: 'calc(100% - 60px)'}}>
                {data && <Table
                    schema={ROUTE_SCHEMA} data={data}
                    stickyHeader loading={loading}
                    pagination={data.length > 10}
                    total={data.length}
                />}
            </div>
        </Paper>
    );
};

export default Route;