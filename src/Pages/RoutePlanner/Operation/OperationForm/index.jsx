import {useEffect, useState} from 'react';
import {useFormik} from 'formik';
import {
    Box,
    Button,
    Checkbox,
    Divider,
    Group,
    NumberInput,
    Select,
    SimpleGrid,
    Text,
    TextInput,
    Title
} from '@mantine/core';
import {useSetState} from '@mantine/hooks';
import {useNotifications} from '@mantine/notifications';
import {CalendarIcon} from '@modulz/radix-icons';
import {MdOutlineSave as SaveIcon} from 'react-icons/md';

import {AddressSelect, ContentArea, DateTimePicker, RouteMap} from 'Components';
import {useHttp} from 'Hooks';
import {getRouteOrder, putRouteOrder} from 'Shared/Services';
import {Operation} from 'Shared/Models';
import {ROUTE_PLANNER} from 'Shared/Utilities/validationSchema.util';
import {errorMessage, getNumberRoundToOneDecimal, registerField} from 'Shared/Utilities/common.util';
import {POD_STATUS, POD_STATUS_EMPTY_LEG} from 'Shared/Utilities/referenceData.util';
import UploadOperationSlips from './UploadOperationSlips';
import PlannedStoppagesTable from './PlannedStoppagesTable';
import RouteOrderDetails from './RouteOrderDetails';
import ActualStoppagesTable from "./ActualStoppagesTable";

const podStatusList = (isEmptyLeg) => isEmptyLeg ? POD_STATUS_EMPTY_LEG : POD_STATUS;

