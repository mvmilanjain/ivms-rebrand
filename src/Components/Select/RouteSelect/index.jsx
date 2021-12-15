import {useNotifications} from '@mantine/notifications';
import {FaRoute as DefaultIcon} from 'react-icons/fa';

import AsyncSelect from '../AsyncSelect';
import {useHttp} from 'Hooks';
import {getRoute, getRoutes} from 'Shared/Services';

const RouteSelect = (
    {
        optionLabelKey = 'route_code',
        value = null,
        limit = 50,
        icon,
        withIcon,
        onChange,
        ...rest
    }
) => {
    const {requestHandler} = useHttp();
    const notifications = useNotifications();
    const fetchOptions = (searchText) => new Promise((resolve, reject) => {
        const params = {per_page: limit, filter: {route_code_cont: searchText}};
        requestHandler(getRoutes(params)).then(res => {
            const options = res.data.map(item => ({value: item.id, label: item[optionLabelKey]}));
            resolve(options);
        }).catch(error => reject(error));
    });

    const handleItemSelection = (selectedItem) => {
        let id = selectedItem || '';
        if (onChange) {
            if (id) {
                requestHandler(getRoute(id)).then(res => {
                    onChange(res.data);
                }).catch(e => {
                    notifications.showNotification({
                        title: 'Error', color: 'red',
                        message: 'Not able to fetch selected route details. Something went wrong!!'
                    });
                    onChange(null);
                });
            } else {
                onChange(null);
            }
        }
    };

    return (
        <AsyncSelect
            placeholder={rest.placeholder || (rest.label && `Select ${rest.label.toLowerCase()}`)}
            icon={icon || (withIcon && <DefaultIcon/>)}
            limit={limit}
            selectedValue={value ? {value: value.id, label: value[optionLabelKey]} : null}
            fetchOptions={fetchOptions}
            onSelection={handleItemSelection}
            {...rest}
        />
    );
};

export default RouteSelect;