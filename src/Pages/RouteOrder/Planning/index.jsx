import {Button, Group, Title} from '@mantine/core';
import {MdOutlineAddBox as CreateIcon} from 'react-icons/md';

const Planning = (props) => {
    return (
        <>
            <Group position="apart" mb="sm">
                <Title order={2} color="red">Planning</Title>
                <Button leftIcon={<CreateIcon/>}>Create Plan</Button>
            </Group>
            <div style={{height: 'calc(100% - 60px)'}}/>
        </>
    );
};

export default Planning;