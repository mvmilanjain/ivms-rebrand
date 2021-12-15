import {useEffect, useState} from 'react';
import isNil from 'lodash/isNil';
import {Paper, Select, Skeleton, Text} from '@mantine/core';
import {useDebouncedValue} from '@mantine/hooks';

const LoadingOptions = () => (
    <Paper shadow="sm" padding="sm" withBorder style={{width: '100%'}}>
        <Text size="sm" color="dimmed">Loading options...</Text>
    </Paper>
);

const AsyncMultiSelect = (
    {
        selectedValue,
        onSelection,
        fetchOptions,
        disabled,
        ...rest
    }, ref
) => {
    const [isOpen, toggleOpen] = useState(false);
    const [isLoading, toggleLoading] = useState(false);
    const [options, setOptions] = useState([]);
    const [selectedItem, setSelectedItem] = useState(selectedValue ? selectedValue.value : '');
    const [searchText, setSearchText] = useState(selectedValue ? selectedValue.label : '');
    const [debouncedSearchText] = useDebouncedValue(searchText, 300);

    useEffect(() => {
        if (selectedItem) {
            toggleLoading(true);
            fetchOptions(debouncedSearchText).then(options => {
                toggleLoading(false);
                setOptions(options);
            }).catch(error => {
                toggleLoading(false);
                setOptions([]);
            });
        }
    }, []);

    useEffect(() => {
        if ((isOpen && !isLoading && !options.length) || (isOpen && !isNil(debouncedSearchText))) {
            toggleLoading(true);
            fetchOptions(debouncedSearchText).then(options => {
                toggleLoading(false);
                setOptions(options);
            }).catch(error => {
                toggleLoading(false);
                setOptions([]);
            });
        }
    }, [isOpen, debouncedSearchText]);

    const handleSearchTextChange = query => setSearchText(query);

    const handleSelectItem = (item) => {
        setSelectedItem(item);
        onSelection && onSelection(item);
    };

    return (
        <Select
            ref={ref} searchable
            transition="scale-y"
            nothingFound="No options"
            onDropdownOpen={() => toggleOpen(true)}
            onDropdownClose={() => toggleOpen(false)}
            dropdownComponent={isLoading ? LoadingOptions : null}
            data={options}
            value={selectedItem}
            onSearchChange={handleSearchTextChange}
            onChange={handleSelectItem}
            disabled={disabled}
            {...rest}
        />
    );
};

export default AsyncMultiSelect;