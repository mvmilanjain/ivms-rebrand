import {useState} from 'react';
import {ActionIcon, Anchor, Button, Divider, Group, Popover, Radio, RadioGroup, TextInput} from '@mantine/core';
import {useSetState} from '@mantine/hooks';
import {BiFilterAlt as FilterIcon} from 'react-icons/bi';

const StringFilter = ({column: {filterValue, preFilteredRows, setFilter}}) => {
    const [opened, setOpened] = useState(false);
    const [state, setState] = useSetState(filterValue || {operator: 'cont', value: ''});

    const toggleFilter = (e) => {
        e.stopPropagation();
        setOpened(o => !o);
    };

    const handleClose = () => {
        setState(filterValue || {operator: 'cont', value: ''});
        setOpened(false);
    };

    const handleClear = (e) => {
        e.stopPropagation();
        setFilter(undefined);
        setState({operator: 'cont', value: ''});
        setOpened(false);
    };

    const handleApply = (e) => {
        e.stopPropagation();
        setFilter(state);
        setOpened(false);
    };

    return (
        <Popover
            target={
                <ActionIcon
                    variant={filterValue ? "light" : "hover"}
                    color={filterValue ? "blue" : "gray"}
                    onClick={toggleFilter}
                >
                    <FilterIcon/>
                </ActionIcon>
            }
            opened={opened} onClose={handleClose}
            position="bottom" placement="end"
            transition="scale-y"
            withArrow withCloseButton
        >
            <RadioGroup
                description="Select your option"
                mb="md" variant="vertical" size="sm"
                value={state.operator}
                onClick={e => e.stopPropagation()}
                onChange={o => setState({operator: o})}
            >
                <Radio value="cont">Contains</Radio>
                <Radio value="not_cont">Does not contain</Radio>
                <Radio value="start">Starts with</Radio>
                <Radio value="end">Ends with</Radio>
                <Radio value="eq">Equals</Radio>
                <Radio value="not_eq">Not equal</Radio>
            </RadioGroup>
            <Divider mb="md"/>
            <TextInput
                placeholder="Enter filter string..."
                mb="md" autoFocus value={state.value}
                onClick={e => e.stopPropagation()}
                onChange={e => setState({value: e.target.value})}
            />

            <Group position="apart">
                <Anchor component="button" color="gray" onClick={handleClear}>Clear</Anchor>
                <Button onClick={handleApply}>Apply</Button>
            </Group>
        </Popover>
    );
};

export default StringFilter;