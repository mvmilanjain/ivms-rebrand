import {useEffect, useState} from 'react';
import {Box, Card, useMantineTheme, Text, Title, Divider, Group} from '@mantine/core';
import {HorizontalBar} from 'react-chartjs-2';

import {calculateSum} from 'Shared/Utilities/common.util';
import {CHART_TYPE, getOptions} from 'Shared/Charts/Options';

const InvoiceOutstandingChart = ({outstanding = []}) => {
    const theme = useMantineTheme();

    const [data, setData] = useState({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{label: 'Outstanding', backgroundColor: theme.colors.blue[7], data: []}]
    });

    useEffect(() => {
        const updatedData = {...data};
        updatedData.datasets[0].data = outstanding;
        setData(updatedData);
    }, [outstanding]);

    return (
        <Card shadow="md" padding="lg" withBorder>
            <Title order={3} mb="md">Invoice Outstanding</Title>
            <Divider mb="lg"/>

            <Group position="center" mb="md" direction="column" spacing={0}>
                <Text size="sm" weight={500} color="blue">Total - Invoice Outstanding</Text>
                <Text size="xl" weight={700} color="blue">{calculateSum(data.datasets[0].data)}</Text>
            </Group>

            <Box sx={t => ({height: 240})}>
                <HorizontalBar data={data} options={getOptions(CHART_TYPE.HORIZONTAL_BAR, theme)}/>
            </Box>
        </Card>
    );
};

export default InvoiceOutstandingChart;