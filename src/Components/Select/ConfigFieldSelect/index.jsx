import {useState} from 'react';

import {useHttp} from 'Hooks';
import {getConfigField} from 'Shared/Services';
import {CONFIG_FIELD_TYPE} from 'Shared/Utilities/constant';
import AsyncSelect from '../AsyncSelect';
import AsyncMultiSelect from '../AsyncMultiSelect';

const ConfigFieldSelect = (
    {
        optionLabelKey = 'name',
        fieldType = CONFIG_FIELD_TYPE.ROUTE_PLANNER_CONTRACTOR,
        value = null,
        limit = 50,
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
        const params = {per_page: limit, filter: {name_cont: searchText}};
        requestHandler(getConfigField(fieldType, params)).then(res => {
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

    const getSelectedValue = () => {
        let result = null;
        if(!isMulti) {
            !!selectValues && (result = {value: selectValues.id, label: selectValues[optionLabelKey]});
        } else {
            !!selectValues && (result = selectValues.map(item => ({
                value: item.id,
                label: item[optionLabelKey]
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
            limit={limit}
            selectedValue={getSelectedValue()}
            fetchOptions={fetchOptions}
            onSelection={handleItemSelection}
            {...rest}
        />
    );
};

export default ConfigFieldSelect;