import {useNotifications} from '@mantine/notifications';
import {FaRoute as DefaultIcon} from 'react-icons/fa';

import {useHttp} from 'Hooks';
import {getRoute, getRoutes} from 'Shared/Services';
import AsyncSelect from '../AsyncSelect';
import AsyncMultiSelect from '../AsyncMultiSelect';
import {useState} from "react";

const RouteSelect = (
    {
        optionLabelKey = 'route_code',
        value = null,
        limit = 50,
        icon,
        withIcon,
        onChange,
        isMulti,
        ...rest
    }
) => {
    const {requestHandler} = useHttp();
    const notifications = useNotifications();
    const [selectValues, setSelectedValues] = useState(value);
    const SelectComponent = isMulti ? AsyncMultiSelect : AsyncSelect;

    const fetchOptions = (searchText) => new Promise((resolve, reject) => {
        const params = {per_page: limit, filter: {route_code_cont: searchText}};
        requestHandler(getRoutes(params)).then(res => {
            const data = res.data;
            let options = data.map(item => ({value: item.id, label: item[optionLabelKey]}));
            if(isMulti && selectValues) {
                selectValues.forEach(item => !data.includes(item.id) && data.push(item));
                const selectValuesOption = selectValues.map(item => ({value: item.id, label: item[optionLabelKey]}));
                options = [...selectValuesOption, ...options];
            }
            resolve(options);
        }).catch(error => reject(error));
    });

    const getSelectedValue = () => {
        let result = null;
        if(!isMulti) {
            !!value && (result = {value: value.id, label: value[optionLabelKey]});
        } else {

        }
        return result;
    };

    const handleItemSelection = (selectedItem) => {
        let id = selectedItem || '';
        if (onChange) {
            if (id) {
                requestHandler(getRoute(id)).then(res => {
                    setSelectedValues(res.data);
                    onChange(res.data);
                }).catch(e => {
                    notifications.showNotification({
                        title: 'Error', color: 'red',
                        message: 'Not able to fetch selected route details. Something went wrong!!'
                    });
                    setSelectedValues(null);
                    onChange(null);
                });
            } else {
                setSelectedValues(null);
                onChange(null);
            }
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

export default RouteSelect;