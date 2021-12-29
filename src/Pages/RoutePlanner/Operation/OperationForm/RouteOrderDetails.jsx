import {Badge, Group, Text, Tooltip} from '@mantine/core';
import {CalendarIcon} from '@modulz/radix-icons';
import {FaTruck as TruckIcon} from 'react-icons/fa';
import {MdPerson as DriverIcon} from 'react-icons/md';

import {formatDateTime, getFullName} from 'Shared/Utilities/common.util';

const RouteOrderDetails = ({data}) => (
    <Group mb="md" direction="column">
        <Group>
            <Text size="lg" weight={600} mb={0}>
                Order #: <Text color="blue" inherit component="span">{data.order_number}</Text>
            </Text>
            <Tooltip label="Status" withArrow>
                <Badge variant="filled" radius="lg" color="green">{data.status}</Badge>
            </Tooltip>

            <Tooltip label="Truck" withArrow>
                <Badge variant="filled" radius="lg" color="orange" leftSection={<TruckIcon size={10}/>}>
                    {data.vehicle.name}
                </Badge>
            </Tooltip>
            <Tooltip label="Driver" withArrow>
                <Badge variant="filled" radius="lg" color="grape" leftSection={<DriverIcon size={10}/>}>
                    {getFullName(data.member.first_name, data.member.last_name)}
                </Badge>
            </Tooltip>
        </Group>
        <Group>
            <Group>
                <Text size="sm" weight={600}>Planned start time:</Text>
                <Badge
                    radius="sm" color="cyan"
                    leftSection={<CalendarIcon style={{width: 10, height: 10}}/>}
                >
                    {formatDateTime(data.planned_origin_departure_time)}
                </Badge>
            </Group>
            <Group>
                <Text size="sm" weight={600}>Planned end time:</Text>
                <Badge
                    radius="sm" color="red"
                    leftSection={<CalendarIcon style={{width: 10, height: 10}}/>}
                >
                    {formatDateTime(data.planned_eta_destination)}
                </Badge>
            </Group>
        </Group>
    </Group>
);

export default RouteOrderDetails;