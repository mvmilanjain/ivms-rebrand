import {Button, Divider, Drawer, Group, ScrollArea, TextInput} from '@mantine/core';
import {useSetState} from '@mantine/hooks';

const Filters = ({opened, onClose, data, onConfirm}) => {

    const [state, setState] = useSetState(data || {});

    return (
        <Drawer opened={opened} onClose={onClose} position="right" title="Filters" padding="lg">
            <Divider mb="md" variant="dotted"/>

            <ScrollArea style={{height: 'calc(100% - 128px)'}}>
                <TextInput
                    label="Truck number" mb="lg"
                    placeholder="Enter truck number"
                    value={state?.vehicle_number_cont}
                    onChange={e => setState({vehicle_number_cont: e.target.value})}
                />
                <TextInput
                    label="Truck name" mb="lg"
                    placeholder="Enter name"
                    value={state?.name_cont}
                    onChange={e => setState({name_cont: e.target.value})}
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