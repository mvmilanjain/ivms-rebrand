import {useCallback, useState} from 'react';
import {ActionIcon, Button, Drawer, Group, Menu} from '@mantine/core';
import {useSetState} from '@mantine/hooks';
import {useModals} from '@mantine/modals';
import {useNotifications} from '@mantine/notifications';
import {DotsVerticalIcon} from '@modulz/radix-icons';
import {
    MdOutlineAddBox as CreateIcon,
    MdOutlineDelete as DeleteIcon,
    MdOutlineEdit as EditIcon,
    MdOutlineFilterList as FilterIcon,
    MdOutlineVisibility as ViewIcon
} from 'react-icons/md';

import {ContentArea, ReactTable} from 'Components';
import {useHttp} from 'Hooks';
import {deleteTrailer, getTrailers} from 'Shared/Services';
import {getSortText} from 'Shared/Utilities/common.util';
import {VEHICLE} from 'Shared/Utilities/tableSchema';
import Filters from './Filters';

const Trailer = ({history}) => {
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
            per_page: pageSize, page_no: pageIndex + 1,
            include: 'trailer_category',
            sort: getSortText(sortBy), filter: outerFilter
        };
        requestHandler(getTrailers(params)).then(res => {
            const {data, meta: {pagination: {count, current_page, total_pages}}} = res;
            setState({
                reload: false, data, pagination: {total: count, pageCount: total_pages, pageIndex: current_page - 1}
            });
        }).catch(e => console.error(e)).finally(() => toggleLoading(l => !l));
    }, []);

    const renderActions = ({value}) => {
        return (
            <Menu withArrow size="sm" control={<ActionIcon variant="transparent"><DotsVerticalIcon/></ActionIcon>}>
                <Menu.Item icon={<EditIcon/>} onClick={() => handleEdit(value)}>Edit Trailer</Menu.Item>
                <Menu.Item icon={<ViewIcon/>}>View Trailer</Menu.Item>
                <Menu.Item icon={<DeleteIcon/>} color="red" onClick={() => handleDelete(value)}>
                    Delete Trailer
                </Menu.Item>
            </Menu>
        );
    };

    const handleCreate = () => history.push(`/Vehicle/Trailer/New`, {action: 'New'});

    const handleEdit = (id) => history.push(`/Vehicle/Trailer/Edit/${id}`, {action: 'Edit'});

    const handleDelete = (id) => {
        modals.openConfirmModal({
            title: `Are you sure you want to delete the trailer?`,
            labels: {confirm: "Delete trailer", cancel: "No don't delete it"},
            confirmProps: {color: "red"},
            onConfirm: () => {
                toggleLoading(l => !l);
                requestHandler(deleteTrailer(id)).then(() => {
                    notifications.showNotification({
                        title: 'Success', color: 'green', message: 'Trailer has been deleted successfully.'
                    });
                    setState({reload: true});
                }).catch(e => {
                    notifications.showNotification({
                        title: 'Error', color: 'red', message: 'Not able to delete trailer. Something went wrong!!'
                    });
                }).finally(() => toggleLoading(l => !l));
            }
        });
    };

    const handleFilterApply = (data) => {
        toggleFilterDrawer(false);
        setState({outerFilter: {...data}});
    };

    return (
        <ContentArea withPaper limitToViewPort heightToReduce={200}>
            <Group position="right" mb="md">
                <Button
                    leftIcon={<FilterIcon/>} variant="outline"
                    onClick={() => toggleFilterDrawer(o => !o)}
                >
                    Filters
                </Button>
                <Button leftIcon={<CreateIcon/>} onClick={handleCreate}>Create Trailer</Button>
            </Group>
            <div style={{height: 'calc(100% - 60px)'}}>
                <ReactTable
                    columns={[
                        {
                            accessor: 'id', Header: '', disableFilters: true,
                            disableSortBy: true, Cell: renderActions
                        },
                        ...VEHICLE.TRAILER_SCHEMA
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

export default Trailer;