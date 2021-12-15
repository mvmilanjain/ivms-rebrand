import {useState} from 'react';
import {Tabs} from '@mantine/core';
import {FaTrailer as TrailerIcon, FaTruck as TruckIcon} from 'react-icons/fa';

import {ContentArea} from 'Components';
import Truck from './Truck';
import Trailer from './Trailer';

const Vehicle = ({history, location}) => {
    const [tabIndex, setTabIndex] = useState(location.state ? location.state.tabIndex : 0);
    const [initialTabIndex] = useState(location.state ? location.state.tabIndex : 0)

    return (
        <ContentArea>
            <Tabs onTabChange={setTabIndex} tabIndex={tabIndex} initialTab={initialTabIndex}>
                <Tabs.Tab label="Truck" icon={<TruckIcon/>}>
                    {tabIndex === 0 && <Truck history={history}/>}
                </Tabs.Tab>
                <Tabs.Tab label="Trailer" icon={<TrailerIcon/>}>
                    {tabIndex === 1 && <Trailer history={history}/>}
                </Tabs.Tab>
            </Tabs>
        </ContentArea>
    );
};

export default Vehicle;