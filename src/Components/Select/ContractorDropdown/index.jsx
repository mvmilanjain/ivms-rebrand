import {forwardRef, useState} from 'react';

import {AsyncSelect} from 'Components';
import {useHttp} from 'Hooks';
import {getConfigField} from 'Shared/Services';
import {CONFIG_FIELD_TYPE} from 'Shared/Utilities/constant';

const ContractorDropdown = forwardRef((
    {
        optionLabelKey = 'name',
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
        requestHandler(getConfigField(CONFIG_FIELD_TYPE.ROUTE_PLANNER_CONTRACTOR, params)).then(res => {
            setDataSource(res.data);
            const options = res.data.map(item => ({id: item.id, value: item[optionLabelKey]}));
            resolve(options);
        }).catch(error => {
            setDataSource([]);
            reject(error);
        });
    });

    const handleItemSelection = (selectedItem) => {
        let result = selectedItem ? dataSource.find(item => item.id === selectedItem.id) || null : null;
        onChange && onChange(result);
    };

    return (
        <AsyncSelect
            ref={ref}
            placeholder={rest.placeholder || (rest.label && `Select ${rest.label.toLowerCase()}`)}
            limit={limit}
            value={value && value[optionLabelKey]}
            selectedValue={value ? {id: value.id, value: value[optionLabelKey]} : null}
            fetchOptions={fetchOptions}
            onSelection={handleItemSelection}
            {...rest}
        />
    );
});

export default ContractorDropdown;