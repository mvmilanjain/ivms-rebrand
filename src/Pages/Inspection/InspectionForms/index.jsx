import {useCallback, useState} from 'react';
import {ActionIcon, Button, Group, Menu} from '@mantine/core';
import {useSetState} from '@mantine/hooks';
import {useNotifications} from '@mantine/notifications';
import {useModals} from '@mantine/modals';
import {DotsVerticalIcon} from '@modulz/radix-icons';
import {MdListAlt as ManageSectionIcon, MdOutlineAddBox as CreateIcon, MdOutlineEdit as EditIcon} from 'react-icons/md';

import {ContentArea, ReactTable} from 'Components';
import {useHttp} from 'Hooks';
import {getSortText} from 'Shared/Utilities/common.util';
import {getInspectionForms, postInspectionForm, putInspectionForm} from 'Shared/Services';
import {INSPECTION} from 'Shared/Utilities/tableSchema';
import InspectionForm from './InspectionForm';

const InspectionForms = ({history}) => {
    const {requestHandler} = useHttp();
    const notifications = useNotifications();
    const modals = useModals();
    const [loading, toggleLoading] = useState(false);
    const [state, setState] = useSetState({
        reload: false, data: [],
        pagination: {total: 0, pageCount: 0, pageIndex: 0}
    });

    const fetchData = useCallback(({pageSize, pageIndex, sortBy, filters, outerFilter}) => {
        toggleLoading(l => !l);
        const params = {
            per_page: pageSize, page_no: pageIndex + 1,
            sort: getSortText(sortBy), filter: outerFilter
        };
        requestHandler(getInspectionForms(params)).then(res => {
            const {data, meta: {pagination: {count, current_page, total_pages}}} = res;
            setState({
                reload: false, data,
                pagination: {total: count, pageCount: total_pages, pageIndex: current_page - 1}
            });
        }).catch(e => console.error(e)).finally(() => toggleLoading(l => !l));
    }, []);

    const renderActions = ({value, row}) => {
        return (
            <Menu withArrow size="md" control={<ActionIcon variant="transparent"><DotsVerticalIcon/></ActionIcon>}>
                <Menu.Item icon={<EditIcon/>} onClick={() => handleEdit(value, row.original)}>Edit Form</Menu.Item>
                <Menu.Item icon={<ManageSectionIcon/>} color="green" onClick={() => handleManageSection(value)}>
                    Manage section
                </Menu.Item>
            </Menu>
        );
    };

    const handleCreate = () => {
        const modalId = modals.openModal({
            title: 'New inspection form',
            children: <InspectionForm
                onConfirm={(values) => {
                    modals.closeModal(modalId);
                    const payload = {inspection_form: values};
                    requestHandler(postInspectionForm(payload), {loader: true}).then(res => {
                        notifications.showNotification({
                            message: 'Success', color: 'green',
                            message: 'Inspection form has been saved successfully!!'
                        });
                        setState({reload: true});
                    }).catch(e => {
                        notifications.showNotification({
                            message: 'Error', color: 'red',
                            message: 'Not able to create inspection form. Something went wrong!!'
                        });
                    });
                }}
            />
        });
    };

    const handleEdit = (id, data) => {
        const modalId = modals.openModal({
            title: 'New inspection form',
            children: <InspectionForm
                data={data}
                onConfirm={(values) => {
                    modals.closeModal(modalId);
                    const payload = {inspection_form: values};
                    requestHandler(putInspectionForm(id, payload), {loader: true}).then(res => {
                        notifications.showNotification({
                            message: 'Success', color: 'green',
                            message: 'Inspection form has been updated successfully!!'
                        });
                        setState({reload: true});
                    }).catch(e => {
                        notifications.showNotification({
                            message: 'Error', color: 'red',
                            message: 'Not able to update inspection form. Something went wrong!!'
                        });
                    });
                }}
            />
        });
    };

    const handleManageSection = (id) => history.push(`/inspection_form/${id}`);

    return (
        <ContentArea withPaper limitToViewPort withPadding={false} heightToReduce={184}>
            <Group position="right" mb="md">
                <Button leftIcon={<CreateIcon/>} compact onClick={handleCreate}>Create Inspection Form</Button>
            </Group>
            <div style={{height: 'calc(100% - 48px)'}}>
                <ReactTable
                    columns={[
                        {accessor: 'id', Header: '', disableSortBy: true, cellWidth: 40, Cell: renderActions},
                        ...INSPECTION.FORM
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
        </ContentArea>
    );
};

export default InspectionForms;