import {TextInput, Button} from '@mantine/core';
import {useSetState} from '@mantine/hooks';

const NewOrEditRecordForm = ({data, action, onConfirm}) => {
    const [state, setState] = useSetState(data || {name: '', id: ''});

    return (
        <>
            <TextInput
                required mb="md" data-autofocus label="Name" placeholder="Enter name"
                value={state.name} onChange={e => setState({name: e.target.value})}
            />
            <Button fullWidth onClick={() => onConfirm(state)}>{action}</Button>
        </>
    );
};

export default NewOrEditRecordForm;