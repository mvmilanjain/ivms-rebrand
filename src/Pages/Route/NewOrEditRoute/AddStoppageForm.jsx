import {useFormik} from 'formik';
import {Button, Group, NumberInput} from '@mantine/core';

import {AddressDropdown} from 'Components';
import {RouteStop} from 'Shared/Models';
import {ADD_ROUTE_STOP} from 'Shared/Utilities/validationSchema.util';
import {errorMessage} from 'Shared/Utilities/common.util';

const AddStoppageForm = ({onConfirm}) => {
    const routeStop = new RouteStop();

    const handleStoppageAddressChange = (address) => {
        const routeStop = new RouteStop(addStoppageForm.values);
        routeStop.setAddress(address);
        addStoppageForm.setValues(routeStop);
    };

    const addStoppageForm = useFormik({
        initialValues: routeStop,
        validationSchema: ADD_ROUTE_STOP,
        onSubmit: onConfirm
    });

    return (
        <form onSubmit={addStoppageForm.handleSubmit}>
            <Group position="center" direction="column" grow>
                <AddressDropdown
                    id="address_id" label="Address"
                    value={addStoppageForm.values.address} onChange={handleStoppageAddressChange}
                    error={errorMessage('address_id', addStoppageForm.touched, addStoppageForm.errors)}
                />
                <NumberInput
                    id="stop_duration" min={0}
                    label="Stop Duration"
                    placeholder="Enter stop duration"
                    value={addStoppageForm.values.stop_duration}
                    onChange={val => addStoppageForm.setFieldValue('stop_duration', val)}
                    error={errorMessage('stop_duration', addStoppageForm.touched, addStoppageForm.errors)}
                />
                <Button type="submit">Add</Button>
            </Group>
        </form>
    );
};

export default AddStoppageForm;