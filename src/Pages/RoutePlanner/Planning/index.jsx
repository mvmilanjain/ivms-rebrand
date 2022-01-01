import {useCallback, useState} from 'react';
import last from 'lodash/last';
import {ActionIcon, Button, Group, Menu} from '@mantine/core';
import {useSetState} from '@mantine/hooks';
import {useModals} from '@mantine/modals';
import {useNotifications} from '@mantine/notifications';
import {DotsVerticalIcon} from '@modulz/radix-icons';
import {
    MdOutlineAddBox as CreateIcon,
    MdOutlineCancelPresentation as CancelTripIcon,
    MdOutlineCheckCircle as CompleteTripIcon,
    MdOutlineEdit as EditIcon,
    MdOutlineFileCopy as CopyIcon,
    MdOutlineFilterList as FilterIcon,
    MdOutlineVisibility as ViewIcon,
    MdPlayCircleOutline as StartTripIcon
} from 'react-icons/md';
import {AiOutlineExport as ExportIcon} from 'react-icons/ai';

import {ContentArea, ReactTable} from 'Components';
import {useHttp} from 'Hooks';
import {Plan} from 'Shared/Models';
import {getRouteOrder, getRouteOrders, postUpdateState} from 'Shared/Services';
import {TRIP_EVENT, TRIP_STATUS} from 'Shared/Utilities/constant';
import {ROUTE_PLANNER_SCHEMA} from 'Shared/Utilities/tableSchema';
import {exportCSV, getSortText} from 'Shared/Utilities/common.util';
import Filters from './Filters';
import CompleteTripEventForm from '../EventForm/CompleteTripEventForm';
import StartTripEventForm from '../EventForm/StartTripEventForm';
import CancelTripEventForm from '../EventForm/CancelTripEventForm';

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

    const renderActions = ({row, value}) => {
        const status = row.original.status;
        return (
            <Menu withArrow control={<ActionIcon variant="transparent"><DotsVerticalIcon/></ActionIcon>}>
                <Menu.Label>Planning</Menu.Label>
                <Menu.Item icon={<EditIcon/>} onClick={() => handleEdit(value)}>Edit Plan</Menu.Item>
                <Menu.Item icon={<CopyIcon/>} onClick={() => handleCopyPlan(value)}>Copy Plan</Menu.Item>
                <Menu.Item icon={<ViewIcon/>}>View Plan</Menu.Item>

                {(status === TRIP_STATUS.IN_PROGRESS || status === TRIP_STATUS.COMPLETED) && (
                    <Menu.Label>Operation</Menu.Label>
                )}
                {(status === TRIP_STATUS.IN_PROGRESS || status === TRIP_STATUS.COMPLETED) && (
                    <Menu.Item icon={<EditIcon/>} onClick={() => handleOperationUpdate(value)}>
                        Edit Operation
                    </Menu.Item>
                )}

                {status === TRIP_STATUS.COMPLETED && <Menu.Label>Finance</Menu.Label>}
                {status === TRIP_STATUS.COMPLETED &&
                    <Menu.Item icon={<EditIcon/>} onClick={() => handleFinanceUpdate(value)}>
                        Edit Finance
                    </Menu.Item>}

                {(status === TRIP_STATUS.NOT_STARTED || status === TRIP_STATUS.IN_PROGRESS) && (
                    <Menu.Label>Event</Menu.Label>
                )}
                {status === TRIP_STATUS.NOT_STARTED && <Menu.Item
                    icon={<StartTripIcon/>}
                    onClick={() => handleTripEvent(value, TRIP_EVENT.START)}
                >
                    Start Trip
                </Menu.Item>}
                {status === TRIP_STATUS.IN_PROGRESS && <Menu.Item
                    icon={<CompleteTripIcon/>}
                    onClick={() => handleTripEvent(value, TRIP_EVENT.COMPLETE)}
                >
                    Complete Trip
                </Menu.Item>}
                {status === TRIP_STATUS.NOT_STARTED && <Menu.Item
                    icon={<CancelTripIcon/>}
                    onClick={() => handleTripEvent(value, TRIP_EVENT.CANCEL)}
                >
                    Cancel Trip
                </Menu.Item>}
            </Menu>
        );
    };

    const handleCreate = () => history.push('/planning');

    const handleEdit = (id) => history.push(`/planning/${id}`);

    const handleCopyPlan = async (id) => {
        try {
            // Get Plan details
            const paramsForPlan = {
                include: 'vehicle,member,route,product,contractor,source_address,destination_address,' +
                    'estimated_fuel_location,route_order_stoppages,route_order_stoppages.address,' +
                    'driver_current_route'
            };
            const planRes = await requestHandler(getRouteOrder(id, paramsForPlan), {loader: true});
            // Get Not started Plan list
            const paramsForPlanList = {
                per_page: 100, page_no: 1, sort: 'planned_load_start_time.asc', include: 'vehicle,route',
                filter: {vehicle_id_eq: planRes.data.vehicle_id, status_eq: 'not_started'}
            };
            const notStatedPlanList = await requestHandler(getRouteOrders(paramsForPlanList), {loader: true});
            const lastPlanEta = notStatedPlanList.data.length > 0 ? last(notStatedPlanList.data).planned_eta_destination : null;

            history.push('/planning', {data: Plan.copyPlan(planRes.data, lastPlanEta)});
        } catch (e) {
            notifications.showNotification({
                title: 'Error', color: 'red',
                message: 'Not able to copy selected route order details. Something went wrong!!'
            });
        }
    };

    const handleExport = () => exportCSV('route_planner_plan', ROUTE_PLANNER_SCHEMA.PLANNING, state.data);

    const handleFilterApply = (data) => {
        toggleFilterDrawer(false);
        setState({outerFilter: {...data}});
    };

    const handleOperationUpdate = (id) => history.push(`/operation/${id}`);

    const handleFinanceUpdate = (id) => history.push(`/finance/${id}`);

    const handleTripEvent = (id, action) => {
        let EventFrom = null, status = '';
        if (action === TRIP_EVENT.START) {
            EventFrom = StartTripEventForm;
            status = 'started';
        } else if (action === TRIP_EVENT.COMPLETE) {
            EventFrom = CompleteTripEventForm;
            status = 'completed';
        } else if (action === TRIP_EVENT.CANCEL) {
            EventFrom = CancelTripEventForm;
            status = 'cancelled';
        }
        const modalId = modals.openModal({
            title: 'Manage Trip Event',
            centered: false,
            children: <EventFrom onConfirm={(data) => {
                modals.closeModal(modalId);
                requestHandler(postUpdateState(id, action, data), {loader: true}).then(res => {
                    notifications.showNotification({
                        title: 'Success', color: 'green', message: `Trip has been ${status} successfully`
                    });
                    setState({reload: true});
                }).catch(e => {
                    notifications.showNotification({
                        title: 'Error', color: 'red',
                        message: 'Not able to perform event. Something went wrong!!'
                    });
                });
            }}/>
        });
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
                <Button leftIcon={<CreateIcon/>} compact onClick={handleCreate}>Create Plan</Button>
            </Group>
            <div style={{height: 'calc(100% - 48px)'}}>
                <ReactTable
                    columns={[
                        {accessor: 'id', Header: '', disableSortBy: true, Cell: renderActions},
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
            <Filters
                opened={openFilterDrawer}
                onClose={() => toggleFilterDrawer(false)}
                data={state.outerFilter}
                onConfirm={handleFilterApply}
            />
        </ContentArea>
    );
};

export default Planning;