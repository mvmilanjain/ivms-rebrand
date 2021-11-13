import {useEffect, useState} from 'react';
import {ActionIcon, Button, Group, Menu, Paper, Title} from '@mantine/core';
import {useNotifications} from '@mantine/notifications';
import {DotsVerticalIcon} from '@modulz/radix-icons';
import {
    MdOutlineAddBox as CreateIcon,
    MdOutlineDelete as DeleteIcon,
    MdOutlineEdit as EditIcon,
    MdOutlineVisibility as ViewIcon
} from 'react-icons/md';

import {ConfirmModal, Table} from 'Components';
import {useHttp} from 'Hooks';
import {deleteRoute, getRoutes} from 'Shared/Services';
import {getSelectDataSource} from 'Shared/Utilities/common.util';
import {ROUTE_SCHEMA} from 'Shared/Utilities/tableSchema';

const Route = (props) => {
    const {requestHandler} = useHttp();
    const notifications = useNotifications();
    const [data, setData] = useState([]);
    // const [pagination, setPagination] = useState({total: 0});
    const [loading, toggleLoading] = useState(false);
    const [openDeleteModal, toggleDeleteModal] = useState(false);
    const [selectedRouteId, setRouteId] = useState(null);

    useEffect(() => {
        getDataSource();
    }, []);

    const getDataSource = () => {
        toggleLoading(true);
        const params = {per_page: 100, page_no: 1, include: 'source_address,destination_address'};
        getSelectDataSource(requestHandler, getRoutes(params))
            .then(res => {
                const {data, meta: {pagination}} = res;
                setData(data);
                // setPagination({total: pagination.count});
            })
            .catch(e => console.error(e))
            .finally(() => toggleLoading(false));
    };

    const renderActions = (row) => {
        return <Menu
            withArrow size="sm"
            control={<ActionIcon variant="transparent"><DotsVerticalIcon/></ActionIcon>}
        >
            <Menu.Item icon={<EditIcon/>}>Edit Route</Menu.Item>
            <Menu.Item icon={<ViewIcon/>}>View Route</Menu.Item>
            <Menu.Item icon={<DeleteIcon/>} color="red" onClick={() => openDeleteConfirmModal(row.id)}>
                Delete Route
            </Menu.Item>
        </Menu>
    };

    const openDeleteConfirmModal = (routeId) => {
        setRouteId(routeId);
        toggleDeleteModal(true);
    };

    const handleDeleteCancel = () => {
        setRouteId(null);
        toggleDeleteModal(false);
    };

    const handleDeleteConfirm = () => {
        toggleDeleteModal(false);
        toggleLoading(true);
        requestHandler(deleteRoute(selectedRouteId)).then(() => {
            toggleLoading(false);
            notifications.showNotification({
                title: 'Success', color: 'green',
                message: 'Route has been deleted successfully.'
            });
            getDataSource();
        }).catch(e => {
            toggleLoading(false);
            notifications.showNotification({
                title: 'Error', color: 'red',
                message: 'Not able to delete route. Something went wrong!!'
            });
        }).finally(() => setRouteId(null));
    };

    return (
        <>
            <ConfirmModal
                title="Are you sure you want to delete the route?"
                opened={openDeleteModal}
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
            />
            <Paper padding="sm" withBorder style={{height: '100%'}}>
                <Group position="apart" mb="sm">
                    <Title order={2}>Routes</Title>
                    <Button leftIcon={<CreateIcon/>}>Create Route</Button>
                </Group>
                <div style={{height: 'calc(100% - 60px)'}}>
                    {data && <Table
                        schema={[
                            {id: 'actions', header: '', render: renderActions},
                            ...ROUTE_SCHEMA
                        ]}
                        data={data}
                        stickyHeader
                        pagination
                        loading={loading}
                        total={data.length}
                    />}
                </div>
            </Paper>
        </>
    );
};

export default Route;