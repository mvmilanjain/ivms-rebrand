import {useState} from 'react';
import {MdPerson as DefaultIcon} from 'react-icons/md';

import {useHttp} from 'Hooks';
import {getMembers} from 'Shared/Services';
import AsyncSelect from '../AsyncSelect';
import AsyncMultiSelect from "../AsyncMultiSelect";

const getFullName = (member) => `${!!member.first_name ? member.first_name : ''} ${!!member.last_name ? member.last_name : ''}`.trim();

const MemberSelect = (
    {
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
            per_page: limit, filter: {
                first_name_cont: searchText, last_name_cont: searchText, m: 'or'
            }
        };
        requestHandler(getMembers(params)).then(res => {
            const data = res.data;
            let options = data.map(item => ({value: item.id, label: getFullName(item)}));
            if(isMulti && selectValues) {
                selectValues.forEach(item => !data.includes(item.id) && data.push(item));
                const selectValuesOption = selectValues.map(item => ({value: item.id, label: getFullName(item)}));
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
            !!selectValues && (result = {value: selectValues.id, label: getFullName(selectValues)});
        } else {
            !!selectValues && (result = selectValues.map(item => ({
                value: item.id,
                label: getFullName(item)
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

export default MemberSelect;
