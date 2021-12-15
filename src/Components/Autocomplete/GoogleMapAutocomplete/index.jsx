import {forwardRef, useEffect, useMemo, useState} from 'react';
import throttle from 'lodash/throttle';
import {Autocomplete, Loader} from '@mantine/core';
import {useDebouncedValue} from '@mantine/hooks';
import {MagnifyingGlassIcon} from '@modulz/radix-icons';

import {getPlaceDetails} from 'Shared/Services';

const autocompleteService = {current: null};

const GoogleMapAutocomplete = forwardRef(({onChange, ...rest}, ref) => {
    const [isLoading, toggleLoading] = useState(false);
    const [options, setOptions] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [debouncedSearchText] = useDebouncedValue(searchText, 300);

    useEffect(() => {
        if (!autocompleteService.current && window.google) {
            autocompleteService.current = new window.google.maps.places.AutocompleteService();
        }
        if (!autocompleteService.current) return undefined;

        if (!debouncedSearchText) {
            setOptions(selectedItem ? [selectedItem] : []);
            return undefined;
        }
        toggleLoading(true);
        getPlaceAutocompleteList({input: debouncedSearchText}, (result) => {
            toggleLoading(false);
            let newOptions = [];
            selectedItem && (newOptions = [selectedItem]);
            result && (newOptions = [...newOptions, ...result.map(item => ({...item, value: item.description}))]);
            setOptions(newOptions);
        });
    }, [debouncedSearchText]);

    useEffect(() => {
        if (selectedItem) {
            toggleLoading(true);
            getPlaceDetails(selectedItem.description).then(res => {
                onChange && onChange(res);
            }).catch(error => {
                console.error(error);
            }).finally(() => toggleLoading(false));
        }
    }, [selectedItem]);

    const getPlaceAutocompleteList = useMemo(() => throttle((request, callback) => {
        autocompleteService.current.getPlacePredictions(request, callback);
    }, 1000), []);

    const handleSearchTextChange = (query) => setSearchText(query);

    const handleSelectItem = (item) => setSelectedItem(item);

    return (
        <Autocomplete
            ref={ref}
            styles={{dropdown: {maxHeight: 200}}}
            transition="scale-y"
            icon={<MagnifyingGlassIcon/>}
            rightSectionWidth={36}
            rightSection={isLoading && <Loader size={16}/>}
            data={options}
            value={searchText}
            onChange={handleSearchTextChange}
            onItemSubmit={handleSelectItem}
            {...rest}
        />
    );
});

export default GoogleMapAutocomplete;