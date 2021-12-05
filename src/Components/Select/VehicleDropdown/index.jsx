import {useState} from 'react';
import {FaTruck as DefaultIcon} from 'react-icons/fa';

import {AsyncSelect} from 'Components';
import {useHttp} from 'Hooks';
import {getTrucks} from 'Shared/Services';

const VehicleDropdown = (
    {
        optionLabelKey = 'name',
        value = null,
        limit = 50,
        icon,
        withIcon,
        onSelection,
        ...rest
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
            placeholder={rest.placeholder || (rest.label && `Select ${rest.label.toLowerCase()}`)}
            icon={icon || (withIcon && <DefaultIcon/>)}
            limit={limit}
            value={value && value[optionLabelKey]}
            selectedValue={value ? {id: value.id, value: value[optionLabelKey]} : null}
            fetchOptions={fetchOptions}
            onSelection={handleItemSelection}
            {...rest}
        />
    );
};

export default VehicleDropdown;
