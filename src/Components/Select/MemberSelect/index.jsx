import {useState} from 'react';
import {MdPerson as DefaultIcon} from 'react-icons/md';

import {useHttp} from 'Hooks';
import {getMembers} from 'Shared/Services';
import AsyncSelect from '../AsyncSelect';

const getFullName = (member) => `${!!member.first_name ? member.first_name : ''} ${!!member.last_name ? member.last_name : ''}`.trim();

const MemberSelect = (
    {
        value = null,
        limit = 50,
        icon,
        withIcon,
        onChange,
        ...rest
    }
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
            const options = res.data.map(item => ({value: item.id, label: getFullName(item)}));
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
            placeholder={rest.placeholder || (rest.label && `Select ${rest.label.toLowerCase()}`)}
            icon={icon || (withIcon && <DefaultIcon/>)}
            limit={limit}
            selectedValue={value ? {value: value.id, label: getFullName(value)} : null}
            fetchOptions={fetchOptions}
            onSelection={handleItemSelection}
            {...rest}
        />
    );
};

export default MemberSelect;
