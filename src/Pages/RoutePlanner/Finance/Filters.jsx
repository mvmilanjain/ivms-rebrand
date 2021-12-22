import {Button, Divider, Drawer, Group, ScrollArea, Select, TextInput} from '@mantine/core';
import {useSetState} from '@mantine/hooks';

const TRIP_STATUS = [
    {label: 'Not Started', value: '0'},
    {label: 'In-Progress', value: '1'},
    {label: 'Completed', value: '2'},
    {label: 'Cancelled', value: '3'}
];

const Filters = ({opened, onClose, data, onConfirm}) => {

    const [state, setState] = useSetState(data || {});

    return (
        <Drawer opened={opened} onClose={onClose} position="right" title="Filters" padding="lg">
            <Divider mb="md" variant="dotted"/>

            <ScrollArea style={{height: 'calc(100% - 128px)'}}>
                <TextInput
                    label="Order number" mb="lg"
                    placeholder="Enter order number"
                    value={state?.order_number_cont}
                    onChange={e => setState({order_number_cont: e.target.value})}
                />
                <Select
                    label="Status"
                    placeholder="Select status"
                    mb="lg" clearable
                    data={TRIP_STATUS}
                    value={state?.status_eq}
                    onChange={val => setState({status_eq: val})}
                />
            </ScrollArea>

            <Divider my="md" variant="dotted"/>

            <Group position="apart">
                <Button variant="outline" color="red" onClick={() => onConfirm({})}>Clear All</Button>
                <Button onClick={() => onConfirm(state)}>Apply Filter</Button>
            </Group>
        </Drawer>
    );
};

export default Filters;