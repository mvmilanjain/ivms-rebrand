import {Button, Group, Title} from '@mantine/core';
import {MdOutlineAddBox as CreateIcon} from 'react-icons/md';

const InspectionReport = (props) => {

    return (
        <>
            <Group position="apart" mb="sm">
                <Title order={2}>Inspection Form</Title>
                <Button leftIcon={<CreateIcon/>}>Create Inspection Form</Button>
            </Group>
            <div style={{height: 'calc(100% - 60px)'}}>

            </div>
        </>
    );
};

export default InspectionReport;