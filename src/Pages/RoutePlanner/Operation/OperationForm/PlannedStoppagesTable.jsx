import {Group, ScrollArea, Text} from '@mantine/core';

import {ReactTable} from 'Components';
import {renderDateTime, renderDistance, renderTextWithTooltip} from 'Shared/Utilities/tableSchema';
import {getAddressLabel} from 'Shared/Utilities/common.util';

const PlannedStoppagesTable = ({data}) => (
    <Group direction="column" grow spacing="sm" mb="md">
        <Text size="lg" weight={500}>Planned Stoppages</Text>
        <ScrollArea scrollHideDelay={0} style={{maxHeight: 300}}>
            <ReactTable
                columns={[
                    {accessor: 'position', Header: '#', cellWidth: 40},
                    {
                        accessor: 'address', Header: 'Address',
                        Cell: ({value}) => renderTextWithTooltip(getAddressLabel(value))
                    },
                    {
                        accessor: 'distance', Header: 'Distance', align: 'center',
                        Cell: ({value}) => renderDistance(value)
                    },
                    {
                        accessor: 'estimated_arrival_time', Header: 'Estimated Arrival',
                        align: 'center', Cell: ({value}) => renderDateTime(value)
                    },
                    {
                        accessor: 'estimated_departure_time', Header: 'Estimated Departure',
                        align: 'center', cellMinWidth: 168, Cell: ({value}) => renderDateTime(value)
                    },
                    {accessor: 'stop_duration', Header: 'Stop duration', align: 'center', cellWidth: 128}
                ]}
                data={data}
            />
        </ScrollArea>
    </Group>
);

export default PlannedStoppagesTable;