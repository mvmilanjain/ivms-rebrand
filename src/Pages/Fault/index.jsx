import {useEffect, useState} from 'react';
import {Button, Group, Paper, Title} from '@mantine/core';
import {MdOutlineAddBox as CreateIcon} from 'react-icons/md';

import {Table} from 'Components';
import {useHttp} from 'Hooks';
import {getFaults} from 'Shared/Services';
import {FAULT_SCHEMA} from 'Shared/Utilities/tableSchema';
import {getSelectDataSource} from 'Shared/Utilities/common.util';

const Fault = (props) => {
    const {requestHandler} = useHttp();
    const [data, setData] = useState([]);
    // const [pagination, setPagination] = useState({total: 0});
    const [loading, toggleLoading] = useState(false);

    useEffect(() => {
        getDataSource();
    }, []);

    const getDataSource = () => {
        toggleLoading(true);
        const params = {per_page: 100, page_no: 1, include: 'vehicle'};
        getSelectDataSource(requestHandler, getFaults(params))
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
                <Title order={2} color="red">Fault</Title>
                <Button leftIcon={<CreateIcon/>} variant="light">Create Fault</Button>
            </Group>
            <div style={{height: 'calc(100% - 60px)'}}>
                {data && <Table
                    schema={FAULT_SCHEMA} data={data}
                    stickyHeader loading={loading}
                    pagination
                    total={data.length}
                />}
            </div>
        </Paper>
    );
};

export default Fault;