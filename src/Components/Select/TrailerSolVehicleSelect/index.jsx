import {useEffect, useState} from 'react';
import {FaTruck as DefaultIcon} from 'react-icons/fa';

import {useHttp} from 'Hooks';
import {getTrailerSolVehicles, getTrucks} from 'Shared/Services';
import AsyncSelect from '../AsyncSelect';
import AsyncMultiSelect from "../AsyncMultiSelect";

const TrailerSolVehicleSelect = (
    {
        optionLabelKey = 'Vehicle',
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

    const fetchOptions = () => new Promise((resolve, reject) => {
        requestHandler(getTrailerSolVehicles()).then(res => {
            const trailerSolVehicleList = [];
            for (const vehicle in res) {
                res[vehicle].hasOwnProperty('ID') && trailerSolVehicleList.push(res[vehicle]);
            }
            const data = trailerSolVehicleList;
            let options = data.map(item => ({value: item.ID, label: item[optionLabelKey]}));
            if(isMulti && selectValues) {
                selectValues.forEach(item => !data.includes(item.ID) && data.push(item));
                const selectValuesOption = selectValues.map(item => ({value: item.ID, label: item[optionLabelKey]}));
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
        (selectValues ? selectValues.map(item => ({value: item.ID, label: item[optionLabelKey]})) : []) :
        (selectValues ? ({value: selectValues.ID, label: selectValues[optionLabelKey]}) : null);

    const handleItemSelection = (selectedItem) => {
        if(onChange) {
            let result;
            if(!isMulti) {
                result = selectedItem ? dataSource.find(item => item.ID === selectedItem) || null : null;
            } else {
                result = selectedItem ? dataSource.filter(item => selectedItem.includes(item.ID)) : [];
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

export default TrailerSolVehicleSelect;
