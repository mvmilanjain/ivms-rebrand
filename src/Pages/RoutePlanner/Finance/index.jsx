import {useCallback, useState} from 'react';
import {ActionIcon, Button, Group} from '@mantine/core';
import {useSetState} from '@mantine/hooks';
import {MdOutlineEdit as EditIcon, MdOutlineFilterList as FilterIcon} from 'react-icons/md';

import {ContentArea, ReactTable} from 'Components';
import {useHttp} from 'Hooks';
import {getRouteOrders} from 'Shared/Services';
import {ROUTE_PLANNER_SCHEMA} from 'Shared/Utilities/tableSchema';
import {getSortText} from 'Shared/Utilities/common.util';
import Filters from './Filters';

const Finance = ({history, ...rest}) => {
    const {requestHandler} = useHttp();
    const [loading, toggleLoading] = useState(false);
    const [openFilterDrawer, toggleFilterDrawer] = useState(false);
    const [state, setState] = useSetState({
        reload: false, data: [], outerFilter: {},
        pagination: {total: 0, pageCount: 0, pageIndex: 0}
    });

    const fetchData = useCallback(({pageSize, pageIndex, sortBy, filters, outerFilter}) => {
        toggleLoading(l => !l);
        const params = {
            per_page: pageSize, page_no: pageIndex + 1,
            filter: {...outerFilter, status_eq: 2},
            sort: sortBy && sortBy.length ? getSortText(sortBy) : 'order_number.desc'
        };
        requestHandler(getRouteOrders(params)).then(res => {
            const {data, meta: {pagination: {count, current_page, total_pages}}} = res;
            setState({
                reload: false, data, pagination: {total: count, pageCount: total_pages, pageIndex: current_page - 1}
            });
        }).catch(e => console.error(e)).finally(() => toggleLoading(l => !l));
    }, []);

    const renderActions = ({value}) => (
        <ActionIcon variant="transparent" onClick={() => handleEdit(value)}>
            <EditIcon/>
        </ActionIcon>
    );

    const handleEdit = (id) => history.push(`/finance/${id}`);

    const handleFilterApply = (data) => {
        toggleFilterDrawer(false);
        setState({outerFilter: {...data}});
    };

    return (
        <ContentArea withPaper limitToViewPort heightToReduce={184} withPadding={false}>
            <Group position="right" mb="md">
                <Button
                    leftIcon={<FilterIcon/>} compact variant="outline"
                    onClick={() => toggleFilterDrawer(o => !o)}
                >
                    Filters
                </Button>
            </Group>
            <div style={{height: 'calc(100% - 48px)'}}>
                <ReactTable
                    columns={[
                        {accessor: 'id', Header: '', disableSortBy: true, Cell: renderActions},
                        ...ROUTE_PLANNER_SCHEMA.FINANCE
                    ]}
                    data={state.data}
                    serverSideDataSource
                    fetchData={fetchData}
                    loading={loading}
                    reload={state.reload}
                    stickyHeader sorting
                    pagination initialPageSize={50}
                    {...state.pagination}
                    outerFilter={state.outerFilter}
                />
            </div>
            <Filters
                opened={openFilterDrawer}
                onClose={() => toggleFilterDrawer(false)}
                data={state.outerFilter}
                onConfirm={handleFilterApply}
            />
        </ContentArea>
    );
};

export default Finance;