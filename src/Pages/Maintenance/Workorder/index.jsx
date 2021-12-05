import {useCallback, useState} from 'react';
import {ActionIcon, Button, Group, Menu, Title} from '@mantine/core';
import {useSetState} from '@mantine/hooks';
import {useModals} from '@mantine/modals';
import {useNotifications} from '@mantine/notifications';
import {DotsVerticalIcon} from '@modulz/radix-icons';
import {
    MdOutlineAddBox as CreateIcon,
    MdOutlineDelete as DeleteIcon,
    MdOutlineEdit as EditIcon,
    MdOutlineVisibility as ViewIcon
} from 'react-icons/md';

import {ReactTable} from 'Components';
import {useHttp} from 'Hooks';
import {deleteOrder, getOrders} from 'Shared/Services';
import {getFilterList, getSortText} from 'Shared/Utilities/common.util';
import {MAINTENANCE} from 'Shared/Utilities/tableSchema';

const Workorder = (props) => {
    const {requestHandler} = useHttp();
    const modals = useModals();
    const notifications = useNotifications();
    const [loading, toggleLoading] = useState(false);
    const [state, setState] = useSetState({
        reload: false, data: [],
        pagination: {total: 0, pageCount: 0, pageIndex: 0}
    });

    const fetchData = useCallback(({pageSize, pageIndex, sortBy, filters}) => {
        toggleLoading(l => !l);
        const params = {
            per_page: pageSize, page_no: pageIndex + 1, include: 'vehicle,assignee',
            sort: getSortText(sortBy), filter: getFilterList(filters)
        };
        requestHandler(getOrders(params)).then(res => {
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
                <Menu.Item icon={<EditIcon/>}>Edit Order</Menu.Item>
                <Menu.Item icon={<ViewIcon/>}>View Order</Menu.Item>
                <Menu.Item icon={<DeleteIcon/>} color="red" onClick={() => openDeleteConfirmModal(value)}>
                    Delete Order
                </Menu.Item>
            </Menu>
        );
    };

    const openDeleteConfirmModal = (routeId) => {
        modals.openConfirmModal({
            title: "Are you sure you want to delete the workorder?",
            labels: {confirm: "Delete workorder", cancel: "No don't delete it"},
            confirmProps: {color: "red"},
            onConfirm: () => {
                toggleLoading(l => !l);
                requestHandler(deleteOrder(routeId)).then(() => {
                    notifications.showNotification({
                        title: "Success", color: "green",
                        message: "Workorder has been deleted successfully."
                    });
                    setState({reload: true});
                }).catch(e => {
                    notifications.showNotification({
                        title: "Error", color: 'red',
                        message: 'Not able to delete workorder. Something went wrong!!'
                    });
                }).finally(() => toggleLoading(l => !l));
            }
        });
    };

    return (
        <>
            <Group position="apart" mb="md">
                <Title order={2}>Workorder</Title>
                <Button leftIcon={<CreateIcon/>}>Create Workorder</Button>
            </Group>
            <div style={{height: 'calc(100% - 60px)'}}>
                <ReactTable
                    columns={[
                        {
                            accessor: 'id', Header: '', disableFilters: true, disableSortBy: true,
                            cellMinWidth: 40, cellWidth: 40, Cell: renderActions
                        },
                        ...MAINTENANCE.ORDER_SCHEMA
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
        </>
    );
};

export default Workorder;