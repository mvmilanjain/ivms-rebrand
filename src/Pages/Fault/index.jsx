import {useCallback, useState} from 'react';
import {ActionIcon, Box, Button, Group, Menu, Title} from '@mantine/core';
import {useSetState} from '@mantine/hooks';
import {useModals} from '@mantine/modals';
import {useNotifications} from '@mantine/notifications';
import {DotsVerticalIcon} from '@modulz/radix-icons';
import {MdOutlineAddBox as CreateIcon, MdOutlineDelete as DeleteIcon, MdOutlineEdit as EditIcon} from 'react-icons/md';

import {ContentArea, ReactTable} from 'Components';
import {useHttp} from 'Hooks';
import {deleteFault, getFaults} from 'Shared/Services';
import {FAULT_SCHEMA} from 'Shared/Utilities/tableSchema';
import {getFilterList, getSortText} from 'Shared/Utilities/common.util';

const Fault = ({history, ...rest}) => {
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
                <Menu.Item icon={<EditIcon/>} onClick={() => handleEdit(value)}>Edit Fault</Menu.Item>
                <Menu.Item icon={<DeleteIcon/>} color="red" onClick={() => handleDelete(value)}>
                    Delete Fault
                </Menu.Item>
            </Menu>
        );
    };

    const handleCreate = () => history.push(`/Fault/New`, {action: 'New'});

    const handleEdit = (id) => history.push(`/Fault/Edit/${id}`, {action: 'Edit'});

    const handleDelete = (id) => {
        modals.openConfirmModal({
            title: "Are you sure you want to delete the fault?",
            labels: {confirm: "Delete fault", cancel: "No don't delete it"},
            confirmProps: {color: "red"},
            onConfirm: () => {
                toggleLoading(l => !l);
                requestHandler(deleteFault(id)).then(() => {
                    notifications.showNotification({
                        title: "Success", color: "green",
                        message: "Fault has been deleted successfully."
                    });
                    setState({reload: true});
                }).catch(e => {
                    notifications.showNotification({
                        title: "Error", color: 'red',
                        message: 'Not able to delete fault. Something went wrong!!'
                    });
                }).finally(() => toggleLoading(l => !l));
            }
        });
    };

    return (
        <ContentArea withPaper limitToViewPort>
            <Group position="apart" mb="md">
                <Title order={2}>Fault</Title>
                <Button leftIcon={<CreateIcon/>} onClick={handleCreate}>Create Fault</Button>
            </Group>
            <Box style={{height: 'calc(100% - 60px)'}}>
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
            </Box>
        </ContentArea>
    );
};

export default Fault;