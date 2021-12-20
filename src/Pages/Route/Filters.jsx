import {useSetState} from "@mantine/hooks";
import {Button, Group, TextInput} from "@mantine/core";

const Filters = ({data, onConfirm}) => {

    const [state, setState] = useSetState(data || {});

    return (
        <>
            <TextInput
                label="Code" mb="lg"
                placeholder="Enter code"
                value={state?.route_code_cont}
                onChange={e => setState({route_code_cont: e.target.value})}
            />
            <TextInput
                label="Name" mb="lg"
                placeholder="Enter name"
                value={state?.name_cont}
                onChange={e => setState({name_cont: e.target.value})}
            />
            <Group position="right">
                <Button variant="default" onClick={() => onConfirm({})}>Clear</Button>
                <Button onClick={() => onConfirm(state)}>Apply Filter</Button>
            </Group>
        </>
    );
};

export default Filters;