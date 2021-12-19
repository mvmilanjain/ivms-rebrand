import {useEffect, useState} from 'react';
import {Box, Card, useMantineTheme, Text, Title, Divider, Group} from '@mantine/core';
import {Bar} from 'react-chartjs-2';

import {calculateSum} from 'Shared/Utilities/common.util';
import {CHART_TYPE, getOptions} from 'Shared/Charts/Options';

const LoadsRevenueChart = ({overall = [], completed = []}) => {

    const theme = useMantineTheme();

    const [data, setData] = useState({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {label: 'Overall', backgroundColor: theme.colors.blue[7], data: []},
            {label: 'Completed', backgroundColor: theme.colors.orange[7], data: []}
        ]
    });

    useEffect(() => {
        const updatedData = {...data};
        updatedData.datasets[0].data = overall;
        updatedData.datasets[1].data = completed;
        setData(updatedData);
    }, [overall, completed]);


    return (
        <Card shadow="md" padding="lg" withBorder>
            <Title order={3} mb="md">Loads Revenue</Title>
            <Divider mb="lg"/>

            <Group position="center" mb="md">
                <Group position="center" direction="column" spacing={0} mr="xl">
                    <Text size="sm" weight={500} color="blue">Total - Overall</Text>
                    <Text size="xl" weight={700} color="blue">{`R ${calculateSum(data.datasets[0].data)}`}</Text>
                </Group>

                <Group position="center" direction="column" spacing={0}>
                    <Text size="sm" weight={500} color="orange">Total - Completed</Text>
                    <Text size="xl" weight={700} color="orange">{`R ${calculateSum(data.datasets[1].data)}`}</Text>
                </Group>
            </Group>

            <Box sx={t => ({height: 240})}>
                <Bar data={data} options={getOptions(CHART_TYPE.BAR, theme)}/>
            </Box>
        </Card>
    );


};

export default LoadsRevenueChart;