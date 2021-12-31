import {useEffect, useState} from 'react';
import {get, last} from 'lodash';
import {useFormik} from 'formik';
import {
    ActionIcon,
    Button,
    Col,
    Divider,
    Grid,
    Group,
    NumberInput,
    Select,
    SimpleGrid,
    Switch,
    Text,
    TextInput,
    Title
} from '@mantine/core';
import {useSetState} from '@mantine/hooks';
import {useNotifications} from '@mantine/notifications';
import {CalendarIcon} from '@modulz/radix-icons';
import {MdOutlineReplay as ReloadIcon, MdOutlineSave as SaveIcon} from 'react-icons/md';

import {
    ContentArea,
    DateTimePicker,
    MemberSelect,
    ProductContractorSelect,
    ProductSelect,
    RouteMap,
    RouteSelect,
    VehicleSelect
} from 'Components';
import {useHttp} from 'Hooks';
import {Plan} from 'Shared/Models';
import {getRouteOrder, getRouteOrders, postRouteOrder, putRouteOrder} from 'Shared/Services';
import {errorMessage, getAddressLabel, getNumberRoundToOneDecimal, registerField} from 'Shared/Utilities/common.util';
import {ROUTE_PLANNER} from 'Shared/Utilities/validationSchema.util';
import VehiclePlanList from './VehiclePlanList';
import PlannedStoppagesTable from "./PlannedStoppagesTable";

