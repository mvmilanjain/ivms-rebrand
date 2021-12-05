import {
    Button,
    Col,
    createStyles,
    Divider,
    Grid,
    Group,
    NumberInput,
    SimpleGrid,
    TextInput,
    Title
} from '@mantine/core';
import {MdOutlineAddLocationAlt as AddStopIcon, MdOutlineSave as SaveIcon} from 'react-icons/md';

import {AddressDropdown, ReactTable, RouteMap} from 'Components';

const useStyles = createStyles(t => ({
    backBtn: {
        color: t.colors.dark[9],
        marginRight: t.spacing.md,
        '&:hover': {
            color: t.colors[t.primaryColor][5]
        }
    }
}));

const CreateOrUpdateRoute = ({history, location}) => {
    const action = location.state.action;
    const {classes} = useStyles();

    const handleBack = () => history.push('/Route');

    return (
        <>
            <Group position="apart" mb="md">
                <Title order={3}>Route</Title>
                <Group position="apart">
                    <Button variant="default" onClick={handleBack}>Cancel</Button>
                    <Button leftIcon={<SaveIcon/>}>{action === 'New' ? 'Save' : 'Update'}</Button>
                </Group>
            </Group>

            <Divider mb="md" variant="dotted"/>

            <Grid mb="md">
                <Col span={7}>
                    <SimpleGrid cols={2}>
                        <TextInput label="Route code" placeholder="Enter route code" required/>

                        <TextInput label="Route name" placeholder="Enter route name" required/>

                        <AddressDropdown label="Source" withIcon required/>

                        <AddressDropdown label="Destination" withIcon required/>

                        <NumberInput label="Distance in kilometers" placeholder="Enter distance" min={0}/>

                        <NumberInput label="Cycle hours" placeholder="Enter cycle hours" min={0}/>

                        <NumberInput label="Equivalent loads" placeholder="Enter equivalent loads" min={0}/>

                        <NumberInput label="Loading time in hours" placeholder="Enter loading time" min={0}/>
                    </SimpleGrid>
                </Col>

                <Col span={5}>
                    <Title order={4} mb="xs">Route Map</Title>
                    <div style={{height: 'calc(100% - 36px)'}}><RouteMap/></div>
                </Col>
            </Grid>

            <Divider mb="md" variant="dotted"/>

            <Group mb="md" position="apart">
                <Title order={4}>Route Stoppages</Title>
                <Button variant="outline" leftIcon={<AddStopIcon/>} onClick={handleBack}>
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
        </>
    );
};

export default CreateOrUpdateRoute