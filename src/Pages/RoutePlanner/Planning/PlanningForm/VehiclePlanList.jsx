import {Badge, Drawer, Group, ScrollArea, Text, Timeline} from '@mantine/core';
import {FaRoute as RouteIcon} from 'react-icons/fa';

import {renderDateTime, renderTripStatus} from 'Shared/Utilities/tableSchema';

const VehiclePlanList = ({opened, onClose, data}) => (
    <Drawer title="Not Started Plans" padding="lg" position="right" size={360} opened={opened} onClose={onClose}>
        <ScrollArea style={{height: 'calc(100% - 48px)'}} scrollHideDelay={100} mr={-16}>
            <Timeline active={data.length - 1} mr={16}>
                {data.map(item => (
                    <Timeline.Item key={item.order_number} title={item.order_number} bullet={<RouteIcon size={12}/>}>
                        <Group position="apart">
                            <Text size="sm" color="dimmed" mb={4}>Status</Text>
                            {renderTripStatus(item.status)}
                        </Group>
                        <Group position="apart">
                            <Text size="sm" color="dimmed" mb={4}>Route Code</Text>
                            <Badge variant="filled">{item.route.route_code}</Badge>
                        </Group>
                        <Group position="apart">
                            <Text size="sm" color="dimmed" mb={4}>Planned start time</Text>
                            {renderDateTime(item.planned_origin_departure_time, {color: 'green'})}
                        </Group>
                        <Group position="apart">
                            <Text size="sm" color="dimmed" mb={4}>Planned end time</Text>
                            {renderDateTime(item.planned_eta_destination, {color: 'red'})}
                        </Group>
                    </Timeline.Item>
                ))}
            </Timeline>
        </ScrollArea>
    </Drawer>
);

export default VehiclePlanList;