import {useEffect, useState} from 'react';
import {useFormik} from 'formik';
import {Badge, Button, Checkbox, Divider, Group, Text, Title} from '@mantine/core';
import {useNotifications} from '@mantine/notifications';
import {MdOutlineSave as SaveIcon} from 'react-icons/md';

import {ContentArea} from 'Components';
import {useHttp} from 'Hooks';
import {getRouteOrder, putRouteOrder} from 'Shared/Services';
import {Finance} from 'Shared/Models';
import {registerField} from 'Shared/Utilities/common.util';

const FinanceForm = ({history, location, match, ...rest}) => {
    const {requestHandler} = useHttp();
    const notifications = useNotifications();
    const [initialValue, setInitialValue] = useState({});

    useEffect(() => {
        const {params: {id}} = match;
        requestHandler(getRouteOrder(id), {loader: true}).then(res => {
            const initialData = new Finance(res.data);
            setInitialValue(initialData);
        }).catch(e => {
            notifications.showNotification({
                title: 'Error', color: 'red', message: 'Not able to fetch route order details. Something went wrong!!'
            });
        });
    }, []);

    const handleChange = (key) => setFieldValue(key, !values[key]);

    const onSubmit = () => {
        requestHandler(putRouteOrder(match.params.id, {route_order: values}), {loader: true}).then(res => {
            notifications.showNotification({
                title: "Success", color: 'green', message: 'Finance has been saved successfully.'
            });
            history.goBack();
        }).catch(e => {
            notifications.showNotification({
                title: "Error", color: 'red', message: 'Not able to save finance details. Something went wrong!!'
            });
        });
    };

    const {values, touched, errors, handleSubmit, setFieldValue} = useFormik({
        enableReinitialize: true,
        initialValues: initialValue,
        onSubmit
    });

    return (
        <ContentArea withPaper>
            <form onSubmit={handleSubmit}>
                <Group position="apart" mb="md">
                    <Title order={3}>Finance</Title>
                    <Group position="apart">
                        <Button variant="default" onClick={() => history.push('/RoutePlanner')}>
                            Cancel
                        </Button>
                        <Button leftIcon={<SaveIcon/>} type="submit">Update</Button>
                    </Group>
                </Group>
                <Divider mb="md" variant="dotted"/>

                <Group mb="xl">
                    <Text size="lg" weight={600} mb={0}>
                        Order #: <Text color="blue" inherit component="span">{values.order_number}</Text>
                    </Text>
                    <Badge variant="filled" radius="lg" color="green">{values.status}</Badge>
                </Group>

                <Group direction="column" spacing="xl">
                    <Checkbox
                        label="Is document validated?"
                        checked={values.document_validated}
                        onChange={() => handleChange('document_validated')}
                    />

                    <Checkbox
                        label="Is document sent to client?"
                        checked={values.document_sent_to_client}
                        onChange={() => handleChange('document_sent_to_client')}
                    />

                    <Checkbox
                        label="Is payment received?"
                        checked={values.payment_recieved}
                        onChange={() => handleChange('payment_recieved')}
                    />

                    <Checkbox
                        label="Is invoice sent?"
                        checked={values.invoice_recieved}
                        onChange={() => handleChange('invoice_recieved')}
                    />
                </Group>
            </form>
        </ContentArea>
    );
}

export default FinanceForm;