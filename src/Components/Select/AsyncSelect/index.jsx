import {forwardRef, useEffect, useState} from 'react';
import isNil from 'lodash/isNil';
import {ActionIcon, Autocomplete, Group, Loader} from '@mantine/core';
import {useDebouncedValue} from '@mantine/hooks';
import {Cross2Icon as ClearIcon} from '@modulz/radix-icons';

const RightSelection = ({isLoading, selectedItem, onClear, onClick}) => {
    return (
        <Group spacing={0} style={{backgroundColor: 'white'}} position="right">
            {selectedItem && <ActionIcon variant="transparent" onClick={onClear}><ClearIcon/></ActionIcon>}
            {isLoading && <Loader size={16}/>}
        </Group>
    );
}

const AsyncSelect = forwardRef((
    {
        value,
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
    const [searchText, setSearchText] = useState(value || '');
    const [selectedItem, setSelectedItem] = useState(selectedValue);
    const [debouncedSearchText] = useDebouncedValue(searchText, 300);

    useEffect(() => {
        setSearchText(value);
    }, [value])

    useEffect(() => {
        if (!isOpen) {
            if (selectedItem) {
                selectedItem.value !== searchText && setSearchText(selectedItem.value);
            } else {
                searchText && setSearchText('');
            }
        }
    }, [isOpen]);

    useEffect(() => {
        if ((isOpen && !isLoading && !options.length) || (isOpen && !isNil(debouncedSearchText))) {
            toggleLoading(true);
            fetchOptions(debouncedSearchText).then(options => {
                toggleLoading(false);
                setOptions(options);
            }).catch(error => {
                console.error(error);
                toggleLoading(false);
                setOptions([]);
            });
        }
    }, [isOpen, debouncedSearchText]);


    const handleDropDownClose = () => {
        toggleOpen(false);
    };

    const handleSearchTextChange = (query) => {
        setSearchText(query);
        toggleOpen(true);
    };

    const handleSelectItem = (item) => {
        setSelectedItem(item);
        onSelection && onSelection(item);
    };

    const handleClear = (e) => {
        e.stopPropagation();
        setSearchText('');
        setSelectedItem(null);
        onSelection(null);
    };

    return (
        <Autocomplete
            ref={ref}
            styles={{dropdown: {maxHeight: 200}}}
            transition="scale-y"
            rightSectionWidth={(isLoading && selectedItem) ? 72 : 36}
            rightSection={!disabled && <RightSelection
                isLoading={isLoading}
                selectedItem={selectedItem}
                onClear={handleClear}
            />}
            nothingFound={isLoading ? "Loading options..." : "No options"}
            onDropdownOpen={() => toggleOpen(true)}
            onDropdownClose={handleDropDownClose}
            data={options}
            value={searchText}
            onChange={handleSearchTextChange}
            onItemSubmit={handleSelectItem}
            disabled={disabled}
            {...rest}
        />
    );
});

export default AsyncSelect;
