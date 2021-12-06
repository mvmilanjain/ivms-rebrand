import {useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {Button, Col, Divider, Grid, Group, NumberInput, SimpleGrid, TextInput, Title} from '@mantine/core';
import {MdOutlineAddLocationAlt as AddStopIcon, MdOutlineSave as SaveIcon} from 'react-icons/md';

import {AddressDropdown, ReactTable, RouteMap} from 'Components';
import {Route} from 'Shared/Models';
import {ROUTE} from 'Shared/Utilities/validationSchema.util';

const CreateOrUpdateRoute = ({history, location}) => {
    const action = location.state.action;

    const {formState, register, handleSubmit, reset, setValue, getValues} = useForm({
        resolver: yupResolver(ROUTE)
    });

    useEffect(() => {
        let defaultValue = {};
        if (action === 'New') {
            defaultValue = new Route();
            reset({...defaultValue});
        }
    }, []);

    const handleSourceChange = (source) => {
        const route = new Route(getValues());
        route.setSource(source);

    };

    const handleAddStoppage = () => {

    };

    const onSubmit = (values) => {
        alert(values);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
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
                            label="Route code" placeholder="Enter route code"
                            required error={formState.errors.route_code?.message}
                        />

                        <TextInput
                            {...register("name")}
                            label="Route name" placeholder="Enter route name"
                            required error={formState.errors.name?.message}
                        />

                        <AddressDropdown
                            {...register("source_address")}
                            label="Source" withIcon required
                            onChange={handleSourceChange}
                            error={formState.errors.source?.message}
                        />

                        <AddressDropdown
                            {...register("destination_address")}
                            label="Destination" withIcon required
                            error={formState.errors.destination?.message}
                        />

                        <NumberInput
                            {...register("std_distance_cycle")}
                            label="Distance in kilometers"
                            placeholder="Enter distance"
                            min={0} value={getValues().std_distance_cycle}
                            onChange={val => setValue('std_distance_cycle', val, {
                                shouldValidate: true
                            })}
                            error={formState.errors.std_distance_cycle?.message}
                        />

                        <NumberInput
                            {...register("std_cycle_hours")}
                            label="Cycle hours"
                            placeholder="Enter cycle hours"
                            min={0} value={getValues().std_cycle_hours}
                            onChange={val => setValue('std_cycle_hours', val, {
                                shouldValidate: true
                            })}
                            error={formState.errors.std_cycle_hours?.message}
                        />

                        <NumberInput
                            {...register("equivalent_loads")}
                            label="Equivalent loads"
                            placeholder="Enter equivalent loads"
                            min={0} value={getValues().equivalent_loads}
                            onChange={val => setValue('equivalent_loads', val, {
                                shouldValidate: true
                            })}
                            error={formState.errors.equivalent_loads?.message}
                        />

                        <NumberInput
                            {...register("route_planner.loading_time")}
                            label="Loading time in hours"
                            placeholder="Enter loading time"
                            min={0} value={getValues().route_planner?.loading_time}
                            onChange={value => setValue('route_planner.loading_time', value, {
                                shouldValidate: true
                            })}
                            error={formState.errors.route_planner?.loading_time?.message}
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
            <div>
                <ReactTable
                    columns={[
                        {accessor: 'id', Header: '#', cellWidth: 40},
                        {accessor: 'address', Header: 'Address', cellWidth: 400},
                        {accessor: 'distance', Header: 'Distance'},
                        {accessor: 'stopDuration', Header: 'Stop duration'},
                    ]}
                    data={[]}
                />
            </div>
        </form>
    );
};

export default CreateOrUpdateRoute