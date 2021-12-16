import {useEffect, useState} from 'react';
import {FaTrailer as DefaultIcon} from 'react-icons/fa';

import {useHttp} from 'Hooks';
import {getTrailers} from 'Shared/Services';
import AsyncSelect from '../AsyncSelect';
import AsyncMultiSelect from "../AsyncMultiSelect";

const TrailerSelect = (
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

    useEffect(() => {
        if(value) {
            setSelectedValues(value);
        } else {
            setSelectedValues(isMulti ? [] : null);
        }
    }, [value]);

    const fetchOptions = (searchText) => new Promise((resolve, reject) => {
        const params = {per_page: limit, filter: {name_cont: searchText}};
        requestHandler(getTrailers(params)).then(res => {
            const data = res.data;
            let options = data.map(item => ({value: item.id, label: item[optionLabelKey]}));
            if(isMulti && selectValues) {
                selectValues.forEach(item => !data.includes(item.id) && data.push(item));
                const selectValuesOption = selectValues.map(item => ({value: item.id, label: item[optionLabelKey]}));
                options = [...selectValuesOption, ...options];
            }
            setDataSource(data);
            resolve(options);
        }).catch(error => {
            setDataSource([]);
            reject(error);
        });
    });

    const getSelectedValue = () => isMulti ?
        (selectValues ? selectValues.map(item => ({value: item.id, label: item[optionLabelKey]})) : []) :
        (selectValues ? ({value: selectValues.id, label: selectValues[optionLabelKey]}) : null);

    const handleItemSelection = (selectedItem) => {
        if(onChange) {
            let result;
            if(!isMulti) {
                result = selectedItem ? dataSource.find(item => item.id === selectedItem) || null : null;
            } else {
                result = selectedItem ? dataSource.filter(item => selectedItem.includes(item.id)) : [];
            }
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

export default TrailerSelect;
