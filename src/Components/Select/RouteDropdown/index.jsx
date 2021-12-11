import {forwardRef} from 'react';
import {useNotifications} from '@mantine/notifications';
import {FaRoute as DefaultIcon} from 'react-icons/fa';

import {AsyncSelect} from 'Components';
import {useHttp} from 'Hooks';
import {getRoute, getRoutes} from 'Shared/Services';

const RouteDropdown = forwardRef((
    {
        optionLabelKey = 'route_code',
        value = null,
        limit = 50,
        icon,
        withIcon,
        onChange,
        ...rest
    }, ref
) => {
    const {requestHandler} = useHttp();
    const notifications = useNotifications();
    const fetchOptions = (searchText) => new Promise((resolve, reject) => {
        const params = {per_page: limit, filter: {route_code_cont: searchText}};
        requestHandler(getRoutes(params)).then(res => {
            const options = res.data.map(item => ({id: item.id, value: item[optionLabelKey]}));
            resolve(options);
        }).catch(error => reject(error));
    });

    const handleItemSelection = (selectedItem) => {
        let id = selectedItem ? selectedItem.id : '';
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
            ref={ref}
            placeholder={rest.placeholder || (rest.label && `Select ${rest.label.toLowerCase()}`)}
            icon={icon || (withIcon && <DefaultIcon/>)}
            limit={limit}
            value={value && value[optionLabelKey]}
            selectedValue={value ? {id: value.id, value: value[optionLabelKey]} : null}
            fetchOptions={fetchOptions}
            onSelection={handleItemSelection}
            {...rest}
        />
    );
});

export default RouteDropdown;