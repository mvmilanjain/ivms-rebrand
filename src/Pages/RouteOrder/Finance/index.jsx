import {Button, Group, Title} from '@mantine/core';
import {MdOutlineAddBox as CreateIcon} from 'react-icons/md';

const Finance = (props) => {
    return (
        <>
            <Group position="apart" mb="md">
                <Title order={2} color="red">Finance</Title>
                <Button leftIcon={<CreateIcon/>}>Create Finance</Button>
            </Group>
            <div style={{height: 'calc(100% - 60px)'}}/>
        </>
    );
};

export default Finance;