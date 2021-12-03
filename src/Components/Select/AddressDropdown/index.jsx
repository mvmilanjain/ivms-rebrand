import {useState} from 'react';
import {FaAddressBook as DefaultIcon} from 'react-icons/fa';

import {AsyncSelect} from 'Components';
import {useHttp} from 'Hooks';
import {getAddresses} from 'Shared/Services';

const getAddressLabel = (address) => address ? (address.name ? address.name : address.address1) : '';

const AddressDropdown = (
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
        const params = {
            per_page: limit, sort: 'created_at.desc',
            filter: {name_cont: searchText, address1_cont: searchText}
        };
        requestHandler(getAddresses(params)).then(res => {
            setDataSource(res.data);
            const options = res.data.map(item => ({id: item.id, value: getAddressLabel(item)}));
            resolve(options);
        }).catch(error => {
            setDataSource([]);
            reject(error);
        });
    });

    const handleItemSelection = (selectedItem) => {
        let result = null;
        if (selectedItem) {
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
            value={value && getAddressLabel(value)}
            selectedValue={value ? {id: value.id, value: getAddressLabel(value)} : null}
            fetchOptions={fetchOptions}
            onSelection={handleItemSelection}
            error={error}
        />
    );
};

export default AddressDropdown;