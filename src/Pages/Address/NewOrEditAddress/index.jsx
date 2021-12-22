import {useEffect, useState} from 'react';
import get from 'lodash/get';
import {useFormik} from 'formik';
import {
    Button,
    Col,
    Divider,
    Grid,
    Group,
    NumberInput,
    Radio,
    RadioGroup,
    Select,
    TextInput,
    Title
} from '@mantine/core';
import {useNotifications} from '@mantine/notifications';
import {MdOutlineSave as SaveIcon} from 'react-icons/md';

import {AddressMap, ContentArea, GoogleMapAutocomplete} from 'Components';
import {useHttp} from 'Hooks';
import {getAddress, postAddress, putAddress} from 'Shared/Services';
import {Address} from 'Shared/Models';
import {errorMessage} from 'Shared/Utilities/common.util';
import {ADDRESS} from 'Shared/Utilities/validationSchema.util';
import {ADDRESS_TYPE} from 'Shared/Utilities/referenceData.util';

const NewOrEditAddress = ({history, location, match, ...rest}) => {
    const action = (match.params && match.params.id) ? 'Edit' : 'New';
    const {requestHandler} = useHttp();
    const notifications = useNotifications();
    const [initialValue, setInitialValue] = useState({});
    const [coordinates, setCoordinates] = useState(null);
    const [closeMap, toggleCloseMap] = useState(false);

    const register = (fieldName) => ({
        id: fieldName,
        value: get(values, fieldName),
        onChange: handleChange,
        error: errorMessage(fieldName, touched, errors)
    });

    useEffect(() => {
        if (action === 'New') {
            const address = new Address();
            setInitialValue({...address});
        } else {
            const {params} = match;
            requestHandler(getAddress(params.id), {loader: true}).then(res => {
                const address = new Address(res.data);
                setInitialValue(address);
            }).catch(e => {
                notifications.showNotification({
                    title: "Error", color: 'red', message: 'Not able to fetch address details. Something went wrong!!'
                });
            });
        }
    }, []);

    useEffect(() => {
        if (coordinates) {
            const address = new Address({...values, ...coordinates});
            address.drawing_type === 'polygon' && address.setGeofence();
            setValues(address);
        }
    }, [coordinates]);

    const handleGoogleMapSelection = (googleMapResult) => {
        const address = new Address(values);
        address.setAddress(googleMapResult.data.results[0]);
        setValues(address);
    };

    const handleMarkerChange = (latLng) => setCoordinates({...latLng});

    const handleDrawingTypeChange = (val) => {
        const address = new Address(values);
        address.setDrawingType(val);
        setValues(address);
    };

    const handleConfirm = (geofence) => {
        toggleCloseMap(false);
        const payload = {address: {...values, geofence}};
        const requestConfig = (action === 'New') ? postAddress(payload) : putAddress(values.id, payload);
        requestHandler(requestConfig, {loader: true}).then(res => {
            notifications.showNotification({
                title: "Success", color: 'green', message: 'Address has been saved successfully.'
            });
            history.push('/Address');
        }).catch(e => {
            notifications.showNotification({
                title: "Error", color: 'red', message: 'Not able to save address. Something went wrong!!'
            });
        });
    };

    const {values, touched, errors, handleChange, handleSubmit, setValues, setFieldValue} = useFormik({
        enableReinitialize: true,
        initialValues: initialValue,
        validationSchema: ADDRESS,
        onSubmit: () => toggleCloseMap(true)
    });

    return (
        <ContentArea withPaper>
            <form onSubmit={handleSubmit}>
                <Group position="apart" mb="md">
                    <Title order={3}>Address</Title>
                    <Group position="apart">
                        <Button variant="default" onClick={() => history.push('/Address')}>
                            Cancel
                        </Button>
                        <Button leftIcon={<SaveIcon/>} type="submit">
                            {action === 'New' ? 'Save' : 'Update'}
                        </Button>
                    </Group>
                </Group>
                <Divider mb="md" variant="dotted"/>

                <GoogleMapAutocomplete
                    mb="md" radius="xl"
                    placeholder="Google map search for address"
                    onChange={handleGoogleMapSelection}
                />
                <Grid>
                    <Col span={6}>
                        <AddressMap
                            address={values}
                            isClosing={closeMap}
                            onClose={handleConfirm}
                            onMarkerChange={handleMarkerChange}
                        />
                    </Col>

                    <Col span={6}>
                        <Grid>
                            <Col span={6}>
                                <TextInput
                                    {...register("name")}
                                    label="Address name"
                                    placeholder="Enter address name"
                                    required
                                />
                            </Col>
                            <Col span={6}>
                                <Select
                                    {...register("address_type")}
                                    data={ADDRESS_TYPE}
                                    label="Address type"
                                    placeholder="Select address type"
                                    required clearable
                                    onChange={val => setFieldValue("address_type", val)}
                                />
                            </Col>
                            <Col span={12}>
                                <TextInput
                                    {...register("address1")}
                                    label="Address line 1"
                                    placeholder="Enter address line 1"
                                    required
                                />
                            </Col>
                            <Col span={12}>
                                <TextInput
                                    {...register("address2")}
                                    label="Address line 2"
                                    placeholder="Enter address line 2"
                                />
                            </Col>
                            <Col span={6}>
                                <TextInput {...register("city")} label="City" placeholder="Enter city"/>
                            </Col>
                            <Col span={6}>
                                <TextInput {...register("state")} label="State" placeholder="Enter state"/>
                            </Col>
                            <Col span={6}>
                                <TextInput {...register("country")} label="Country" placeholder="Enter country"/>
                            </Col>
                            <Col span={6}>
                                <TextInput {...register("zipcode")} label="Zipcode" placeholder="Enter zipcode"/>
                            </Col>
                            <Col span={6}>
                                <TextInput {...register("phone")} label="Phone No." placeholder="Enter phone no."/>
                            </Col>
                            <Col span={6}>
                                <RadioGroup
                                    {...register("drawing_type")}
                                    size="sm" label="Drawing type"
                                    onChange={handleDrawingTypeChange}
                                >
                                    <Radio value="polygon">Polygon</Radio>
                                    <Radio value="circle">Circle</Radio>
                                </RadioGroup>
                            </Col>
                            {values.drawing_type === "circle" && <Col span={6}>
                                <NumberInput
                                    {...register("radius")}
                                    label="Circle radius in meters"
                                    placeholder="Enter circle radius"
                                    min={1} onChange={val => setFieldValue("radius", val)}
                                />
                            </Col>}
                        </Grid>
                    </Col>
                </Grid>
            </form>
        </ContentArea>
    );
};

export default NewOrEditAddress;