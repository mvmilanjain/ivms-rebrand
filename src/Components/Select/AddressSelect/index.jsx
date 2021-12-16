import {useState} from 'react';
import {FaAddressBook as DefaultIcon} from 'react-icons/fa';

import {useHttp} from 'Hooks';
import {getAddresses} from 'Shared/Services';
import AsyncSelect from '../AsyncSelect';
import AsyncMultiSelect from '../AsyncMultiSelect';

const getAddressLabel = (address) => address ? (address.name ? address.name : address.address1) : '';

const AddressSelect = (
    {
        optionLabelKey = 'name',
        value = null,
        limit = 50,
        icon,
        withIcon,
        isMulti,
        onChange,
        ...rest
    }
) => {
    const {requestHandler} = useHttp();
    const [dataSource, setDataSource] = useState([]);
    const [selectValues, setSelectedValues] = useState(value);
    const SelectComponent = isMulti ? AsyncMultiSelect : AsyncSelect;

    const fetchOptions = (searchText) => new Promise((resolve, reject) => {
        const params = {
            per_page: limit, sort: 'created_at.desc',
            filter: {name_cont: searchText, address1_cont: searchText, m: 'or'}
        };
        requestHandler(getAddresses(params)).then(res => {
            const data = res.data;
            let options = data.map(item => ({value: item.id, label: getAddressLabel(item)}));
            if(isMulti && selectValues) {
                selectValues.forEach(item => !data.includes(item.id) && data.push(item));
                const selectValuesOption = selectValues.map(item => ({value: item.id, label: getAddressLabel(item)}));
                options = [...selectValuesOption, ...options];
            }
            setDataSource(data);
            resolve(options);
        }).catch(error => {
            setDataSource([]);
            reject(error);
        });
    });

    const getSelectedValue = () => {
        let result = null;
        if(!isMulti) {
            !!selectValues && (result = {value: selectValues.id, label: getAddressLabel(selectValues)});
        } else {
            !!selectValues && (result = selectValues.map(item => ({
                value: item.id,
                label: getAddressLabel(item)
            })));
        }
        return result;
    };

    const handleItemSelection = (selectedItem) => {
        if(onChange) {
            let result;
            if(!isMulti) {
                result = selectedItem ? dataSource.find(item => item.id === selectedItem) || null : null;
            } else {
                result = selectedItem ? dataSource.filter(item => selectedItem.includes(item.id)) : [];
            }
            setSelectedValues(result);
            onChange(result);
        }
    };

    return (
        <SelectComponent
            placeholder={rest.placeholder || (rest.label && `Select ${rest.label.toLowerCase()}`)}
            icon={icon || (withIcon && <DefaultIcon/>)}
            limit={limit}
            selectedValue={getSelectedValue()}
            fetchOptions={fetchOptions}
            onSelection={handleItemSelection}
            {...rest}
        />
    );
};

export default AddressSelect;