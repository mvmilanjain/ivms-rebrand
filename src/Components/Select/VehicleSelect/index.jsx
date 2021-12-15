import {useState} from 'react';
import {FaTruck as DefaultIcon} from 'react-icons/fa';

import {useHttp} from 'Hooks';
import {getTrucks} from 'Shared/Services';
import AsyncSelect from '../AsyncSelect';

const VehicleSelect = (
    {
        optionLabelKey = 'name',
        value = null,
        limit = 50,
        icon,
        withIcon,
        onChange,
        ...rest
    }
) => {
    const {requestHandler} = useHttp();
    const [dataSource, setDataSource] = useState([]);

    const fetchOptions = (searchText) => new Promise((resolve, reject) => {
        const params = {per_page: limit, filter: {name_cont: searchText}};
        requestHandler(getTrucks(params)).then(res => {
            setDataSource(res.data);
            const options = res.data.map(item => ({value: item.id, label: item[optionLabelKey]}));
            resolve(options);
        }).catch(error => {
            setDataSource([]);
            reject(error);
        });
    });

    const handleItemSelection = (selectedItem) => {
        let result = selectedItem ? dataSource.find(item => item.id === selectedItem) || null : null;
        onChange && onChange(result);
    };

    return (
        <AsyncSelect
            placeholder={rest.placeholder || (rest.label && `Select ${rest.label.toLowerCase()}`)}
            icon={icon || (withIcon && <DefaultIcon/>)}
            limit={limit}
            selectedValue={value ? {value: value.id, label: value[optionLabelKey]} : null}
            fetchOptions={fetchOptions}
            onSelection={handleItemSelection}
            {...rest}
        />
    );
};

export default VehicleSelect;
