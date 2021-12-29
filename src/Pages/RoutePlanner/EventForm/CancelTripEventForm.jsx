import {useFormik} from 'formik';
import * as yup from 'yup';
import {Button, Group, Textarea} from '@mantine/core';
import {MdOutlineAccessTime as TimeIcon} from 'react-icons/md';

import {DateTimePicker} from 'Components';
import {errorMessage} from 'Shared/Utilities/common.util';

const CancelTripEventForm = ({onConfirm}) => {
    const {values, errors, touched, handleSubmit, setFieldValue, handleChange} = useFormik({
        initialValues: {
            start_time: null,
            end_time: null,
            cancellation_reason: null,
            cancelled_at: new Date()
        },
        validationSchema: yup.object({
            cancelled_at: yup.date().required().nullable().label('This')
        }),
        onSubmit: onConfirm
    });

    return (
        <form onSubmit={handleSubmit}>
            <Group position="center" direction="column" grow>
                <DateTimePicker
                    id="cancelled_at"
                    required icon={<TimeIcon />}
                    label="Cancellation time"
                    placeholder="Select trip cancellation time"
                    value={values.cancelled_at}
                    onChange={val => setFieldValue('cancelled_at', val)}
                    error={errorMessage('cancelled_at', touched, errors)}
                />
                <Textarea
                    id="cancellation_reason"
                    label="Cancellation reason"
                    placeholder="Enter trip cancellation reason"
                    value={values.cancellation_reason}
                    onChange={handleChange}
                />
                <Button type="submit">Confirm</Button>
            </Group>
        </form>
    );
};

export default CancelTripEventForm;