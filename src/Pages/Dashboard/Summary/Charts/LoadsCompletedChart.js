import {useEffect, useState} from 'react';
import {Box, Card, Divider, Group, Text, Title, useMantineTheme} from '@mantine/core';
import {HorizontalBar} from 'react-chartjs-2';

import {calculateSum} from 'Shared/Utilities/common.util';
import {CHART_TYPE, getOptions} from 'Shared/Charts/Options';

const LoadsCompletedChart = ({completed = []}) => {

    const theme = useMantineTheme();

    const [data, setData] = useState({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{label: 'Completed', backgroundColor: theme.colors.blue[7], data: []}]
    });

    useEffect(() => {
        const updatedData = {...data};
        updatedData.datasets[0].data = completed;
        setData(updatedData);
    }, [completed]);


    return (
        <Card shadow="md" padding="lg" withBorder>
            <Title order={3} mb="md">Loads Completed</Title>
            <Divider mb="lg"/>

            <Group position="center" mb="md" direction="column" spacing={0}>
                <Text size="sm" weight={500} color="blue">Total - Loads Completed</Text>
                <Text size="xl" weight={700} color="blue">{calculateSum(data.datasets[0].data)}</Text>
            </Group>

            <Box sx={t => ({height: 240})}>
                <HorizontalBar data={data} options={getOptions(CHART_TYPE.HORIZONTAL_BAR, theme)}/>
            </Box>
        </Card>
    );


};

export default LoadsCompletedChart;