import {useCallback, useState} from 'react';
import {ActionIcon, Button, Drawer, Group, Menu} from '@mantine/core';
import {useSetState} from '@mantine/hooks';
import {useModals} from '@mantine/modals';
import {useNotifications} from '@mantine/notifications';
import {DotsVerticalIcon} from '@modulz/radix-icons';
import {
    MdOutlineAddBox as CreateIcon,
    MdOutlineCloudDownload as ExportIcon,
    MdOutlineEdit as EditIcon,
    MdOutlineFilterList as FilterIcon
} from 'react-icons/md';
import {ContentArea, ReactTable} from 'Components';
import {useHttp} from 'Hooks';
import {getRouteOrders} from 'Shared/Services';
import {ROUTE_PLANNER_SCHEMA} from 'Shared/Utilities/tableSchema';
import {exportCSV, getSortText} from 'Shared/Utilities/common.util';
import Filters from './Filters';

const Planning = ({history, ...rest}) => {
    const {requestHandler} = useHttp();
    const modals = useModals();
    const notifications = useNotifications();
    const [loading, toggleLoading] = useState(false);
    const [openFilterDrawer, toggleFilterDrawer] = useState(false);
    const [state, setState] = useSetState({
        reload: false, data: [], outerFilter: {},
        pagination: {total: 0, pageCount: 0, pageIndex: 0}
    });

    const fetchData = useCallback(({pageSize, pageIndex, sortBy, filters, outerFilter}) => {
        toggleLoading(l => !l);
        const params = {
            per_page: pageSize, page_no: pageIndex + 1, filter: outerFilter,
            sort: sortBy && sortBy.length ? getSortText(sortBy) : 'order_number.desc,order_date.desc',
            include: 'member,vehicle,route,product'
        };
        requestHandler(getRouteOrders(params)).then(res => {
            const {data, meta: {pagination: {count, current_page, total_pages}}} = res;
            setState({
                reload: false, data, pagination: {total: count, pageCount: total_pages, pageIndex: current_page - 1}
            });
        }).catch(e => console.error(e)).finally(() => toggleLoading(l => !l));
    }, []);

    const renderActions = ({value}) => {
        return (
            <Menu withArrow size="sm" control={<ActionIcon variant="transparent"><DotsVerticalIcon/></ActionIcon>}>
                <Menu.Item icon={<EditIcon/>}>Edit Plan</Menu.Item>
                {/*<Menu.Item icon={<ViewIcon/>}>View Trailer</Menu.Item>*/}
            </Menu>
        );
    };

    const handleCreate = () => history.push(`/RoutePlanner/Plan/New`, {action: 'New'});

    const handleExport = () => {
        exportCSV('route_planner_plan', ROUTE_PLANNER_SCHEMA.PLANNING, state.data);
    };

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
                <Button
                    compact color="green"
                    leftIcon={<ExportIcon/>}
                    disabled={!state.data.length}
                    onClick={handleExport}
                >
                    Export
                </Button>
                <Button leftIcon={<CreateIcon/>} compact onClick={handleCreate}>
                    Create Plan
                </Button>
            </Group>
            <div style={{height: 'calc(100% - 48px)'}}>
                <ReactTable
                    columns={[
                        {
                            accessor: 'id', Header: '', disableFilters: true,
                            disableSortBy: true, Cell: renderActions
                        },
                        ...ROUTE_PLANNER_SCHEMA.PLANNING
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
            <Drawer
                opened={openFilterDrawer}
                onClose={() => toggleFilterDrawer(false)}
                position="right"
                title="Filters"
                padding="xl" size="xl"
            >
                {openFilterDrawer && <Filters data={state.outerFilter} onConfirm={handleFilterApply}/>}
            </Drawer>
        </ContentArea>
    );
};

export default Planning;