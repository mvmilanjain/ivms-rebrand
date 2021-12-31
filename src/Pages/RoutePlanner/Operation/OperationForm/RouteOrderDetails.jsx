import {Badge, Group, Text, Tooltip} from '@mantine/core';
import {FaTruck as TruckIcon} from 'react-icons/fa';
import {MdPerson as DriverIcon} from 'react-icons/md';

import {getFullName} from 'Shared/Utilities/common.util';
import {renderDateTime, renderTripStatus} from 'Shared/Utilities/tableSchema';

const RouteOrderDetails = ({data}) => {

    return (
        <Group mb="md" direction="column">
            <Group>
                <Text size="lg" weight={600} mb={0}>
                    Order #: <Text color="blue" inherit component="span">{data.order_number}</Text>
                </Text>
                <Tooltip label="Status" withArrow>{renderTripStatus(data.status)}</Tooltip>

                <Tooltip label="Truck" withArrow>
                    <Badge variant="filled" radius="sm" color="teal" leftSection={<TruckIcon size={10}/>}>
                        {data.vehicle.name}
                    </Badge>
                </Tooltip>
                <Tooltip label="Driver" withArrow>
                    <Badge variant="filled" radius="sm" color="grape" leftSection={<DriverIcon size={10}/>}>
                        {getFullName(data.member.first_name, data.member.last_name)}
                    </Badge>
                </Tooltip>
            </Group>
            <Group>
                <Group>
                    <Text size="sm" weight={500}>Planned start time:</Text>
                    {renderDateTime(data.planned_origin_departure_time)}
                </Group>
                <Group>
                    <Text size="sm" weight={500}>Planned end time:</Text>
                    {renderDateTime(data.planned_eta_destination, {color: 'red'})}
                </Group>
            </Group>
        </Group>
    )
};

export default RouteOrderDetails;