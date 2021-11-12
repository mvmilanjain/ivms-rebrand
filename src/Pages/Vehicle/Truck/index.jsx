import {useEffect, useState} from 'react';
import {Button, Group, Paper, Title} from '@mantine/core';
import {MdOutlineAddBox as CreateIcon} from 'react-icons/md';

import {Table} from 'Components';
import {useHttp} from 'Hooks';
import {getTrucks} from 'Shared/Services';
import {getSelectDataSource} from 'Shared/Utilities/common.util';
import {TRUCK_SCHEMA} from 'Shared/Utilities/tableSchema';

const Truck = (props) => {
    const {requestHandler} = useHttp();
    const [data, setData] = useState([]);
    // const [pagination, setPagination] = useState({total: 0});
    const [loading, toggleLoading] = useState(false);

    useEffect(() => {
        getDataSource();
    }, []);

    const getDataSource = () => {
        toggleLoading(true);
        const include = 'vehicle_category,depo,business_unit,members';
        const params = {per_page: 100, page_no: 1, include};
        getSelectDataSource(requestHandler, getTrucks(params))
            .then(res => {
                const {data, meta: {pagination}} = res;
                setData(data);
                // setPagination({total: pagination.count});
            })
            .catch(e => console.error(e))
            .finally(() => toggleLoading(false));
    };

    return (
        <Paper padding="sm" withBorder style={{height: '100%'}}>
            <Group position="apart" mb="sm">
                <Title order={2} color="red">Truck</Title>
                <Button leftIcon={<CreateIcon/>} variant="light">Create Truck</Button>
            </Group>
            <div style={{height: 'calc(100% - 60px)'}}>
                {data && <Table
                    schema={TRUCK_SCHEMA} data={data}
                    stickyHeader loading={loading}
                    pagination={data.length > 10}
                    total={data.length}
                />}
            </div>
        </Paper>
    );
};

export default Truck;