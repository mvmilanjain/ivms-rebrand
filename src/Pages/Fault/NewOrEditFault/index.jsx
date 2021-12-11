import {useEffect, useState} from 'react';
import get from 'lodash/get';
import {useFormik} from 'formik';
import {Button, Col, Divider, Grid, Group, Radio, RadioGroup, Textarea, TextInput, Title} from '@mantine/core';
import {useSetState} from '@mantine/hooks';
import {useModals} from '@mantine/modals';
import {useNotifications} from '@mantine/notifications';
import {MdOutlineSave as SaveIcon} from 'react-icons/md';

import {ContentArea, VehicleDropdown} from 'Components';
import {useHttp} from 'Hooks';
import {Fault} from 'Shared/Models';
import {getFault, postFault, putFault} from 'Shared/Services';
import {errorMessage} from 'Shared/Utilities/common.util';
import {FAULT} from 'Shared/Utilities/validationSchema.util';

const NewOrEditFault = ({history, location, match, ...rest}) => {
    const action = location.state.action;
    const {requestHandler} = useHttp();
    const notifications = useNotifications();
    const modals = useModals();
    const [initialValue, setInitialValue] = useState({});
    const [routeMapState, setRouteMapState] = useSetState({
        route: null, activeStoppages: [], initialLoad: false
    });

    const register = (fieldName) => ({
        id: fieldName,
        value: get(values, fieldName),
        onChange: handleChange,
        error: errorMessage(fieldName, touched, errors)
    });

    useEffect(() => {
        if (action === 'New') {
            const fault = new Fault();
            setInitialValue({...fault});
        } else {
            const {params} = match;
            requestHandler(getFault(params.id, {include: 'vehicle'}), {loader: true}).then(res => {
                const fault = new Fault(res.data);
                setInitialValue(fault);
            }).catch(e => {
                notifications.showNotification({
                    title: 'Error', color: 'red', message: 'Not able to fetch fault details. Something went wrong!!'
                });
            });
        }
    }, []);

    const handleVehicleChange = (vehicle) => {
        const fault = new Fault(values);
        fault.setVehicle(vehicle);
        setValues(fault);
    };

    const onSubmit = () => {
        // const payload = {fault: {...values, vehicle_id: values.vehicle.id}};
        const payload = {fault: values};
        const requestConfig = (action === 'New') ? postFault(payload) : putFault(match.params.id, payload);
        requestHandler(requestConfig, {loader: true}).then(res => {
            notifications.showNotification({
                title: 'Success', color: 'green', message: 'Fault has been saved successfully.'
            });
            history.push('/Fault');
        }).catch(e => {
            notifications.showNotification({
                title: 'Error', color: 'red', message: 'Not able to save fault details. Something went wrong!!'
            });
        });
    };

    const {values, touched, errors, handleChange, handleSubmit, setValues, setFieldValue} = useFormik({
        enableReinitialize: true,
        initialValues: initialValue,
        validationSchema: FAULT,
        onSubmit
    });

    return (
        <ContentArea withPaper>
            <form onSubmit={handleSubmit}>
                <Group position="apart" mb="md">
                    <Title order={3}>Fault</Title>
                    <Group position="apart">
                        <Button variant="default" onClick={() => history.push('/Fault')}>
                            Cancel
                        </Button>
                        <Button leftIcon={<SaveIcon/>} type="submit">
                            {action === 'New' ? 'Save' : 'Update'}
                        </Button>
                    </Group>
                </Group>
                <Divider mb="md" variant="dotted"/>

                <Grid mb="md">
                    <Col span={4}>
                        <RadioGroup
                            {...register("fault_type")}
                            label="Select fault type" required size="sm"
                            onChange={val => setFieldValue("fault_type", val)}
                        >
                            <Radio value="repair">Repair</Radio>
                            <Radio value="replace">Replace</Radio>
                        </RadioGroup>
                    </Col>
                    <Col span={8}/>
                    <Col span={4}>
                        <TextInput
                            {...register("name")}
                            label="Fault name"
                            placeholder="Enter fault name"
                            required
                        />
                    </Col>
                    <Col span={4}>
                        <VehicleDropdown
                            {...register("vehicle")}
                            label="Vehicle" withIcon required
                            onChange={handleVehicleChange}
                            error={errorMessage("vehicle_id", touched, errors)}
                        />
                    </Col>
                    <Col span={12}>
                        <Textarea
                            {...register("description")}
                            label="Description" placeholder="Enter description"
                            minRows={4}
                        />
                    </Col>
                </Grid>
            </form>
        </ContentArea>
    );
};

export default NewOrEditFault;