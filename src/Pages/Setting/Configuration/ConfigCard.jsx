import {useEffect, useState} from 'react';
import {ActionIcon, Card, Divider, Group, LoadingOverlay, ScrollArea, Text} from '@mantine/core';
import {useModals} from '@mantine/modals';
import {useNotifications} from '@mantine/notifications';
import {MdAddBox as AddIcon, MdOutlineDelete as DeleteIcon, MdOutlineEdit as EditIcon} from 'react-icons/md';

import {useHttp} from 'Hooks';
import {deleteConfigField, getConfigField, postConfigField, putConfigField} from 'Shared/Services';
import NewOrEditRecordForm from "./NewOrEditRecordForm";

const ConfigCard = ({title, type}) => {
    const {requestHandler} = useHttp();
    const modals = useModals();
    const notifications = useNotifications();
    const [loading, toggleLoading] = useState(false);
    const [data, setData] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        toggleLoading(true);
        requestHandler(getConfigField(type))
            .then(res => setData(res.data))
            .catch(e => console.error(e))
            .finally(() => toggleLoading(false));
    };

    const handleCreate = () => {
        const id = modals.openModal({
            title: 'Create Record',
            children: (
                <NewOrEditRecordForm action="Save" onConfirm={(values) => {
                    modals.closeModal(id);
                    requestHandler(postConfigField(type, values), {loader: true}).then(res => {
                        fetchData();
                    }).catch(e => {
                        notifications.showNotification({
                            title: "Error", color: 'red',
                            message: 'Not able to save. Something went wrong!!'
                        });
                    });
                }}/>
            ),
        });
    };

    const handleEdit = (item) => {
        const id = modals.openModal({
            title: 'Edit Record',
            children: (
                <NewOrEditRecordForm data={item} action="Update" onConfirm={(values) => {
                    modals.closeModal(id);
                    requestHandler(putConfigField(item.id, type, values), {loader: true}).then(res => {
                        fetchData();
                    }).catch(e => {
                        notifications.showNotification({
                            title: "Error", color: 'red',
                            message: 'Not able to update. Something went wrong!!'
                        });
                    });
                }}/>
            ),
        });
    };

    const handleDelete = (id) => {
        modals.openConfirmModal({
            title: "Are you sure you want to delete?",
            labels: {confirm: "Delete", cancel: "No don't delete it"},
            confirmProps: {color: "red"},
            onConfirm: () => {
                requestHandler(deleteConfigField(id, type), {loader: true}).then(() => {
                    notifications.showNotification({
                        title: "Success", color: "green",
                        message: "Record has been deleted successfully."
                    });
                    fetchData();
                }).catch(e => {
                    notifications.showNotification({
                        title: "Error", color: 'red',
                        message: 'Not able to delete. Something went wrong!!'
                    });
                });
            }
        });
    };

    return (
        <Card shadow="md" padding="lg" withBorder radius="md">
            <LoadingOverlay visible={loading}/>
            <Group position="apart" mb="sm">
                <Text weight={600}>{title}</Text>
                <ActionIcon color="blue" variant="hover" onClick={handleCreate}>
                    <AddIcon/>
                </ActionIcon>
            </Group>
            <Divider mb="sm"/>

            <ScrollArea style={{height: 200}} scrollHideDelay={100} mr={-16}>
                {data.map(item => (
                    <Group key={item.id} position="apart" mb="sm" mr={16}>
                        <Text>{item.name}</Text>
                        <Group position="right" spacing={0}>
                            <ActionIcon variant="hover" onClick={() => handleEdit(item)} mr={4}>
                                <EditIcon/>
                            </ActionIcon>
                            <ActionIcon color="red" variant="hover" onClick={() => handleDelete(item.id)}>
                                <DeleteIcon/>
                            </ActionIcon>
                        </Group>
                    </Group>
                ))}

                {!loading && !(data && data.length) && (
                    <Text weight="bold" size="xl" color="dimmed">
                        No record found
                    </Text>
                )}
            </ScrollArea>
        </Card>
    );
};

export default ConfigCard;