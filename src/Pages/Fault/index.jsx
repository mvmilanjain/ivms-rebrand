import {useCallback, useState} from 'react';
import {ActionIcon, Button, Group, Menu, Paper, Title} from '@mantine/core';
import {useSetState} from '@mantine/hooks';
import {DotsVerticalIcon} from '@modulz/radix-icons';
import {
    MdOutlineAddBox as CreateIcon,
    MdOutlineEdit as EditIcon,
    MdOutlineVisibility as ViewIcon
} from 'react-icons/md';

import {ReactTable, Table} from 'Components';
import {useHttp} from 'Hooks';
import {getFaults} from 'Shared/Services';
import {FAULT_SCHEMA, PRODUCT_SCHEMA} from 'Shared/Utilities/tableSchema';
import {getFilterList, getSortText} from 'Shared/Utilities/common.util';

const Fault = (props) => {
    const {requestHandler} = useHttp();
    const [loading, toggleLoading] = useState(false);
    const [state, setState] = useSetState({
        reload: false, data: [],
        pagination: {total: 0, pageCount: 0, pageIndex: 0}
    });

    const fetchData = useCallback(({pageSize, pageIndex, sortBy, filters}) => {
        toggleLoading(l => !l);
        const params = {
            per_page: pageSize, page_no: pageIndex + 1, include: 'vehicle',
            sort: getSortText(sortBy), filter: getFilterList(filters)
        };
        requestHandler(getFaults(params)).then(res => {
            const {data, meta: {pagination: {count, current_page, total_pages}}} = res;
            setState({
                reload: false, data,
                pagination: {total: count, pageCount: total_pages, pageIndex: current_page - 1}
            });
        }).catch(e => console.error(e)).finally(() => toggleLoading(l => !l));
    }, []);

    const renderActions = ({value}) => {
        return (
            <Menu withArrow size="sm" control={<ActionIcon variant="transparent"><DotsVerticalIcon/></ActionIcon>}>
                <Menu.Item icon={<EditIcon/>}>Edit Fault</Menu.Item>
                <Menu.Item icon={<ViewIcon/>}>View Fault</Menu.Item>
            </Menu>
        );
    };

    return (
        <Paper padding="sm" withBorder style={{height: '100%'}}>
            <Group position="apart" mb="sm">
                <Title order={2}>Fault</Title>
                <Button leftIcon={<CreateIcon/>}>Create Fault</Button>
            </Group>
            <div style={{height: 'calc(100% - 60px)'}}>
                <ReactTable
                    columns={[
                        {
                            accessor: 'id', Header: '', disableFilters: true, disableSortBy: true,
                            cellMinWidth: 40, cellWidth: 40, Cell: renderActions
                        },
                        ...FAULT_SCHEMA
                    ]}
                    data={state.data}
                    serverSideDataSource
                    fetchData={fetchData}
                    loading={loading}
                    reload={state.reload}
                    stickyHeader sorting
                    pagination initialPageSize={50}
                    {...state.pagination}
                />
            </div>
        </Paper>
    );
};

export default Fault;