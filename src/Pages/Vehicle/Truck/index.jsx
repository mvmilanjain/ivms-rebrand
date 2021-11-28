import {useCallback, useState} from 'react';
import {ActionIcon, Button, Group, Menu, Paper, Title} from '@mantine/core';
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
import {deleteTruck, getTrucks} from 'Shared/Services';
import {VEHICLE} from 'Shared/Utilities/tableSchema';
import {getFilterList, getSortText} from 'Shared/Utilities/common.util';

const Truck = (props) => {
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
            include: 'vehicle_category,depo,business_unit,members',
            sort: getSortText(sortBy), filter: getFilterList(filters)
        };
        requestHandler(getTrucks(params)).then(res => {
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
                <Menu.Item icon={<EditIcon/>}>Edit Truck</Menu.Item>
                <Menu.Item icon={<ViewIcon/>}>View Truck</Menu.Item>
                <Menu.Item icon={<DeleteIcon/>} color="red" onClick={() => openDeleteConfirmModal(value)}>
                    Delete Truck
                </Menu.Item>
            </Menu>
        );
    };

    const openDeleteConfirmModal = (id) => {
        modals.openConfirmModal({
            title: `Are you sure you want to delete the truck?`,
            labels: {confirm: "Delete truck", cancel: "No don't delete it"},
            confirmProps: {color: "red"},
            onConfirm: () => {
                toggleLoading(l => !l);
                requestHandler(deleteTruck(id)).then(() => {
                    notifications.showNotification({
                        title: "Success", color: "green",
                        message: "Truck has been deleted successfully."
                    });
                    setState({reload: true});
                }).catch(e => {
                    notifications.showNotification({
                        title: "Error", color: "red",
                        message: "Not able to delete truck. Something went wrong!!"
                    });
                }).finally(() => toggleLoading(l => !l));
            }
        });
    };

    return (
        <Paper padding="sm" withBorder style={{height: '100%'}}>
            <Group position="apart" mb="sm">
                <Title order={2}>Truck</Title>
                <Button leftIcon={<CreateIcon/>}>Create Truck</Button>
            </Group>
            <div style={{height: 'calc(100% - 60px)'}}>
                <ReactTable
                    columns={[
                        {
                            accessor: 'id', Header: '', disableFilters: true,
                            disableSortBy: true, Cell: renderActions
                        },
                        ...VEHICLE.TRUCK_SCHEMA
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
        </Paper>
    );
};

export default Truck;