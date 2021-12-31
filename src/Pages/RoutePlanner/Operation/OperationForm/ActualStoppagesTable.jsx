import {ActionIcon, Button, Group, NumberInput, Text, Textarea} from "@mantine/core";
import {
    MdArrowDownward as MoveDownIcon,
    MdArrowUpward as MoveUpIcon,
    MdOutlineAddLocationAlt as AddStopIcon,
    MdOutlineDelete as DeleteIcon
} from "react-icons/md";
import {DateTimePicker, ReactTable} from "../../../../Components";
import {renderDateTime, renderDistance, renderTextWithTooltip} from "../../../../Shared/Utilities/tableSchema";
import {getAddressLabel, getNumberRoundToOneDecimal} from "../../../../Shared/Utilities/common.util";
import get from "lodash/get";
import AddStoppageForm from "./AddStoppageForm";
import {Operation} from "../../../../Shared/Models";
import {useModals} from "@mantine/modals";

const ActualStoppagesTable = ({data, register, onFieldChange, onStoppageChange}) => {
    const modals = useModals();

    const renderStoppageActions = ({row}) => {
        const {index} = row;
        const activeStoppages = data.route_order_actual_info.route_order_actual_stop_infos;

        return (
            <Group spacing={0}>
                <ActionIcon color="red" onClick={() => handleDeleteStoppage(index)}><DeleteIcon size={20}/></ActionIcon>
                <ActionIcon onClick={() => handleMoveStoppage(index, 'UP')} disabled={index === 0}>
                    <MoveUpIcon size={20}/>
                </ActionIcon>
                <ActionIcon
                    disabled={index === activeStoppages.length - 1}
                    onClick={() => handleMoveStoppage(index, 'DOWN')}
                >
                    <MoveDownIcon size={20}/>
                </ActionIcon>
            </Group>
        );
    };

    const handleAddStoppage = () => {
        const id = modals.openModal({
            title: 'Add Stoppage',
            children: <AddStoppageForm
                onConfirm={(stoppage) => {
                    modals.closeModal(id);
                    const operation = new Operation(data);
                    operation.route_order_actual_info.addStoppage(stoppage);
                    onStoppageChange(operation);
                }}
            />
        });
    };

    const handleDeleteStoppage = (index) => {
        const operation = new Operation(data);
        operation.route_order_actual_info.removeStoppage(index);
        onStoppageChange(operation);
    };

    const handleMoveStoppage = (index, direction) => {
        const operation = new Operation(data);
        operation.route_order_actual_info.moveStoppage(index, direction);
        onStoppageChange(operation);
    };

    const handleActualStoppageValueChange = (value, index, key) => {
        const operation = new Operation(data);
        operation.route_order_actual_info.route_order_actual_stop_infos[index][key] = value;
        onFieldChange(operation);
    };

    return (
        <Group direction="column" grow spacing="sm">
            <Group position="apart">
                <Text size="lg" weight={500}>Actual Stoppages</Text>
                <Button variant="outline" leftIcon={<AddStopIcon/>} onClick={handleAddStoppage}>
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
                        accessor: 'actual_arrival_time', Header: 'Actual Arrival', cellMinWidth: 184,
                        Cell: ({row, value}) => <DateTimePicker
                            {...register(`route_order_actual_info.route_order_actual_stop_infos[${row.index}].actual_arrival_time`)}
                            placeholder="Select actual arrival"
                            value={value ? new Date(value) : null}
                            onChange={val => handleActualStoppageValueChange(val, row.index, 'actual_arrival_time')}
                        />
                    },
                    {
                        accessor: 'stop_duration', Header: 'Stop duration', cellMinWidth: 128,
                        Cell: ({row}) => <NumberInput
                            {...register(`route_order_actual_info.route_order_actual_stop_infos[${row.index}].stop_duration`)}
                            min={0} precision={1} step={0.5}
                            onChange={val => handleActualStoppageValueChange(val, row.index, 'stop_duration')}
                        />
                    },
                    {
                        accessor: 'note',
                        Header: 'Reason for late',
                        cellMinWidth: 200,
                        Cell: ({row}) => <Textarea
                            {...register(`route_order_actual_info.route_order_actual_stop_infos[${row.index}].note`)}
                            placeholder="Enter notes"
                            onChange={e => handleActualStoppageValueChange(e.target.value, row.index, 'note')}
                        />
                    },
                    {accessor: 'id', Header: 'Actions', cellWidth: 120, Cell: renderStoppageActions}
                ]}
                data={get(data, 'route_order_actual_info.route_order_actual_stop_infos', []).filter(stop => !stop._destroy)}
                pagination={get(data, 'route_order_actual_info.route_order_actual_stop_infos', []).length > 10}
            />
        </Group>
    );
};

export default ActualStoppagesTable;