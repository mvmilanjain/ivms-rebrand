import {useEffect, useState} from 'react';
import get from 'lodash/get';
import {useFormik} from 'formik';
import {ActionIcon, Button, Col, Divider, Grid, Group, NumberInput, SimpleGrid, TextInput, Title, Text} from '@mantine/core';
import {useSetState} from '@mantine/hooks';
import {useNotifications} from '@mantine/notifications';
import {useModals} from '@mantine/modals';
import {
    MdArrowDownward as MoveDownIcon,
    MdArrowUpward as MoveUpIcon,
    MdDeleteOutline as DeleteIcon,
    MdOutlineAddLocationAlt as AddStopIcon,
    MdOutlineSave as SaveIcon,
} from 'react-icons/md';

import {AddressSelect, ContentArea, ReactTable, RouteMap} from 'Components';
import {useHttp} from 'Hooks';
import {Route} from 'Shared/Models';
import {ROUTE} from 'Shared/Utilities/validationSchema.util';
import {errorMessage, registerField} from 'Shared/Utilities/common.util';
import {getRoute, postRoute, putRoute} from 'Shared/Services';
import AddStoppageForm from './AddStoppageForm';

const CreateOrUpdateRoute = ({history, location, match, ...rest}) => {
    const action = (match.params && match.params.id) ? 'Edit' : 'New';
    const {requestHandler} = useHttp();
    const notifications = useNotifications();
    const modals = useModals();
    const [initialValue, setInitialValue] = useState({});
    const [routeMapState, setRouteMapState] = useSetState({
        route: null, activeStoppages: [], initialLoad: false
    });

    const register = (fieldName) => registerField(fieldName, {values, handleChange, touched, errors});

    useEffect(() => {
        if (action === 'New') {
            const route = new Route();
            setInitialValue({...route});
        } else {
            const {params} = match;
            requestHandler(getRoute(params.id), {loader: true}).then(res => {
                const route = new Route(res.data);
                setInitialValue(route);
                renderActiveRouteOnMap(route, true);
            }).catch(e => {
                console.error(e);
                notifications.showNotification({
                    title: "Error", color: 'red', message: 'Not able to fetch route details. Something went wrong!!'
                });
            });
        }
    }, []);

    const renderStoppageRowAction = ({row}) => {
        const {index, original: stop} = row;
        const activeRouteStop = values.route_planner.route_stops.filter(stop => !stop._destroy);
        const isSource = (values.source && values.source === stop.address_id && index === 0);
        const isDestination = (values.destination && values.destination === stop.address_id && index === activeRouteStop.length - 1);

        return (isSource || isDestination) ? null : <Group spacing={0}>
            <ActionIcon color="red" onClick={() => handleDeleteStoppage(index)}><DeleteIcon size={20}/></ActionIcon>
            <ActionIcon onClick={() => handleMoveStoppage(index, 'UP')} disabled={index === 0 ||
                (index === 1 && values.source && activeRouteStop[0].address_id === values.source)
            }>
                <MoveUpIcon size={20}/>
            </ActionIcon>
            <ActionIcon onClick={() => handleMoveStoppage(index, 'DOWN')} disabled={
                (index === activeRouteStop.length - 1) || (
                    index === activeRouteStop.length - 2 && values.destination &&
                    activeRouteStop[activeRouteStop.length - 1].address_id === values.destination
                )
            }>
                <MoveDownIcon size={20}/>
            </ActionIcon>
        </Group>;
    };

    const renderActiveRouteOnMap = (route, initialLoad) => {
        const activeRouteStops = route.getActiveRouteStops();
        if (activeRouteStops.length === 1) {
            route.route_planner.route_stops.forEach(stop => !stop._destroy && (stop.distance = 0));
            !initialLoad && route.updateTotalDistanceAndCycleTime();
            setValues({...route});
        } else if (activeRouteStops.length > 1) {
            setRouteMapState({route, activeStoppages: activeRouteStops, initialLoad});
        } else {
            !initialLoad && route.updateTotalDistanceAndCycleTime();
            setValues({...route});
        }
    };

    const calculateTimeAndDistanceForRoute = (status, activeStoppages, route, initialLoad) => {
        if (status === 'success') {
            let legCounter = 0, routeStopCounter = 0;
            route.route_planner.route_stops.forEach(stop => {
                if (routeStopCounter === 0 && stop.address && !stop._destroy) {
                    stop.distance = 0;
                    routeStopCounter++;
                } else if (routeStopCounter !== 0 && stop.address && !stop._destroy) {
                    stop.distance = Math.round(activeStoppages.legs[legCounter].distance.value / 1000);
                    legCounter++;
                }
            });
            !initialLoad && route.updateTotalDistanceAndCycleTime();
            setValues({...route});
        } else {
            !initialLoad && route.updateTotalDistanceAndCycleTime();
            setValues({...route});
        }
    };

    const handleSourceChange = (address) => {
        const route = new Route(values);
        route.setSource(address);
        renderActiveRouteOnMap(route);
    };

    const handleDestinationChange = (address) => {
        const route = new Route(values);
        route.setDestination(address);
        renderActiveRouteOnMap(route);
    };

    const handleLoadingTimeChange = (loadingTime) => {
        const route = new Route(values);
        route.setLoadingTime(loadingTime);
        setValues(route);
    };

    const handleAddStoppage = () => {
        const id = modals.openModal({
            title: 'Add Stoppage',
            children: <AddStoppageForm
                onConfirm={(stoppage) => {
                    modals.closeModal(id);
                    const route = new Route(values);
                    route.addRouteStop(stoppage);
                    renderActiveRouteOnMap(route);
                }}
            />
        });
    };

    const isRouteStopAddressDisabled = (index, stop) => {
        const activeRouteStop = values.route_planner.route_stops.filter(stop => !stop._destroy);
        const isSource = (values.source && values.source === stop.address_id && index === 0);
        const isDestination = (values.destination && values.destination === stop.address_id && index === activeRouteStop.length - 1);
        return isSource || isDestination;
    };

    const isRouteStopDistanceDisabled = (index, stop) => (values.source && values.source === stop.address_id && index === 0);

    const handleRouteStopAddressChange = (address, index) => {
        const route = new Route(values);
        route.route_planner.route_stops[index].setAddress(address);
        renderActiveRouteOnMap(route);
    };

    const handleRouteStopChange = (value, index, key) => {
        const route = new Route(values);
        route.route_planner.route_stops[index][key] = value;
        route.updateTotalDistanceAndCycleTime();
        setValues(route);
    };

    const handleDeleteStoppage = (index) => {
        const route = new Route(values);
        route.removeRouteStop(index);
        renderActiveRouteOnMap(route);
    };

    const handleMoveStoppage = (index, direction) => {
        const route = new Route(values);
        route.moveRouteStop(index, direction);
        renderActiveRouteOnMap(route);
    };

    const onSubmit = () => {
        if (values.source === values.route_planner.route_stops[0].address_id &&
            values.route_planner.route_stops[0].stop_duration < values.route_planner.loading_time) {
            setFieldError(`route_planner.route_stops[0].stop_duration`, 'Should be greater than or equal than Loading time')
        } else {
            const requestConfig = (action === 'New') ? postRoute({route: values}) : putRoute(values.id, {route: values});
            requestHandler(requestConfig, {loader: true}).then(res => {
                notifications.showNotification({
                    title: "Success", color: 'green', message: 'Route has been saved successfully.'
                });
                history.push('/Route');
            }).catch(e => {
                notifications.showNotification({
                    title: "Error", color: 'red', message: 'Not able to save route details. Something went wrong!!'
                });
            });
        }
    };

    const {values, touched, errors, handleChange, handleSubmit, setValues, setFieldValue, setFieldError} = useFormik({
        enableReinitialize: true,
        initialValues: initialValue,
        validationSchema: ROUTE,
        onSubmit
    });

    return (
        <ContentArea withPaper>
            <form onSubmit={handleSubmit}>
                <Group position="apart" mb="md">
                    <Title order={3}>Route</Title>
                    <Group position="apart">
                        <Button variant="default" onClick={() => history.push('/Route')}>
                            Cancel
                        </Button>
                        <Button leftIcon={<SaveIcon/>} type="submit">
                            {action === 'New' ? 'Save' : 'Update'}
                        </Button>
                    </Group>
                </Group>
                <Divider mb="md" variant="dotted"/>

                <Grid mb="md">
                    <Col span={7}>
                        <SimpleGrid cols={2}>
                            <TextInput
                                {...register("route_code")}
                                label="Route code"
                                placeholder="Enter route code"
                                required
                            />

                            <TextInput
                                {...register("name")}
                                label="Route name"
                                placeholder="Enter route name"
                                required
                            />

                            <AddressSelect
                                {...register("source_address")}
                                label="Source" withIcon required
                                onChange={handleSourceChange}
                                error={errorMessage("source", touched, errors)}
                            />

                            <AddressSelect
                                {...register("destination_address")}
                                label="Destination" withIcon required
                                onChange={handleDestinationChange}
                                error={errorMessage("destination", touched, errors)}
                            />

                            <NumberInput
                                {...register("std_distance_cycle")}
                                label="Distance in kilometers"
                                placeholder="Enter distance"
                                min={0}
                                onChange={val => setFieldValue("std_distance_cycle", val)}
                            />

                            <NumberInput
                                {...register("std_cycle_hours")}
                                label="Cycle hours"
                                placeholder="Enter cycle hours"
                                min={0}
                                onChange={val => setFieldValue("std_cycle_hours", val)}
                            />

                            <NumberInput
                                {...register("equivalent_loads")}
                                label="Equivalent loads"
                                placeholder="Enter equivalent loads"
                                min={0}
                                onChange={val => setFieldValue("equivalent_loads", val)}
                            />

                            <NumberInput
                                {...register("route_planner.loading_time")}
                                label="Loading time in hours"
                                placeholder="Enter loading time"
                                min={0}
                                onChange={handleLoadingTimeChange}
                            />
                        </SimpleGrid>
                    </Col>

                    <Col span={5}>
                        <Text size="lg" weight={500}>Route Map</Text>
                        <div style={{height: 'calc(100% - 30px)'}}>
                            <RouteMap {...routeMapState} onChange={calculateTimeAndDistanceForRoute}/>
                        </div>
                    </Col>
                </Grid>

                <Divider mb="md" variant="dotted"/>

                <Group mb="md" position="apart">
                    <Title order={4}>Route Stoppages</Title>
                    <Button variant="outline" leftIcon={<AddStopIcon/>} onClick={handleAddStoppage}>
                        Add Stoppage
                    </Button>
                </Group>
                <ReactTable
                    columns={[
                        {accessor: 'position', Header: '#', cellWidth: 40},
                        {
                            accessor: 'address_id', Header: 'Address',
                            Cell: ({row}) => <AddressSelect
                                {...register(`route_planner.route_stops[${row.index}].address`)}
                                withIcon required disabled={isRouteStopAddressDisabled(row.index, row.original)}
                                onChange={(val) => handleRouteStopAddressChange(val, row.index)}
                                error={errorMessage(`route_planner.route_stops[${row.index}].address_id`, touched, errors)}
                            />
                        },
                        {
                            accessor: 'distance', Header: 'Distance', cellWidth: 200,
                            Cell: ({row}) => <NumberInput
                                {...register(`route_planner.route_stops[${row.index}].distance`)}
                                placeholder="Enter distance" min={0}
                                disabled={isRouteStopDistanceDisabled(row.index, row.original)}
                                onChange={val => handleRouteStopChange(val, row.index, 'distance')}
                            />
                        },
                        {
                            accessor: 'stop_duration', Header: 'Stop duration', cellWidth: 200,
                            Cell: ({row}) => <NumberInput
                                {...register(`route_planner.route_stops[${row.index}].stop_duration`)}
                                placeholder="Enter stop duration" min={0}
                                onChange={val => handleRouteStopChange(val, row.index, 'stop_duration')}
                            />
                        },
                        {accessor: 'id', Header: 'Actions', cellWidth: 120, Cell: renderStoppageRowAction}
                    ]}
                    data={get(values, 'route_planner.route_stops', []).filter(stop => !stop._destroy)}
                />
            </form>
        </ContentArea>
    );
};

export default CreateOrUpdateRoute