import {Button, Group, Paper, Title} from '@mantine/core';
import {PlusSquare as CreateIcon} from 'react-feather';

import {Table} from 'Components';

const schema = [
    {id: 'col1', header: 'Column 1'}, {id: 'col2', header: 'Column 2'}, {id: 'col3', header: 'Column 3'},
    {id: 'col4', header: 'Column 4'}, {id: 'col5', header: 'Column 5'}, {id: 'col6', header: 'Column 6'},
    {id: 'col7', header: 'Column 7'}, {id: 'col8', header: 'Column 8'}, {id: 'col9', header: 'Column 9'},
    {id: 'col10', header: 'Column 10'}, {id: 'col11', header: 'Column 11'}, {id: 'col12', header: 'Column 12'}
];

const data = [
    {
        col1: 'Column 1', col2: 'Column 2', col3: 'Column 3', col4: 'Column 4', col5: 'Column 5', col6: 'Column 6',
        col7: 'Column 7', col8: 'Column 8', col9: 'Column 9', col10: 'Column 10', col11: 'Column 11', col12: 'Column 12'
    },
    {
        col1: 'Column 1', col2: 'Column 2', col3: 'Column 3', col4: 'Column 4', col5: 'Column 5', col6: 'Column 6',
        col7: 'Column 7', col8: 'Column 8', col9: 'Column 9', col10: 'Column 10', col11: 'Column 11', col12: 'Column 12'
    },
    {
        col1: 'Column 1', col2: 'Column 2', col3: 'Column 3', col4: 'Column 4', col5: 'Column 5', col6: 'Column 6',
        col7: 'Column 7', col8: 'Column 8', col9: 'Column 9', col10: 'Column 10', col11: 'Column 11', col12: 'Column 12'
    },
    {
        col1: 'Column 1', col2: 'Column 2', col3: 'Column 3', col4: 'Column 4', col5: 'Column 5', col6: 'Column 6',
        col7: 'Column 7', col8: 'Column 8', col9: 'Column 9', col10: 'Column 10', col11: 'Column 11', col12: 'Column 12'
    },
    {
        col1: 'Column 1', col2: 'Column 2', col3: 'Column 3', col4: 'Column 4', col5: 'Column 5', col6: 'Column 6',
        col7: 'Column 7', col8: 'Column 8', col9: 'Column 9', col10: 'Column 10', col11: 'Column 11', col12: 'Column 12'
    },
    {
        col1: 'Column 1', col2: 'Column 2', col3: 'Column 3', col4: 'Column 4', col5: 'Column 5', col6: 'Column 6',
        col7: 'Column 7', col8: 'Column 8', col9: 'Column 9', col10: 'Column 10', col11: 'Column 11', col12: 'Column 12'
    },
    {
        col1: 'Column 1', col2: 'Column 2', col3: 'Column 3', col4: 'Column 4', col5: 'Column 5', col6: 'Column 6',
        col7: 'Column 7', col8: 'Column 8', col9: 'Column 9', col10: 'Column 10', col11: 'Column 11', col12: 'Column 12'
    },
    {
        col1: 'Column 1', col2: 'Column 2', col3: 'Column 3', col4: 'Column 4', col5: 'Column 5', col6: 'Column 6',
        col7: 'Column 7', col8: 'Column 8', col9: 'Column 9', col10: 'Column 10', col11: 'Column 11', col12: 'Column 12'
    },
    {
        col1: 'Column 1', col2: 'Column 2', col3: 'Column 3', col4: 'Column 4', col5: 'Column 5', col6: 'Column 6',
        col7: 'Column 7', col8: 'Column 8', col9: 'Column 9', col10: 'Column 10', col11: 'Column 11', col12: 'Column 12'
    },
    {
        col1: 'Column 1', col2: 'Column 2', col3: 'Column 3', col4: 'Column 4', col5: 'Column 5', col6: 'Column 6',
        col7: 'Column 7', col8: 'Column 8', col9: 'Column 9', col10: 'Column 10', col11: 'Column 11', col12: 'Column 12'
    },
    {
        col1: 'Column 1', col2: 'Column 2', col3: 'Column 3', col4: 'Column 4', col5: 'Column 5', col6: 'Column 6',
        col7: 'Column 7', col8: 'Column 8', col9: 'Column 9', col10: 'Column 10', col11: 'Column 11', col12: 'Column 12'
    },
    {
        col1: 'Column 1', col2: 'Column 2', col3: 'Column 3', col4: 'Column 4', col5: 'Column 5', col6: 'Column 6',
        col7: 'Column 7', col8: 'Column 8', col9: 'Column 9', col10: 'Column 10', col11: 'Column 11', col12: 'Column 12'
    },
    {
        col1: 'Column 1', col2: 'Column 2', col3: 'Column 3', col4: 'Column 4', col5: 'Column 5', col6: 'Column 6',
        col7: 'Column 7', col8: 'Column 8', col9: 'Column 9', col10: 'Column 10', col11: 'Column 11', col12: 'Column 12'
    },
    {
        col1: 'Column 1', col2: 'Column 2', col3: 'Column 3', col4: 'Column 4', col5: 'Column 5', col6: 'Column 6',
        col7: 'Column 7', col8: 'Column 8', col9: 'Column 9', col10: 'Column 10', col11: 'Column 11', col12: 'Column 12'
    },
    {
        col1: 'Column 1', col2: 'Column 2', col3: 'Column 3', col4: 'Column 4', col5: 'Column 5', col6: 'Column 6',
        col7: 'Column 7', col8: 'Column 8', col9: 'Column 9', col10: 'Column 10', col11: 'Column 11', col12: 'Column 12'
    },
    {
        col1: 'Column 1', col2: 'Column 2', col3: 'Column 3', col4: 'Column 4', col5: 'Column 5', col6: 'Column 6',
        col7: 'Column 7', col8: 'Column 8', col9: 'Column 9', col10: 'Column 10', col11: 'Column 11', col12: 'Column 12'
    },
    {
        col1: 'Column 1', col2: 'Column 2', col3: 'Column 3', col4: 'Column 4', col5: 'Column 5', col6: 'Column 6',
        col7: 'Column 7', col8: 'Column 8', col9: 'Column 9', col10: 'Column 10', col11: 'Column 11', col12: 'Column 12'
    },
    {
        col1: 'Column 1', col2: 'Column 2', col3: 'Column 3', col4: 'Column 4', col5: 'Column 5', col6: 'Column 6',
        col7: 'Column 7', col8: 'Column 8', col9: 'Column 9', col10: 'Column 10', col11: 'Column 11', col12: 'Column 12'
    },
    {
        col1: 'Column 1', col2: 'Column 2', col3: 'Column 3', col4: 'Column 4', col5: 'Column 5', col6: 'Column 6',
        col7: 'Column 7', col8: 'Column 8', col9: 'Column 9', col10: 'Column 10', col11: 'Column 11', col12: 'Column 12'
    },
    {
        col1: 'Column 1', col2: 'Column 2', col3: 'Column 3', col4: 'Column 4', col5: 'Column 5', col6: 'Column 6',
        col7: 'Column 7', col8: 'Column 8', col9: 'Column 9', col10: 'Column 10', col11: 'Column 11', col12: 'Column 12'
    },
];

const Route = (props) => {
    return (
        <Paper padding="sm" withBorder style={{height: '100%'}}>
            <Group position="apart" mb="sm">
                <Title order={2} color="red">Routes</Title>
                <Button leftIcon={<CreateIcon size={16}/>} variant="light">Create Route</Button>
            </Group>
            <div style={{height: 'calc(100% - 60px)'}}>
                <Table schema={schema} data={data}/>
            </div>
        </Paper>
    );
};

export default Route;