const OperationForm = ({history, match, ...rest}) => {
    const {requestHandler} = useHttp();
    const notifications = useNotifications();
    const [initialValue, setInitialValue] = useState(null);
    const [plannedStoppages, setPlannedStoppages] = useState([]);
    const [actualStoppageMapState, setActualStoppageMapState] = useSetState({
        route: null, activeStoppages: [], initialLoad: false
    });

    const register = (fieldName) => registerField(fieldName, {values, handleChange, touched, errors});

    useEffect(() => {
        const {params: {id}} = match;
        const params = {
            include: 'member,vehicle,estimated_fuel_location,route_order_stoppages,route_order_stoppages.address,' +
                'route_order_actual_info,route_order_actual_info.route_order_actual_stop_infos,' +
                'route_order_actual_info.route_order_actual_stop_infos.address,' +
                'route_order_actual_info.loading_slips,route_order_actual_info.offloading_slips,' +
                'route_order_actual_info.fuel_slips,route_order_actual_info.toll_slips,' +
                'route_order_actual_info.truck_wash_slips,route_order_actual_info.pod_slips,' +
                'route_order_actual_info.truck_stop_slips'
        };
        requestHandler(getRouteOrder(id, params), {loader: true}).then(res => {
            const initialData = new Operation(res.data);
            setInitialValue(initialData);
            renderPlannedStoppagesOnMap(res.data.route_order_stoppages);
            renderActualStoppagesOnMap(initialData, true);
        }).catch(e => {
            notifications.showNotification({
                title: 'Error', color: 'red', message: 'Not able to fetch route order details. Something went wrong!!'
            });
        });
    }, []);

    const renderPlannedStoppagesOnMap = (stoppages) => {
        const activeStoppages = stoppages.filter(stop => !stop._destroy);
        if (activeStoppages.length && activeStoppages.length > 1) {
            setPlannedStoppages(activeStoppages);
        }
    };

    const renderActualStoppagesOnMap = (operation, initialLoad) => {
        const actualInfo = operation ? operation.route_order_actual_info : null;
        const activeStoppages = actualInfo ? actualInfo.getActiveStoppages() : [];

        if (activeStoppages.length && activeStoppages.length > 1) {
            setActualStoppageMapState({route: operation, activeStoppages, initialLoad});
        } else {
            !initialLoad && operation.route_order_actual_info.updateDistanceAndTime();
            setValues(operation);
        }
    };

    const calculateTimeAndDistanceForActualStoppages = (status, activeStoppages, operation, initialLoad) => {
        if (status === 'success') {
            if (!initialLoad) {
                let legCounter = 0, stoppageCounter = 0;
                operation.route_order_actual_info.route_order_actual_stop_infos.forEach(stop => {
                    if (stoppageCounter === 0 && stop.address && !stop._destroy) {
                        stop.distance = 0;
                        stoppageCounter++;
                    } else if (stoppageCounter !== 0 && stop.address && !stop._destroy) {
                        stop.distance = getNumberRoundToOneDecimal(activeStoppages.legs[legCounter].distance.value / 1000);
                        legCounter++;
                    }
                });
                operation.route_order_actual_info.updateDistanceAndTime();
            }
            setValues(operation);
        } else {
            !initialLoad && operation.route_order_actual_info.updateDistanceAndTime();
            setValues(operation);
        }
    };

    const handleFuelPointChange = (fuelPoint) => {
        const operation = new Operation(values);
        operation.route_order_actual_info.setFuelPoint(fuelPoint);
        setValues(operation);
    };

    const handleTonnageLoadedChange = (tonnage) => {
        const operation = new Operation(values);
        operation.setTonnageLoaded(tonnage);
        setValues(operation);
    };

    const handleRatePerToneChange = (ratePerTone) => {
        const operation = new Operation(values);
        operation.setRatePerTone(ratePerTone);
        setValues(operation);
    };

    const onSubmit = () => {
        requestHandler(putRouteOrder(match.params.id, {route_order: values}), {loader: true}).then(res => {
            notifications.showNotification({
                title: 'Success', color: 'green', message: 'Operation has been saved successfully.'
            });
            history.goBack();
        }).catch(e => {
            notifications.showNotification({
                title: 'Error', color: 'red', message: 'Not able to save operation details. Something went wrong!!'
            });
        });
    };

    const {values, touched, errors, handleChange, handleSubmit, setFieldValue, setValues} = useFormik({
        enableReinitialize: true,
        initialValues: initialValue,
        validationSchema: ROUTE_PLANNER.OPERATION,
        onSubmit
    });

    return (
        <ContentArea withPaper={!!values}>
            {values && <form onSubmit={handleSubmit}>
                <Group position="apart" mb="md">
                    <Title order={3}>Operation</Title>
                    <Group position="apart">
                        <Button variant="default" onClick={() => history.goBack()}>Cancel</Button>
                        <Button leftIcon={<SaveIcon/>} type="submit">Update</Button>
                    </Group>
                </Group>
                <Divider mb="md" variant="dotted"/>

                <RouteOrderDetails data={values}/>
                <Divider mb="md" variant="dotted"/>

                <Box mb="md">
                    <SimpleGrid cols={3} mb="xl">
                        <DateTimePicker
                            {...register("route_order_actual_info.start_time")}
                            icon={<CalendarIcon/>} required
                            label="Actual start time"
                            placeholder="Select actual start time"
                            value={
                                (values.route_order_actual_info && values.route_order_actual_info.start_time) ?
                                    new Date(values.route_order_actual_info?.start_time) : null
                            }
                            onChange={val => setFieldValue("route_order_actual_info.start_time", val)}
                        />
                        <DateTimePicker
                            {...register("route_order_actual_info.end_time")}
                            icon={<CalendarIcon/>} required
                            label="Actual end time"
                            placeholder="Select actual end time"
                            value={
                                (values.route_order_actual_info && values.route_order_actual_info.end_time) ?
                                    new Date(values.route_order_actual_info?.end_time) : null
                            }
                            onChange={val => setFieldValue("route_order_actual_info.end_time", val)}
                        />
                        <NumberInput
                            {...register("route_order_actual_info.distance")}
                            label="Actual distance in KM" min={0}
                            placeholder="Enter actual distance"
                            onChange={val => setFieldValue("route_order_actual_info.distance", val)}
                        />

                        <NumberInput
                            {...register("route_order_actual_info.cycle_time")}
                            label="Actual cycle time in Hours" min={0}
                            placeholder="Enter actual cycle time"
                            onChange={val => setFieldValue("route_order_actual_info.cycle_time", val)}
                        />
                        <NumberInput
                            {...register("route_order_actual_info.fuel_liters_filled")}
                            label="Actual fuel filled in Litres" min={0}
                            placeholder="Enter actual fuel filled"
                            onChange={val => setFieldValue("route_order_actual_info.fuel_liters_filled", val)}
                        />
                        <NumberInput
                            {...register("route_order_actual_info.tonnage_loaded")}
                            label="Actual tonnage loaded" min={0}
                            placeholder="Enter actual tonnage loaded"
                            onChange={handleTonnageLoadedChange}
                        />

                        <AddressSelect
                            {...register("route_order_actual_info.fuel_point_id")}
                            label="Actual fuel point" withIcon required
                            value={values.route_order_actual_info.fuel_point}
                            onChange={handleFuelPointChange}
                            error={errorMessage("route_order_actual_info.fuel_point_id", touched, errors)}
                        />
                        <NumberInput
                            {...register("loading_odo_km")}
                            label="Loading KM" min={0}
                            placeholder="Enter loading km"
                            onChange={val => setFieldValue("loading_odo_km", val)}
                        />
                        <NumberInput
                            {...register("offloading_odo_km")}
                            label="Off Loading KM" min={0}
                            placeholder="Enter off loading km"
                            onChange={val => setFieldValue("offloading_odo_km", val)}
                        />

                        <TextInput
                            {...register("route_order_actual_info.delivery_note_number")}
                            label="Delivery note #" placeholder="Enter delivery note #"
                        />
                        <TextInput
                            {...register("route_order_actual_info.pod_number")}
                            label="POD #" placeholder="Enter POD #"
                        />
                        <Select
                            {...register("pod_status")}
                            label="POD status"
                            placeholder="Select POD status"
                            data={podStatusList(values.is_empty_leg)}
                            onChange={val => setFieldValue("pod_status", val)}
                        />

                        <NumberInput
                            {...register("rate_per_tone")}
                            label="Rate" min={0}
                            placeholder="Enter rate"
                            onChange={handleRatePerToneChange}
                        />
                        <NumberInput
                            {...register("actual_amount")}
                            min={0} icon={"R"} disabled
                            label="Actual value" placeholder="Enter actual value"
                            onChange={val => setFieldValue("actual_amount", val)}
                        />
                    </SimpleGrid>
                    <Checkbox
                        label="Is documents received physically from driver?"
                        checked={values.route_order_actual_info.document_recieved}
                        onChange={() => {
                            setFieldValue(
                                'route_order_actual_info.document_recieved',
                                !values.route_order_actual_info.document_recieved
                            )
                        }}
                    />
                </Box>
                <Divider mb="md" variant="dotted"/>

                <UploadOperationSlips data={values} onChange={setValues}/>
                <Divider mb="md" variant="dotted"/>

                <PlannedStoppagesTable data={plannedStoppages}/>
                <Divider mb="md" variant="dotted"/>

                <SimpleGrid cols={2} mb="md">
                    <Group direction="column" grow spacing="sm">
                        <Text size="lg" weight={500}>Planned Stoppage Map</Text>
                        <Box style={{height: 350}}>
                            <RouteMap id="planned-stoppage-map" activeStoppages={plannedStoppages}/>
                        </Box>
                    </Group>
                    <Group direction="column" grow spacing="sm">
                        <Text size="lg" weight={500}>Actual Stoppage Map</Text>
                        <Box style={{height: 350}}>
                            <RouteMap
                                id="actual-stoppage-map"
                                {...actualStoppageMapState}
                                onChange={calculateTimeAndDistanceForActualStoppages}
                            />
                        </Box>
                    </Group>
                </SimpleGrid>
                <Divider mb="md" variant="dotted"/>

                <ActualStoppagesTable
                    data={values}
                    register={register}
                    onFieldChange={setValues}
                    onStoppageChange={renderActualStoppagesOnMap}
                />
            </form>}
        </ContentArea>
    );
};

export default OperationForm;