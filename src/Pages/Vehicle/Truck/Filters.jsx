import {Button, Group, TextInput} from '@mantine/core';
import {useSetState} from '@mantine/hooks';

const Filters = ({data, onConfirm}) => {

    const [state, setState] = useSetState(data || {});

    return (
        <>
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
            <Group position="right">
                <Button variant="default" onClick={() => onConfirm({})}>Clear All</Button>
                <Button onClick={() => onConfirm(state)}>Apply Filter</Button>
            </Group>
        </>
    );
};

export default Filters;