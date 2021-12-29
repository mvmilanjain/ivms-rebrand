import {useFormik} from 'formik';
import * as yup from 'yup';
import {Button, Group} from '@mantine/core';
import {MdOutlineAccessTime as TimeIcon} from 'react-icons/md';

import {DateTimePicker} from 'Components';
import {errorMessage} from 'Shared/Utilities/common.util';

const CompleteTripEventForm = ({onConfirm}) => {
    const {values, errors, touched, handleSubmit, setFieldValue} = useFormik({
        initialValues: {
            start_time: null,
            end_time: null,
            cancellation_reason: null,
            cancelled_at: null
        },
        validationSchema: yup.object({end_time: yup.date().required().nullable().label('This')}),
        onSubmit: onConfirm
    });

    return (
        <form onSubmit={handleSubmit}>
            <Group position="center" direction="column" grow>
                <DateTimePicker
                    id="end_time"
                    required icon={<TimeIcon />}
                    label="Trip complete tome"
                    placeholder="Select trip complete time"
                    value={values.end_time}
                    onChange={val => setFieldValue('end_time', val)}
                    error={errorMessage('end_time', touched, errors)}
                />
                <Button type="submit">Confirm</Button>
            </Group>
        </form>
    );
};

export default CompleteTripEventForm;