import {useEffect, useState} from 'react';
import {useFormik} from 'formik';
import {Button, Col, Divider, Grid, Group, NumberInput, Select, TextInput, Title} from '@mantine/core';
import {DatePicker} from '@mantine/dates';
import {useNotifications} from '@mantine/notifications';
import {CalendarIcon} from '@modulz/radix-icons';
import {MdOutlineSave as SaveIcon} from 'react-icons/md';

import {ConfigFieldDropdown, ContentArea} from 'Components';
import {useHttp} from 'Hooks';
import {Trailer} from 'Shared/Models';
import {getTrailer, postTrailer, putTrailer} from 'Shared/Services';
import {errorMessage, registerField} from 'Shared/Utilities/common.util';
import {CONFIG_FIELD_TYPE} from 'Shared/Utilities/constant';
import {VEHICLE_STATUS} from 'Shared/Utilities/referenceData.util';
import {TRAILER} from 'Shared/Utilities/validationSchema.util';

const NewOrEditTrailer = ({history, location, match, ...rest}) => {
    const action = location.state.action;
    const {requestHandler} = useHttp();
    const notifications = useNotifications();
    const [initialValue, setInitialValue] = useState({});

    const register = (fieldName) => registerField(fieldName, {values, handleChange, touched, errors});

    useEffect(() => {
        if (action === 'New') {
            const trailer = new Trailer();
            setInitialValue({...trailer});
        } else {
            const {params: {id}} = match;
            requestHandler(getTrailer(id, {include: 'trailer_category'}), {loader: true}).then(res => {
                const trailer = new Trailer(res.data);
                setInitialValue(trailer);
            }).catch(e => {
                notifications.showNotification({
                    title: "Error", color: 'red', message: 'Not able to fetch trailer details. Something went wrong!!'
                });
            });
        }
    }, []);

    const handleCategoryChange = (category) => {
        const trailer = new Trailer(values);
        trailer.setCategory(category);
        setValues(trailer);
    };

    const onSubmit = () => {
        const requestConfig = (action === 'New') ? postTrailer({trailer: values}) : putTrailer(match.params.id, {trailer: values});
        requestHandler(requestConfig, {loader: true}).then(res => {
            notifications.showNotification({
                title: "Success", color: 'green', message: 'Trailer has been saved successfully.'
            });
            history.push('/Vehicle', {tabIndex: 1});
        }).catch(e => {
            notifications.showNotification({
                title: "Error", color: 'red', message: 'Not able to save trailer details. Something went wrong!!'
            });
        });
    };

    const {values, touched, errors, handleChange, handleSubmit, setValues, setFieldValue} = useFormik({
        enableReinitialize: true,
        initialValues: initialValue,
        validationSchema: TRAILER,
        onSubmit
    });

    return (
        <ContentArea withPaper>
            <form onSubmit={handleSubmit}>
                <Group position="apart" mb="md">
                    <Title order={3}>Trailer</Title>
                    <Group position="apart">
                        <Button variant="default" onClick={() => history.push('/Vehicle', {tabIndex: 1})}>
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
                        <TextInput
                            {...register("name")}
                            label="Trailer name"
                            placeholder="Enter name"
                            required
                        />
                    </Col>
                    <Col span={8}/>
                    <Col span={4}>
                        <TextInput
                            {...register("vin_number")}
                            label="VIN number"
                            placeholder="Enter vin number"
                            required
                        />
                    </Col>
                    <Col span={4}>
                        <TextInput
                            {...register("model")}
                            label="Model"
                            placeholder="Enter model"
                            required
                        />
                    </Col>
                    <Col span={4}>
                        <Select
                            {...register("status")}
                            data={VEHICLE_STATUS}
                            label="Status"
                            placeholder="Select status"
                            required clearable
                            onChange={val => setFieldValue("status", val)}
                        />
                    </Col>

                    <Col span={4}>
                        <NumberInput
                            {...register("meter_reading")}
                            label="Meter Reading in KM" min={0}
                            placeholder="Enter meter reading"
                            onChange={val => setFieldValue("meter_reading", val)}
                        />
                    </Col>
                    <Col span={4}>
                        <ConfigFieldDropdown
                            {...register("trailer_category")}
                            label="Category"
                            fieldType={CONFIG_FIELD_TYPE.TRAILER_CATEGORY}
                            onChange={handleCategoryChange}
                            error={errorMessage("category_id", touched, errors)}
                        />
                    </Col>
                    <Col span={4}>
                        <DatePicker
                            {...register("license_expiry")}
                            icon={<CalendarIcon/>}
                            label="License expiry"
                            placeholder="Select license expiry date"
                            value={values.license_expiry ? new Date(values.license_expiry) : null}
                            onChange={val => setFieldValue("license_expiry", val)}
                        />
                    </Col>
                </Grid>
            </form>
        </ContentArea>
    );
};

export default NewOrEditTrailer;