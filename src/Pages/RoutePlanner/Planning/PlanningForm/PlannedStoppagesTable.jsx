import {get} from 'lodash';
import {ActionIcon, Button, Group, NumberInput, Text} from '@mantine/core';
import {useModals} from '@mantine/modals';
import {
    MdArrowDownward as MoveDownIcon,
    MdArrowUpward as MoveUpIcon,
    MdOutlineAddLocationAlt as AddStopIcon,
    MdOutlineDelete as DeleteIcon
} from 'react-icons/md';

import {ReactTable} from 'Components';
import {renderDateTime, renderDistance, renderTextWithTooltip} from 'Shared/Utilities/tableSchema';
import {getAddressLabel, getNumberRoundToOneDecimal} from 'Shared/Utilities/common.util';
import {Plan} from 'Shared/Models';
import AddStoppageForm from './AddStoppageForm';

const PlannedStoppagesTable = ({data, register, onFieldChange, onStoppageChange}) => {
    const modals = useModals();

    const renderStoppageActions = ({row}) => {
        const {index, original: stop} = row;
        const activeStoppages = data.route_order_stoppages.filter(stop => !stop._destroy);
        const isSource = (data.route_id && data.route.source === stop.address_id && index === 0);
        const isDestination = (data.route_id && data.route.destination === stop.address_id && index === activeStoppages.length - 1);

        return (isSource || isDestination) ? null : <Group spacing={0}>
            <ActionIcon color="red" onClick={() => handleDeleteStoppage(index)}><DeleteIcon size={20}/></ActionIcon>
            <ActionIcon onClick={() => handleMoveStoppage(index, 'UP')} disabled={index === 0 ||
                (index === 1 && data.route_id && activeStoppages[0].address_id === data.route.source)
            }>
                <MoveUpIcon size={20}/>
            </ActionIcon>
            <ActionIcon onClick={() => handleMoveStoppage(index, 'DOWN')} disabled={
                (index === activeStoppages.length - 1) || (
                    index === activeStoppages.length - 2 && data.route_id &&
                    activeStoppages[activeStoppages.length - 1].address_id === data.route.destination
                )
            }>
                <MoveDownIcon size={20}/>
            </ActionIcon>
        </Group>;
    };

    const handleStopDurationChange = (stopDuration, index) => {
        const plan = new Plan(data);
        plan.route_order_stoppages[index].stop_duration = Number(stopDuration);
        plan.updateDistanceAndTime();
        onFieldChange(plan);
    };

    const handleAddStoppage = () => {
        const id = modals.openModal({
            title: 'Add Stoppage',
            children: <AddStoppageForm
                onConfirm={(stoppage) => {
                    modals.closeModal(id);
                    const plan = new Plan(data);
                    plan.addStoppage(stoppage);
                    onStoppageChange(plan);
                }}
            />
        });
    };

    const handleDeleteStoppage = (index) => {
        const plan = new Plan(data);
        plan.removeStoppage(index);
        onStoppageChange(plan);
    };

    const handleMoveStoppage = (index, direction) => {
        const plan = new Plan(data);
        plan.moveStoppage(index, direction);
        onStoppageChange(plan);
    };

    return (
        <Group direction="column" grow spacing="sm">
            <Group position="apart">
                <Text size="lg" weight={500}>Planned Stoppages</Text>
                <Button
                    disabled={!data.route_id}
                    variant="outline" leftIcon={<AddStopIcon/>}
                    onClick={handleAddStoppage}
                >
                    Add Stoppage
                </Button>
            </Group>
            <ReactTable
                columns={[
                    {accessor: 'position', Header: '#', cellWidth: 40},
                    {
                        accessor: 'address', Header: 'Address',
                        Cell: ({value}) => renderTextWithTooltip(getAddressLabel(value))
                    },
                    {
                        accessor: 'distance', Header: 'Distance', align: 'center',
                        Cell: ({value}) => renderDistance(getNumberRoundToOneDecimal(value))
                    },
                    {
                        accessor: 'estimated_arrival_time', Header: 'Estimated Arrival',
                        Cell: ({value}) => renderDateTime(value)
                    },
                    {
                        accessor: 'estimated_departure_time', Header: 'Estimated Departure',
                        Cell: ({value}) => renderDateTime(value)
                    },
                    {
                        accessor: 'stop_duration', Header: 'Stop duration', cellWidth: 128,
                        Cell: ({row}) => <NumberInput
                            {...register(`route_order_stoppages[${row.index}].stop_duration`)}
                            min={0} precision={1} step={0.5}
                            onChange={val => handleStopDurationChange(val, row.index)}
                        />
                    },
                    {accessor: 'id', Header: 'Actions', cellWidth: 120, Cell: renderStoppageActions}
                ]}
                data={get(data, 'route_order_stoppages', []).filter(stop => !stop._destroy)}
                // pagination={
                //     get(data, 'route_order_stoppages', [])
                //         .filter(stop => !stop._destroy).length > 10
                // }
            />
        </Group>
    );
};

export default PlannedStoppagesTable;