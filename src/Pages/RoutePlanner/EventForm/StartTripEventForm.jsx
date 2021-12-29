import {useFormik} from 'formik';
import * as yup from 'yup';
import {Button, Group} from '@mantine/core';
import {MdOutlineAccessTime as TimeIcon} from 'react-icons/md';

import {DateTimePicker} from 'Components';
import {errorMessage} from 'Shared/Utilities/common.util';

const StartTripEventForm = ({onConfirm}) => {
    const {values, errors, touched, handleSubmit, setFieldValue} = useFormik({
        initialValues: {
            start_time: null,
            end_time: null,
            cancellation_reason: null,
            cancelled_at: null
        },
        validationSchema: yup.object({start_time: yup.date().required().nullable().label('This')}),
        onSubmit: onConfirm
    });

    return (
        <form onSubmit={handleSubmit}>
            <Group position="center" direction="column" grow>
                <DateTimePicker
                    id="start_time"
                    required icon={<TimeIcon />}
                    label="Trip start time"
                    placeholder="Select trip start time"
                    value={values.start_time}
                    onChange={val => setFieldValue('start_time', val)}
                    error={errorMessage('start_time', touched, errors)}
                />
                <Button type="submit">Confirm</Button>
            </Group>
        </form>
    );
};

export default StartTripEventForm;