import {useEffect, useState} from 'react';
import {Box, Card, Divider, Group, Text, Title, useMantineTheme} from '@mantine/core';
import {Bar} from 'react-chartjs-2';

import {calculateSum} from 'Shared/Utilities/common.util';
import {CHART_TYPE, getOptions} from 'Shared/Charts/Options';

const PodAnalysisChart = ({collected = [], notCollected = []}) => {
    const theme = useMantineTheme();

    const [data, setData] = useState({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {label: 'Collected', backgroundColor: theme.colors.blue[7], data: []},
            {label: 'Not Collected', backgroundColor: theme.colors.orange[7], data: []}
        ]
    });

    useEffect(() => {
        const updatedData = {...data};
        updatedData.datasets[0].data = collected;
        updatedData.datasets[1].data = notCollected;
        setData(updatedData);
    }, [collected, notCollected]);

    return (
        <Card shadow="md" padding="lg" withBorder>
            <Title order={3} mb="md">POD Analysis</Title>
            <Divider mb="lg"/>

            <Group position="center" mb="md">
                <Group position="center" direction="column" spacing={0} mr="xl">
                    <Text size="sm" weight={500} color="blue">Total - Collected</Text>
                    <Text size="xl" weight={700} color="blue">{`R ${calculateSum(data.datasets[0].data)}`}</Text>
                </Group>

                <Group position="center" direction="column" spacing={0}>
                    <Text size="sm" weight={500} color="orange">Total - Not Collected</Text>
                    <Text size="xl" weight={700} color="orange">{`R ${calculateSum(data.datasets[1].data)}`}</Text>
                </Group>
            </Group>

            <Box sx={t => ({height: 240})}>
                <Bar data={data} options={getOptions(CHART_TYPE.BAR, theme)}/>
            </Box>
        </Card>
    );
};

export default PodAnalysisChart;