import {useState} from 'react';

import {useHttp} from 'Hooks';
import {getConfigField} from 'Shared/Services';
import {CONFIG_FIELD_TYPE} from 'Shared/Utilities/constant';
import AsyncSelect from '../AsyncSelect';

const ConfigFieldSelect = (
    {
        optionLabelKey = 'name',
        fieldType = CONFIG_FIELD_TYPE.ROUTE_PLANNER_CONTRACTOR,
        value = null,
        limit = 50,
        onChange,
        ...rest
    }, ref
) => {
    const {requestHandler} = useHttp();
    const [dataSource, setDataSource] = useState([]);

    const fetchOptions = (searchText) => new Promise((resolve, reject) => {
        const params = {per_page: limit, filter: {name_cont: searchText}};
        requestHandler(getConfigField(fieldType, params)).then(res => {
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
            ref={ref}
            placeholder={rest.placeholder || (rest.label && `Select ${rest.label.toLowerCase()}`)}
            limit={limit}
            selectedValue={value ? {value: value.id, label: value[optionLabelKey]} : null}
            fetchOptions={fetchOptions}
            onSelection={handleItemSelection}
            {...rest}
        />
    );
};

export default ConfigFieldSelect;