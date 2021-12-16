import {useEffect, useState} from 'react';
import {useFormik} from 'formik';
import {Button, Col, Divider, Grid, Group, NumberInput, Select, Textarea, TextInput, Title} from '@mantine/core';
import {DatePicker} from '@mantine/dates';
import {useNotifications} from '@mantine/notifications';
import {CalendarIcon} from '@modulz/radix-icons';
import {MdOutlineSave as SaveIcon} from 'react-icons/md';

import {ConfigFieldSelect, ContentArea, MemberSelect, TrailerSelect, TrailerSolVehicleSelect} from 'Components';
import {useHttp} from 'Hooks';
import {Truck} from 'Shared/Models';
import {getTruck, postTruck, putTruck} from 'Shared/Services';
import {errorMessage, getYearList, registerField} from 'Shared/Utilities/common.util';
import {CONFIG_FIELD_TYPE} from 'Shared/Utilities/constant';
import {PRIORITY2, VEHICLE_STATUS} from 'Shared/Utilities/referenceData.util';
import {TRUCK} from 'Shared/Utilities/validationSchema.util';

const YEAR = getYearList();

const NewOrEditTruck = ({history, location, match, ...rest}) => {
    const action = location.state.action;
    const {requestHandler} = useHttp();
    const notifications = useNotifications();
    const [initialValue, setInitialValue] = useState({});

    const register = (fieldName) => registerField(fieldName, {values, handleChange, touched, errors});

    useEffect(() => {
        if (action === 'New') {
            const initialData = new Truck();
            setInitialValue({...initialData});
        } else {
            const {params: {id}} = match;
            const include = 'vehicle_category,depo,business_unit,members';
            requestHandler(getTruck(id, {include}), {loader: true}).then(res => {
                const initialData = new Truck(res.data);
                setInitialValue({...initialData});
            }).catch(e => {
                notifications.showNotification({
                    title: "Error", color: 'red', message: 'Not able to fetch truck details. Something went wrong!!'
                });
            });
        }
    }, []);

    const handleTrailerSolVehicleChange = (trailerSolVehicle) => {
        const truck = new Truck(values);
        truck.setTrailerSolVehicle(trailerSolVehicle);
        setValues(truck);
    };

    const handleCategoryChange = (category) => {
        const truck = new Truck(values);
        truck.setCategory(category);
        setValues(truck);
    };

    const handleDepoChange = (depo) => {
        const truck = new Truck(values);
        truck.setDepo(depo);
        setValues(truck);
    };

    const handleBusinessUnitChange = (businessUnit) => {
        const truck = new Truck(values);
        truck.setBusinessUnit(businessUnit);
        setValues(truck);
    };

    const handleMemberListChange = (members) => {
        const truck = new Truck(values);
        truck.updateMembers(members);
        setValues(truck);
    };

    const handleTrailerListChange = (trailers) => {
        const truck = new Truck(values);
        truck.updateTrailer(trailers);
        setValues(truck);
    };

    const onSubmit = () => {
        const requestConfig = (action === 'New') ? postTruck({vehicle: values}) : putTruck(match.params.id, {vehicle: values});
        requestHandler(requestConfig, {loader: true}).then(res => {
            notifications.showNotification({
                title: "Success", color: 'green', message: 'Truck has been saved successfully.'
            });
            history.push('/Vehicle', {tabIndex: 0});
        }).catch(e => {
            notifications.showNotification({
                title: "Error", color: 'red', message: 'Not able to save truck details. Something went wrong!!'
            });
        });
    };

    const {values, touched, errors, handleChange, handleSubmit, setValues, setFieldValue} = useFormik({
        enableReinitialize: true,
        initialValues: initialValue,
        validationSchema: TRUCK,
        onSubmit
    });

    return (
        <ContentArea withPaper>
            <form onSubmit={handleSubmit}>
                <Group position="apart" mb="md">
                    <Title order={3}>Truck</Title>
                    <Group position="apart">
                        <Button variant="default" onClick={() => history.push('/Vehicle', {tabIndex: 0})}>
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
                            label="Truck name"
                            placeholder="Enter name"
                            required
                        />
                    </Col>
                    <Col span={4}>
                        <TrailerSolVehicleSelect
                            {...register("trailersol_vehicle")}
                            searchable={false}
                            clearable
                            label="TrailerSol Vehicle"
                            onChange={handleTrailerSolVehicleChange}
                            error={errorMessage("trailersol_vehicle_id", touched, errors)}
                        />
                    </Col>
                    <Col span={4}/>

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
                        <ConfigFieldSelect
                            {...register("vehicle_category")}
                            label="Category"
                            fieldType={CONFIG_FIELD_TYPE.VEHICLE_CATEGORY}
                            onChange={handleCategoryChange}
                            error={errorMessage("vehicle_category_id", touched, errors)}
                        />
                    </Col>
                    <Col span={4}>
                        <TextInput
                            {...register("manufacture")}
                            label="Manufacture" placeholder="Enter manufacture"
                        />
                    </Col>

                    <Col span={4}>
                        <NumberInput
                            {...register("trailersol_meter_reading")}
                            label="Meter Reading (Telenatics) in KM" min={0}
                            placeholder="Enter telenatics meter reading"
                            onChange={val => setFieldValue("trailersol_meter_reading", val)}
                        />
                    </Col>
                    <Col span={4}>
                        <TextInput
                            {...register("capacity")}
                            label="Tank capacity" placeholder="Enter tank capacity"
                        />
                    </Col>
                    <Col span={4}>
                        <TextInput
                            {...register("chassis_number")}
                            label="Chassis number" placeholder="Enter chassis number"
                        />
                    </Col>

                    <Col span={4}>
                        <Select
                            {...register("year")}
                            required clearable
                            data={YEAR} label="Year"
                            placeholder="Select year"
                            onChange={val => setFieldValue("year", val)}
                        />
                    </Col>
                    <Col span={4}>
                        <TextInput
                            {...register("license_number")}
                            label="License plate" placeholder="Enter license plate"
                        />
                    </Col>
                    <Col span={4}>
                        <NumberInput
                            {...register("asset_value")}
                            label="Purchase price" min={0}
                            placeholder="Enter price"
                            icon={"R"}
                            onChange={val => setFieldValue("asset_value", val)}
                        />
                    </Col>

                    <Col span={4}>
                        <DatePicker
                            {...register("purchase_date")}
                            icon={<CalendarIcon/>}
                            label="Purchase date"
                            placeholder="Select purchase date"
                            value={values.purchase_date ? new Date(values.purchase_date) : null}
                            onChange={val => setFieldValue("purchase_date", val)}
                        />
                    </Col>
                    <Col span={4}>
                        <TextInput
                            {...register("last_service_reading")}
                            label="Last service reading"
                            placeholder="Enter last service reading"
                        />
                    </Col>
                    <Col span={4}>
                        <DatePicker
                            {...register("last_service_date")}
                            icon={<CalendarIcon/>}
                            label="Last service date"
                            placeholder="Select last service date"
                            value={values.last_service_date ? new Date(values.last_service_date) : null}
                            onChange={val => setFieldValue("last_service_date", val)}
                        />
                    </Col>

                    <Col span={4}>
                        <TextInput
                            {...register("registration_state")}
                            label="Registration province"
                            placeholder="Enter registration province"
                        />
                    </Col>
                    <Col span={4}>
                        <ConfigFieldSelect
                            {...register("depo")}
                            label="Depo"
                            fieldType={CONFIG_FIELD_TYPE.VEHICLE_DEPO}
                            onChange={handleDepoChange}
                            error={errorMessage("depo_id", touched, errors)}
                        />
                    </Col>
                    <Col span={4}>
                        <ConfigFieldSelect
                            {...register("business_unit")}
                            label="Business unit"
                            fieldType={CONFIG_FIELD_TYPE.BUSINESS_UNIT}
                            onChange={handleBusinessUnitChange}
                            error={errorMessage("business_unit_id", touched, errors)}
                        />
                    </Col>

                    <Col span={4}>
                        <NumberInput
                            {...register("current_book_value")}
                            min={0} icon={"R"}
                            label="Price" placeholder="Enter price"
                            onChange={val => setFieldValue("current_book_value", val)}
                        />
                    </Col>
                    <Col span={4}>
                        <DatePicker
                            {...register("warranty_start_date")}
                            icon={<CalendarIcon/>}
                            label="Warranty start date"
                            placeholder="Select warranty start date"
                            value={values.warranty_start_date ? new Date(values.warranty_start_date) : null}
                            onChange={val => setFieldValue("warranty_start_date", val)}
                        />
                    </Col>
                    <Col span={4}>
                        <DatePicker
                            {...register("warranty_end_date")}
                            icon={<CalendarIcon/>}
                            label="Warranty end date"
                            placeholder="Select warranty end date"
                            value={values.warranty_end_date ? new Date(values.warranty_end_date) : null}
                            onChange={val => setFieldValue("warranty_end_date", val)}
                        />
                    </Col>

                    <Col span={4}>
                        <TextInput
                            {...register("operator_name")}
                            label="From member" placeholder="Enter member name"
                        />
                    </Col>
                    <Col span={4}>
                        <Select
                            {...register("maintainence_priority")}
                            clearable data={PRIORITY2}
                            label="Maintenance priority"
                            placeholder="Select maintenance priority"
                            onChange={val => setFieldValue("maintainence_priority", val)}
                        />
                    </Col>
                    <Col span={4}>
                        <MemberSelect
                            {...register("members")}
                            isMulti
                            label="Drivers"
                            onChange={handleMemberListChange}
                            error={errorMessage("member_ids", touched, errors)}
                        />
                    </Col>
                    <Col span={4}>
                        <TrailerSelect
                            {...register("trailer")}
                            isMulti
                            label="Trailer"
                            onChange={handleTrailerListChange}
                            error={errorMessage("trailer_id", touched, errors)}
                        />
                    </Col>

                    <Col span={12}>
                        <Textarea
                            {...register("note")}
                            label="Note" placeholder="Enter note"
                            minRows={4}
                        />
                    </Col>
                </Grid>
            </form>
        </ContentArea>
    );
};

export default NewOrEditTruck;