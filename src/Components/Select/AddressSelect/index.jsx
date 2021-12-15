import {useState} from 'react';
import {FaAddressBook as DefaultIcon} from 'react-icons/fa';

import {useHttp} from 'Hooks';
import {getAddresses} from 'Shared/Services';
import AsyncSelect from '../AsyncSelect';

const getAddressLabel = (address) => address ? (address.name ? address.name : address.address1) : '';

const AddressSelect = (
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
        const params = {
            per_page: limit, sort: 'created_at.desc',
            filter: {name_cont: searchText, address1_cont: searchText, m: 'or'}
        };
        requestHandler(getAddresses(params)).then(res => {
            setDataSource(res.data);
            const options = res.data.map(item => ({value: item.id, label: getAddressLabel(item)}));
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
            selectedValue={value ? {value: value.id, label: getAddressLabel(value)} : null}
            fetchOptions={fetchOptions}
            onSelection={handleItemSelection}
            {...rest}
        />
    );
};

export default AddressSelect;