const PlanningForm = ({history, location, match, ...rest}) => {
    const action = (match.params && match.params.id) ? 'Update' : 'Save';
    const {requestHandler} = useHttp();
    const notifications = useNotifications();
    const [initialValue, setInitialValue] = useState(null);
    const [vehiclePlanState, setVehiclePlanState] = useSetState({data: [], opened: false});
    const [initialStartLoadTime, toggleInitialStartLoadTime] = useState(true);
    const [routeMapState, setRouteMapState] = useSetState({route: null, activeStoppages: []});

    const register = (fieldName) => registerField(fieldName, {values, handleChange, touched, errors});

    useEffect(() => {
        if (action === 'Save') {
            let initialData = null;
            if(location.state && location.state.data) {
                initialData = new Plan(location.state.data);
                renderPlannedStoppagesOnMap(initialData);
                if (!initialData.vehicle_id) {
                    setVehiclePlanState({data: []});
                } else {
                    getPlanListForVehicle(initialData.vehicle_id).then().catch();
                }
            } else {
                initialData = new Plan();
            }
            setInitialValue({...initialData});
        } else {
            const {params: {id}} = match;
            const params = {
                include: 'vehicle,member,route,product,contractor,source_address,destination_address,' +
                    'estimated_fuel_location,route_order_stoppages,route_order_stoppages.address,' +
                    'driver_current_route'
            };
            requestHandler(getRouteOrder(id, params), {loader: true}).then(res => {
                const initialData = new Plan(res.data);
                setInitialValue(initialData);
                renderPlannedStoppagesOnMap(initialData);

                if (!initialData.vehicle_id) {
                    setVehiclePlanState({data: []})
                } else {
                    getPlanListForVehicle(initialData.vehicle_id).then().catch();
                }
            }).catch(e => {
                notifications.showNotification({
                    title: 'Error', color: 'red',
                    message: 'Not able to fetch route order details. Something went wrong!!'
                });
            });
        }
    }, []);

    const renderPlannedStoppagesOnMap = (plan) => {
        const activeStoppages = plan.getActiveStoppages();
        if (activeStoppages.length && activeStoppages.length > 1) {
            setRouteMapState({route: plan, activeStoppages});
        } else {
            plan.updateDistanceAndTime();
            setValues(plan);
        }
    };

    const calculateTimeAndDistanceForStoppages = (status, activeStoppages, plan, initialLoad) => {
        if (status === 'success') {
            if (!initialLoad) {
                let legCounter = 0, stoppageCounter = 0;
                plan.route_order_stoppages.forEach(stop => {
                    if (stoppageCounter === 0 && stop.address && !stop._destroy) {
                        stop.distance = 0;
                        stoppageCounter++;
                    } else if (stoppageCounter !== 0 && stop.address && !stop._destroy) {
                        stop.distance = getNumberRoundToOneDecimal(activeStoppages.legs[legCounter].distance.value / 1000);
                        legCounter++;
                    }
                });
                plan.updateDistanceAndTime();
            }
            setValues(plan);
        } else {
            !initialLoad && plan.updateDistanceAndTime();
            setValues(plan);
        }
    };

    const getPlanListForVehicle = (vehicleId) => new Promise(((resolve, reject) => {
        const params = {
            per_page: 100, page_no: 1, sort: 'planned_load_start_time.desc',
            include: 'vehicle,route',
            filter: {vehicle_id_eq: vehicleId, status_eq: 'not_started'}
        };
        match.params.id && (params.filter['id_not_eq'] = match.params.id);
        requestHandler(getRouteOrders(params), {loader: true}).then(res => {
            setVehiclePlanState({data: res.data});
            resolve(res.data);
        }).catch(error => {
            setVehiclePlanState({data: []});
            notifications.showNotification({
                title: 'Error', color: 'red',
                message: 'Not able to fetch plans associated with selected vehicle which are not yet started.'
            });
            reject(error);
        });
    }));

    const getProductRouteList = () => {
        const productRouteList = get(values, 'product.product_routes', []);
        return productRouteList.filter(item => {
            if (item.route_id === values.route_id && Boolean(item.contractor_id)) {
                return item;
            }
        });
    };

    const handleVehicleChange = (vehicle) => {
        const plan = new Plan(values);
        plan.setVehicle(vehicle);
        //!values.member_id && plan && plan.member && getCurrentTripInfo(plan.member_id);
        if (!vehicle) {
            setVehiclePlanState({data: []});
            setValues(plan);
        } else {
            getPlanListForVehicle(vehicle.id).then(res => {
                if (initialStartLoadTime) {
                    const lastPlanEta = res.length > 0 ? last(res).planned_eta_destination : null;
                    plan.calculatePlannedTiming(lastPlanEta);
                }
                setValues(plan);
            }).catch(e => {
                initialStartLoadTime && plan.calculatePlannedTiming(null);
                setValues(plan);
            });
        }
    };

    const handleMemberChange = (member) => {
        const plan = new Plan(values);
        plan.setMember(member);
        // plan.member_id && getCurrentTripInfo(plan.member_id);
        setValues(plan);
    };

    const handleDriverCurrentRouteChange = (route) => {
        const plan = new Plan(values);
        plan.setDriverCurrentRoute(route);
        setValues(plan);
    };

    const handleEstDistanceToDestChange = (distance) => {
        const plan = new Plan(values);
        plan.setEstimatedDistanceToDestination(distance, initialStartLoadTime);
        setValues(plan);
    };

    const handleFuelLevelChange = (fuelLevel) => {
        const plan = new Plan(values);
        plan.setCurrentFuelLevel(fuelLevel);
        setValues(plan);
    };

    const handleConsumptionRateChange = (consumptionRate) => {
        const plan = new Plan(values);
        plan.setConsumptionRate(consumptionRate);
        setValues(plan);
    };

    const handleCurrRouteEmptyLegChange = () => {
        const plan = new Plan(values);
        plan.toggleCurrentRouteEmptyLeg(initialStartLoadTime);
        setValues(plan);
    };

    const handleRouteChange = (route) => {
        toggleInitialStartLoadTime(true);
        const lastPlanEta = vehiclePlanState.data.length > 0 ? last(vehiclePlanState.data).planned_eta_destination : null;
        const plan = new Plan(values);
        plan.setRoute(route, lastPlanEta);
        renderPlannedStoppagesOnMap(plan);
    };

    const handleCycleTimeChange = (cycleTime) => {
        const plan = new Plan(values);
        plan.setPlannedCycleTime(cycleTime);
        setValues(plan);
    };

    const handleProductChange = (product) => {
        const plan = new Plan(values);
        plan.setProduct(product);
        setValues(plan);
    };

    const handleContractorChange = (contractor) => {
        const plan = new Plan(values);
        plan.setContractor(contractor);
        setValues(plan);
    };

    const handlePlannedStartTimeChange = (value) => {
        const plan = new Plan(values);
        plan.setPlannedLoadStartTime(value);
        setValues(plan);
        toggleInitialStartLoadTime(false);
    };

    const handleStartTimeReset = (event) => {
        event.stopPropagation();
        const plan = new Plan(values);
        plan.setPlannedLoadStartTime();
        setValues(plan);
        toggleInitialStartLoadTime(true);
    };

    const handleCongestionAtDestChange = (value) => {
        const plan = new Plan(values);
        plan.setCongestionAtDestination(value);
        setValues(plan);
    };

    const onSubmit = () => {
        const payload = {route_order: values};
        const requestConfig = (action === 'Save') ? postRouteOrder(payload) : putRouteOrder(match.params.id, payload);
        requestHandler(requestConfig, {loader: true}).then(res => {
            notifications.showNotification({
                title: 'Success', color: 'green', message: 'Plan has been saved successfully.'
            });
            history.push('/routePlanner/0');
        }).catch(e => {
            notifications.showNotification({
                title: 'Error', color: 'red', message: 'Not able to save plan details. Something went wrong!!'
            });
        });
    };

    const {values, touched, errors, handleChange, handleSubmit, setFieldValue, setValues} = useFormik({
        enableReinitialize: true,
        initialValues: initialValue,
        validationSchema: ROUTE_PLANNER.PLAN,
        onSubmit
    });

    return (
        <>
            <VehiclePlanList onClose={() => setVehiclePlanState({opened: false})} {...vehiclePlanState}/>

            <form onSubmit={handleSubmit}>
                {values && <ContentArea withPaper>
                    <Group position="apart" mb="md">
                        <Title order={3}>Plan</Title>
                        <Group position="apart">
                            <Button variant="default" onClick={() => history.push('/routePlanner/0')}>Cancel</Button>
                            <Button leftIcon={<SaveIcon/>} type="submit">{action}</Button>
                        </Group>
                    </Group>
                    <Divider mb="md" variant="dotted"/>

                    <Group direction="column" grow spacing="sm" mb="md">
                        <Text size="lg" weight={500}>Truck / Driver details</Text>
                        <SimpleGrid cols={3}>
                            <div>
                                <Group position="apart" mb={5}>
                                    <Text component="label" htmlFor="vehicle" size="sm" weight={500}>
                                        Truck <Text component="label" inherit color="red">*</Text>
                                    </Text>
                                    <Text
                                        variant="link"
                                        color={!values.vehicle_id ? 'dimmed' : 'blue'}
                                        onClick={() => setVehiclePlanState({opened: true})}
                                        sx={t => ({
                                            fontWeight: 500, fontSize: t.fontSizes.xs, cursor: 'pointer',
                                            pointerEvents: !values.vehicle_id ? 'none' : 'auto'
                                        })}
                                    >
                                        List of not started plans
                                    </Text>
                                </Group>
                                <VehicleSelect
                                    {...register("vehicle")}
                                    placeholder="Select truck"
                                    withIcon clearable
                                    onChange={handleVehicleChange}
                                    error={errorMessage("vehicle_id", touched, errors)}
                                />
                            </div>
                            <MemberSelect
                                {...register('member')}
                                withIcon required clearable
                                label="Driver" onChange={handleMemberChange}
                                error={errorMessage("member_id", touched, errors)}
                            />
                            <Select
                                {...register("driver_current_route")}
                                clearable data={[]}
                                label="Driver's current route"
                                placeholder="Select current route"
                                onChange={handleDriverCurrentRouteChange}
                                error={errorMessage("driver_current_route_id", touched, errors)}
                            />

                            <NumberInput
                                {...register("estimated_distance_to_destination")}
                                label="Estimated distance to destination"
                                placeholder="Enter estimated distance"
                                onChange={handleEstDistanceToDestChange}
                            />
                            <NumberInput
                                {...register("current_fuel_level")}
                                label="Current Fuel Level in Liters"
                                placeholder="Enter current fuel level"
                                onChange={handleFuelLevelChange}
                            />
                            <NumberInput
                                {...register("current_consumption_rate")}
                                precision={2} step={0.05}
                                label="Current Fuel Consumption Rate in KM/Ltr"
                                placeholder="Enter consumption rate"
                                onChange={handleConsumptionRateChange}
                            />
                            <Switch
                                id="current_route_empty_leg"
                                label="Is current trip an empty leg?"
                                checked={values.current_route_empty_leg}
                                onChange={handleCurrRouteEmptyLegChange}
                            />
                        </SimpleGrid>
                    </Group>
                    <Divider mb="md" variant="dotted"/>

                    <Group direction="column" grow spacing="sm" mb="md">
                        <Text size="lg" weight={500}>Route details</Text>
                        <SimpleGrid cols={3}>
                            <RouteSelect
                                {...register("route")}
                                withIcon required clearable
                                label="Route" onChange={handleRouteChange}
                                error={errorMessage("route_id", touched, errors)}
                            />
                            <TextInput
                                readOnly label="Origin" placeholder="Select origin"
                                value={getAddressLabel(values.route?.source_address)}
                            />
                            <TextInput
                                readOnly label="Destination" placeholder="Select destination"
                                value={getAddressLabel(values.route?.destination_address)}
                            />

                            <TextInput
                                readOnly label="Equivalent Loads"
                                placeholder="Enter equivalent loads"
                                value={values.equivalent_loads}
                            />
                            <NumberInput
                                {...register("planned_distance")}
                                type="number"
                                rightSection={<Text color="dimmed">KM</Text>}
                                disabled={!values.route_id}
                                label="Route distance in KM" placeholder="Enter distance"
                                onChange={val => setFieldValue("planned_distance", val)}
                            />
                            <NumberInput
                                {...register("planned_cycle_time")}
                                disabled={!values.route_id}
                                label="Route cycle time in hours"
                                placeholder="Enter cycle time"
                                onChange={handleCycleTimeChange}
                            />
                        </SimpleGrid>
                    </Group>
                    <Divider mb="md" variant="dotted"/>

                    <Group direction="column" grow spacing="sm" mb="md">
                        <Text size="lg" weight={500}>Product details</Text>
                        <SimpleGrid cols={3}>
                            <ProductSelect
                                {...register("product")}
                                withIcon clearable required
                                disabled={!values.route_id}
                                filter={{product_routes_route_id_eq: values.route_id}}
                                label="Product" onChange={handleProductChange}
                                error={errorMessage("product_id", touched, errors)}
                            />
                            <ProductContractorSelect
                                {...register("contractor")}
                                clearable disabled={!values.product_id}
                                routeList={getProductRouteList()} label="Contractor"
                                onChange={handleContractorChange}
                                error={errorMessage("contractor_id", touched, errors)}
                            />
                            <NumberInput
                                {...register("planned_tonnage")}
                                label="Planned tonnage"
                                placeholder="Enter tonnage"
                                onChange={val => setFieldValue("planned_tonnage", val)}
                            />
                            <NumberInput
                                {...register("rate_per_tone")}
                                label="Current rate in R/Ton" placeholder="Enter rate"
                                onChange={val => setFieldValue("rate_per_tone", val)}
                            />
                        </SimpleGrid>
                    </Group>
                    <Divider mb="md" variant="dotted"/>

                    <Grid mb="md">
                        <Col span={7}>
                            <Group direction="column" grow spacing="sm">
                                <Text size="lg" weight={500}>Planning details</Text>
                                <SimpleGrid cols={2}>
                                    <DateTimePicker
                                        {...register("planned_load_start_time")}
                                        icon={<CalendarIcon/>} disabled={!values.route_id}
                                        required rightSectionWidth={40} rightSection={
                                            <ActionIcon disabled={!values.route_id} onClick={handleStartTimeReset}>
                                                <ReloadIcon/>
                                            </ActionIcon>
                                        }
                                        label="Planned start time" placeholder="Select start time"
                                        value={
                                            values.planned_load_start_time ?
                                                new Date(values.planned_load_start_time) : null
                                        }
                                        onChange={handlePlannedStartTimeChange}
                                    />
                                    <DateTimePicker
                                        {...register("planned_eta_destination")}
                                        icon={<CalendarIcon/>} disabled={!values.route_id} required
                                        label="Planned end time" placeholder="Select end time"
                                        value={
                                            values.planned_eta_destination ?
                                                new Date(values.planned_eta_destination) : null
                                        }
                                        onChange={val => setFieldValue('planned_eta_destination', val)}
                                    />
                                    <NumberInput
                                        {...register("planned_fuel")}
                                        label="Estimated fuel (Required for trip)"
                                        placeholder="Enter fuel required for trip"
                                        onChange={val => setFieldValue("planned_fuel", val)}
                                    />
                                    <NumberInput
                                        {...register("fuel_required_for_trip")}
                                        label="Estimated fuel (Need to be filled)"
                                        placeholder="Enter fuel need to be filled"
                                        onChange={val => setFieldValue("fuel_required_for_trip", val)}
                                    />
                                    <Switch
                                        id="fuel_stop_required"
                                        label="Fuel stop required?"
                                        checked={values.fuel_stop_required}
                                        onChange={e => setFieldValue("fuel_stop_required", e.currentTarget.checked)}
                                    />
                                    <Switch
                                        id="truck_required_for_service"
                                        label="Truck service required?"
                                        checked={values.truck_required_for_service}
                                        onChange={e => setFieldValue("truck_required_for_service", e.currentTarget.checked)}
                                    />
                                    <Switch
                                        id="enroute_to_hub"
                                        label="En-route to HUB available?"
                                        checked={values.enroute_to_hub}
                                        onChange={e => setFieldValue("enroute_to_hub", e.currentTarget.checked)}
                                    />
                                    <Switch
                                        id="is_empty_leg" label="Is empty leg?" checked={values.is_empty_leg}
                                        onChange={e => setFieldValue("is_empty_leg", e.currentTarget.checked)}
                                    />
                                    <Switch
                                        id="congestion_at_destination"
                                        label="Congestion at destination?"
                                        checked={values.congestion_at_destination}
                                        onChange={e => handleCongestionAtDestChange(e.currentTarget.checked)}
                                    />
                                </SimpleGrid>
                                {values.congestion_at_destination && <SimpleGrid cols={2}>
                                    <Select
                                        {...register("congestion_severity")}
                                        label="Severity" placeholder="Select severity"
                                        clearable data={[
                                        {value: 'average', label: 'Average'},
                                        {value: 'bad', label: 'Bad'},
                                        {value: 'excessive', label: 'Excessive'}
                                    ]}
                                        onChange={val => setFieldValue("congestion_severity", val)}
                                    />
                                </SimpleGrid>}
                            </Group>
                        </Col>
                        <Col span={5}>
                            <Text size="lg" weight={500}>Planned Stoppage Map</Text>
                            <div style={{height: 'calc(100% - 30px)'}}>
                                <RouteMap {...routeMapState} onChange={calculateTimeAndDistanceForStoppages}/>
                            </div>
                        </Col>
                    </Grid>
                    <Divider mb="md" variant="dotted"/>

                    <PlannedStoppagesTable
                        data={values}
                        register={register}
                        onFieldChange={setValues}
                        onStoppageChange={renderPlannedStoppagesOnMap}
                    />
                </ContentArea>}
            </form>
        </>
    );
};

export default PlanningForm;