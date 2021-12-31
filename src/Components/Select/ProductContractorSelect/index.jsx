import {useEffect, useState} from 'react';

import {useHttp} from 'Hooks';
import {getConfigField} from 'Shared/Services';
import {CONFIG_FIELD_TYPE} from 'Shared/Utilities/constant';
import AsyncSelect from '../AsyncSelect';
import AsyncMultiSelect from '../AsyncMultiSelect';

const ProductContractorSelect = (
    {
        optionLabelKey = 'name',
        value = null,
        limit = 50,
        icon,
        onChange,
        isMulti,
        routeList = [],
        ...rest
    }
) => {
    const {requestHandler} = useHttp();
    const [dataSource, setDataSource] = useState([]);
    const [selectValues, setSelectedValues] = useState(value);
    const SelectComponent = isMulti ? AsyncMultiSelect : AsyncSelect;

    useEffect(() => {
        if (value) {
            setSelectedValues(value);
        } else {
            setSelectedValues(isMulti ? [] : null);
        }
    }, [value]);

    const fetchOptions = (searchText) => new Promise((resolve, reject) => {
        const filter = {id_in: routeList.map(item => item.contractor_id), name_cont: searchText};
        if (!filter.id_in.length) {
            setDataSource([]);
            resolve([]);
        } else {
            const params = {per_page: 500, page_no: 1, filter};
            requestHandler(getConfigField(CONFIG_FIELD_TYPE.ROUTE_PLANNER_CONTRACTOR, params)).then(res => {
                const data = res.data;
                let options = data.map(item => ({value: item.id, label: item[optionLabelKey]}));
                if (isMulti && selectValues) {
                    selectValues.forEach(item => !data.includes(item.id) && data.push(item));
                    const selectValuesOption = selectValues.map(item => ({
                        value: item.id,
                        label: item[optionLabelKey]
                    }));
                    options = [...selectValuesOption, ...options];
                }
                setDataSource(data);
                resolve(options);
            }).catch(error => {
                setDataSource([]);
                reject(error);
            });
        }
    });

    const getSelectedValue = () => isMulti ?
        (selectValues ? selectValues.map(item => ({value: item.id, label: item[optionLabelKey]})) : []) :
        (selectValues ? ({value: selectValues.id, label: selectValues[optionLabelKey]}) : null);

    const handleItemSelection = (selectedItem) => {
        if (onChange) {
            let result;
            if (!isMulti) {
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
            icon={icon}
            limit={limit}
            selectedValue={getSelectedValue()}
            fetchOptions={fetchOptions}
            onSelection={handleItemSelection}
            {...rest}
        />
    );
};

export default ProductContractorSelect;