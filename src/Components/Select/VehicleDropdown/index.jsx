import {useState} from 'react';
import {FaTruck as DefaultIcon} from 'react-icons/fa';

import {AsyncSelect} from 'Components';
import {useHttp} from 'Hooks';
import {getTrucks} from 'Shared/Services';

const VehicleDropdown = (
    {
        label = '',
        placeholder = '',
        optionLabelKey = 'name',
        value = null,
        limit = 50,
        icon,
        showIcon,
        onSelection,
        error
    }
) => {
    const {requestHandler} = useHttp();
    const [dataSource, setDataSource] = useState([]);

    const fetchOptions = (searchText) => new Promise((resolve, reject) => {
        const params = {per_page: limit, filter: {name_cont: searchText}};
        requestHandler(getTrucks(params)).then(res => {
            setDataSource(res.data);
            const options = res.data.map(item => ({id: item.id, value: item[optionLabelKey]}));
            resolve(options);
        }).catch(error => {
            setDataSource([]);
            reject(error);
        });
    });

    const handleItemSelection = (selectedItem) => {
        let result = null;
        if(selectedItem) {
            result = dataSource.find(item => item.id === selectedItem.id) || null;
        }
        onSelection && onSelection(result);
    };

    return (
        <AsyncSelect
            label={label}
            placeholder={placeholder || `Select ${label}`}
            icon={icon || (showIcon && <DefaultIcon/>)}
            limit={limit}
            value={value && value[optionLabelKey]}
            selectedValue={value ? {id: value.id, value: value[optionLabelKey]} : null}
            fetchOptions={fetchOptions}
            onSelection={handleItemSelection}
            error={error}
        />
    );
};

export default VehicleDropdown;
