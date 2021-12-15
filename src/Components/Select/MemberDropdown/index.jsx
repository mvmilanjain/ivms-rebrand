import {forwardRef, useState} from 'react';
import {FaAddressBook as DefaultIcon} from 'react-icons/fa';

import {AsyncSelect} from 'Components';
import {useHttp} from 'Hooks';
import {getMembers} from 'Shared/Services';

const getFullName = (member) => `${!!member.first_name ? member.first_name : ''} ${!!member.last_name ? member.last_name : ''}`.trim();

const MemberDropdown = forwardRef((
    {
        value = null,
        limit = 50,
        icon,
        withIcon,
        onChange,
        ...rest
    }, ref
) => {
    const {requestHandler} = useHttp();
    const [dataSource, setDataSource] = useState([]);

    const fetchOptions = (searchText) => new Promise((resolve, reject) => {
        const params = {
            per_page: limit, filter: {
                first_name_cont: searchText, last_name_cont: searchText, m: 'or'
            }
        };
        requestHandler(getMembers(params)).then(res => {
            setDataSource(res.data);
            const options = res.data.map(item => ({id: item.id, value: getFullName(item)}));
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
            icon={icon || (withIcon && <DefaultIcon/>)}
            limit={limit}
            value={value && getFullName(value)}
            selectedValue={value ? {id: value.id, value: getFullName(value)} : null}
            fetchOptions={fetchOptions}
            onSelection={handleItemSelection}
            {...rest}
        />
    );
});

export default MemberDropdown;
