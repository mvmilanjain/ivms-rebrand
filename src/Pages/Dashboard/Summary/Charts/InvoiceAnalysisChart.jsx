import {useEffect, useState} from 'react';
import {Box, Card, useMantineTheme, Text, Title, Divider, Group} from '@mantine/core';
import {Bar} from 'react-chartjs-2';

import {calculateSum} from 'Shared/Utilities/common.util';
import {CHART_TYPE, getOptions} from 'Shared/Charts/Options';

const InvoiceAnalysisChart = ({prepared = [], sent = [], paid = []}) => {
    const theme = useMantineTheme();

    const [data, setData] = useState({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {label: 'Prepared', backgroundColor: theme.colors.blue[7], data: []},
            {label: 'Sent to LCS', backgroundColor: theme.colors.orange[7], data: []},
            {label: 'Paid', backgroundColor: theme.colors.green[7], data: []}
        ]
    });

    useEffect(() => {
        const updatedData = {...data};
        updatedData.datasets[0].data = prepared;
        updatedData.datasets[1].data = sent;
        updatedData.datasets[2].data = paid;
        setData(updatedData);
    }, [prepared, sent, paid]);

    return (
        <Card shadow="md" padding="lg" withBorder>
            <Title order={3} mb="md">Invoice Analysis</Title>
            <Divider mb="lg"/>

            <Group position="center" mb="md">
                <Group position="center" direction="column" spacing={0} mr="xl">
                    <Text size="sm" weight={500} color="blue">Total - Prepared</Text>
                    <Text size="xl" weight={700} color="blue">{`R ${calculateSum(data.datasets[0].data)}`}</Text>
                </Group>

                <Group position="center" direction="column" spacing={0} mr="xl">
                    <Text size="sm" weight={500} color="orange">Total - Sent to LCS</Text>
                    <Text size="xl" weight={700} color="orange">{`R ${calculateSum(data.datasets[1].data)}`}</Text>
                </Group>

                <Group position="center" direction="column" spacing={0}>
                    <Text size="sm" weight={500} color="green">Total - Paid</Text>
                    <Text size="xl" weight={700} color="green">{`R ${calculateSum(data.datasets[2].data)}`}</Text>
                </Group>
            </Group>

            <Box sx={t => ({height: 240})}>
                <Bar data={data} options={getOptions(CHART_TYPE.BAR, theme)}/>
            </Box>
        </Card>
    );
};

export default InvoiceAnalysisChart;