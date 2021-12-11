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

import {ContentArea, ReactTable} from 'Components';
import {useHttp} from 'Hooks';
import {deleteRoute, getRoutes} from 'Shared/Services';
import {getFilterList, getSortText} from 'Shared/Utilities/common.util';
import {ROUTE_SCHEMA} from 'Shared/Utilities/tableSchema';

const Route = ({history}) => {
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
            per_page: pageSize, page_no: pageIndex + 1,
            include: 'source_address,destination_address',
            sort: getSortText(sortBy), filter: getFilterList(filters)
        };
        requestHandler(getRoutes(params)).then(res => {
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
                <Menu.Item icon={<EditIcon/>} onClick={() => handleEdit(value)}>Edit Route</Menu.Item>
                <Menu.Item icon={<ViewIcon/>}>View Route</Menu.Item>
                <Menu.Item icon={<DeleteIcon/>} color="red" onClick={() => handleDelete(value)}>
                    Delete Route
                </Menu.Item>
            </Menu>
        );
    };

    const handleCreate = () => history.push(`/Route/New`, {action: 'New'});

    const handleEdit = (id) => history.push(`/Route/Edit/${id}`, {action: 'Edit'});

    const handleDelete = (id) => {
        modals.openConfirmModal({
            title: "Are you sure you want to delete the route?",
            labels: {confirm: "Delete route", cancel: "No don't delete it"},
            confirmProps: {color: "red"},
            onConfirm: () => {
                toggleLoading(l => !l);
                requestHandler(deleteRoute(id)).then(() => {
                    notifications.showNotification({
                        title: "Success", color: "green",
                        message: "Route has been deleted successfully."
                    });
                    setState({reload: true});
                }).catch(e => {
                    notifications.showNotification({
                        title: "Error", color: 'red',
                        message: 'Not able to delete route. Something went wrong!!'
                    });
                }).finally(() => toggleLoading(l => !l));
            }
        });
    };

    return (
        <ContentArea withPaper limitToViewPort>
            <Group position="apart" mb="md">
                <Title order={2}>Routes</Title>
                <Button leftIcon={<CreateIcon/>} onClick={handleCreate}>Create Route</Button>
            </Group>
            <div style={{height: 'calc(100% - 60px)'}}>
                <ReactTable
                    columns={[
                        {
                            accessor: 'id', Header: '', disableFilters: true,
                            disableSortBy: true, Cell: renderActions
                        },
                        ...ROUTE_SCHEMA
                    ]}
                    data={state.data}
                    serverSideDataSource
                    fetchData={fetchData}
                    loading={loading}
                    reload={state.reload}
                    stickyHeader sorting filtering
                    pagination initialPageSize={50}
                    {...state.pagination}
                />
            </div>
        </ContentArea>
    );
};

export default Route;