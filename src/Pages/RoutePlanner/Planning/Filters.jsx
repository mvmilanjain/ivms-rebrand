import {Button, Group, Select, TextInput} from '@mantine/core';
import {useSetState} from '@mantine/hooks';

import {TRIP_STATUS} from 'Shared/Utilities/referenceData.util';

const Filters = ({data, onConfirm}) => {

    const [state, setState] = useSetState(data || {});

    return (
        <>
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
            <Group position="right">
                <Button variant="default" onClick={() => onConfirm({})}>Clear All</Button>
                <Button onClick={() => onConfirm(state)}>Apply Filter</Button>
            </Group>
        </>
    );
};

export default Filters;