import {useEffect, useState} from 'react';
import {Button, Group, Paper, Title} from '@mantine/core';
import {MdOutlineAddBox as CreateIcon} from 'react-icons/md';

import {Table} from 'Components';
import {useHttp} from 'Hooks';
import {getProducts} from 'Shared/Services';
import {getSelectDataSource} from 'Shared/Utilities/common.util';
import {PRODUCT_SCHEMA} from 'Shared/Utilities/tableSchema';

const Product = (props) => {
    const {requestHandler} = useHttp();
    const [data, setData] = useState([]);
    // const [pagination, setPagination] = useState({total: 0});
    const [loading, toggleLoading] = useState(false);

    useEffect(() => {
        getDataSource();
    }, []);

    const getDataSource = () => {
        toggleLoading(true);
        const params = {per_page: 100, page_no: 1};
        getSelectDataSource(requestHandler, getProducts(params))
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
                <Title order={2}>Product</Title>
                <Button leftIcon={<CreateIcon/>}>Create Product</Button>
            </Group>
            <div style={{height: 'calc(100% - 60px)'}}>
                {data && <Table
                    schema={PRODUCT_SCHEMA}
                    data={data}
                    pagination
                    stickyHeader
                    loading={loading}
                    total={data.length}
                />}
            </div>
        </Paper>
    );
};

export default Product;