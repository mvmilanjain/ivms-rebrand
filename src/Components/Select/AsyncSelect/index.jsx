import {useEffect, useState} from 'react';
import isNil from 'lodash/isNil';
import {Paper, Select, Text} from '@mantine/core';
import {useDebouncedValue} from '@mantine/hooks';

const LoadingOptions = () => (
    <Paper shadow="sm" padding="sm" withBorder style={{width: '100%'}}>
        <Text size="sm" color="dimmed">Loading options...</Text>
    </Paper>
);

const AsyncSelect = (
    {
        selectedValue,
        onSelection,
        fetchOptions,
        disabled,
        ...rest
    }
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
            fetchOptions(debouncedSearchText)
                .then(options => setOptions(options))
                .catch(e => setOptions([]))
                .finally(() => toggleLoading(false));
        }
    }, []);

    useEffect(() => {
        if ((isOpen && !isLoading && !options.length) || (isOpen && !isNil(debouncedSearchText))) {
            toggleLoading(true);
            fetchOptions(debouncedSearchText)
                .then(options => setOptions(options))
                .catch(e => setOptions([]))
                .finally(() => toggleLoading(false));
        }
    }, [isOpen, debouncedSearchText]);

    const handleSearchTextChange = query => setSearchText(query);

    const handleSelectItem = (item) => {
        setSelectedItem(item);
        onSelection && onSelection(item);
    };

    return (
        <Select
            searchable
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

export default AsyncSelect;