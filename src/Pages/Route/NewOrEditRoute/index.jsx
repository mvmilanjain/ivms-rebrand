import {useEffect, useState} from 'react';
import get from 'lodash/get';
import {useFormik} from 'formik';
import {Button, Col, Divider, Grid, Group, NumberInput, SimpleGrid, TextInput, Title} from '@mantine/core';
import {useNotifications} from '@mantine/notifications';
import {MdOutlineAddLocationAlt as AddStopIcon, MdOutlineSave as SaveIcon} from 'react-icons/md';

import {AddressDropdown, ReactTable, RouteMap} from 'Components';
import {useHttp} from 'Hooks';
import {Route} from 'Shared/Models';
import {ROUTE} from 'Shared/Utilities/validationSchema.util';
import {errorMessage} from 'Shared/Utilities/common.util';
import {getRoute, postRoute, putRoute} from 'Shared/Services';

const CreateOrUpdateRoute = ({history, location, match, ...rest}) => {
    const action = location.state.action;
    const {requestHandler} = useHttp();
    const notifications = useNotifications();
    const [initialValue, setInitialValue] = useState({});

    const register = (fieldName) => ({
        id: fieldName,
        value: get(values, fieldName),
        onChange: handleChange,
        error: errorMessage(fieldName, touched, errors)
    });

    useEffect(() => {
        if (action === 'New') {
            const route = new Route();
            setInitialValue({...route});
        } else {
            const {params} = match;
            console.log({params});
            requestHandler(getRoute(params.id), {loader: true}).then(res => {
                setInitialValue(new Route(res.data));
            }).catch(e => {
                console.error(e);
                notifications.showNotification({
                    title: "Error", color: 'red', message: 'Not able to fetch route details. Something went wrong!!'
                });
            });
        }
    }, []);

    const handleSourceChange = (address) => {
        const route = new Route(values);
        route.setSource(address);
        setValues(route);
    };

    const handleDestinationChange = (address) => {
        const route = new Route(values);
        route.setDestination(address);
        setValues(route);
    };

    const handleLoadingTimeChange = (loadingTime) => {
        const route = new Route(values);
        route.setLoadingTime(loadingTime);
        setValues(route);
    };

    const handleAddStoppage = () => {

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
        setValues(route);
    };

    const handleRouteStopChange = (value, index, key) => {
        const route = new Route(values);
        route.route_planner.route_stops[index][key] = value;
        route.updateTotalDistanceAndCycleTime();
        setValues(route);
    };

    const onSubmit = (values) => {
        if (values.source === values.route_planner.route_stops[0].address_id &&
            values.route_planner.route_stops[0].stop_duration < values.route_planner.loading_time) {
            setFieldError(`route_planner.route_stops[0].stop_duration`, 'Should be greater than or equal than Loading time')
        } else {
            const requestConfig = (action === 'New') ? postRoute({route: values}) : putRoute(values.id, {route: values});
            requestHandler(requestConfig, {loader: true}).then(res => {
                notifications.showNotification({
                    title: "Success", color: 'green', message: 'Route has been saved successfully.'
                });
                history.push('/route');
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
        <form onSubmit={handleSubmit}>
            {/*<pre>{JSON.stringify(values, null, 2)}</pre>*/}
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

                        <AddressDropdown
                            {...register("source_address")}
                            label="Source" withIcon required
                            onChange={handleSourceChange}
                            error={errorMessage("source", touched, errors)}
                        />

                        <AddressDropdown
                            {...register("destination_address")}
                            label="Destination" withIcon required
                            onChange={handleDestinationChange}
                            error={errorMessage("source", touched, errors)}
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
                    <Title order={4} mb="xs">Route Map</Title>
                    <div style={{height: 'calc(100% - 36px)'}}>
                        <RouteMap routeStoppageList={[]} onRouteStopChange={() => {
                        }}/>
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
                        Cell: ({row}) => <AddressDropdown
                            {...register(`route_planner.route_stops[${row.index}].address`)}
                            withIcon required disabled={isRouteStopAddressDisabled(row.index, row.original)}
                            onChange={(val) => handleRouteStopAddressChange(val, row.index)}
                            error={errorMessage(`route_planner.route_stops[${row.index}].address_id`, touched, errors)}
                        />
                    },
                    {
                        accessor: 'distance', Header: 'Distance',
                        Cell: ({row}) => <NumberInput
                            {...register(`route_planner.route_stops[${row.index}].distance`)}
                            placeholder="Enter distance" min={0}
                            disabled={isRouteStopDistanceDisabled(row.index, row.original)}
                            onChange={val => handleRouteStopChange(val, row.index, 'distance')}
                        />
                    },
                    {
                        accessor: 'stop_duration', Header: 'Stop duration',
                        Cell: ({row}) => <NumberInput
                            {...register(`route_planner.route_stops[${row.index}].stop_duration`)}
                            placeholder="Enter stop duration" min={0}
                            onChange={val => handleRouteStopChange(val, row.index, 'stop_duration')}
                        />
                    },
                ]}
                data={get(values, 'route_planner.route_stops', []).filter(stop => !stop._destroy)}
            />
        </form>
    );
};

export default CreateOrUpdateRoute