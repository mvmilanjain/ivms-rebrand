import {Group, Paper, Title} from "@mantine/core";

const Planning = (props) => {
    return (
        <Paper padding="sm" withBorder style={{height: '100%'}}>
            <Group position="apart" mb="sm">
                <Title order={2} color="red">Planning</Title>
                {/*<Button leftIcon={<CreateIcon size={16}/>} variant="light">Create Route</Button>*/}
            </Group>
            <div style={{height: 'calc(100% - 60px)'}}/>
        </Paper>
    );
};

export default Planning;