import {useFormik} from 'formik';
import {Button, Group, Textarea, TextInput} from '@mantine/core';
import * as yup from 'yup';

import {errorMessage} from 'Shared/Utilities/common.util';

const InspectionForm = ({data, onConfirm}) => {
    const {values, touched, errors, handleChange, handleSubmit} = useFormik({
        initialValues: data || {name: '', description: ''},
        validationSchema: yup.object({name: yup.string().label('Name').required()}),
        onSubmit: onConfirm
    });

    return (
        <form onSubmit={handleSubmit}>
            <Group position="center" direction="column" grow>
                <TextInput
                    id="name" required label="Name" placeholder="Enter name"
                    value={values.name} onChange={handleChange}
                    error={errorMessage("name", touched, errors)}
                />
                <Textarea
                    id="description" label="Description"
                    placeholder="Enter description"
                    value={values.description}
                    onChange={handleChange}
                />
                <Button type="submit">{data ? 'Update' : 'Save'}</Button>
            </Group>
        </form>
    );
};

export default InspectionForm;