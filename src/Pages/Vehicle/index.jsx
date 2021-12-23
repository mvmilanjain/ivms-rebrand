import {useState} from 'react';
import {Tabs} from '@mantine/core';
import {FaTrailer as TrailerIcon, FaTruck as TruckIcon} from 'react-icons/fa';

import {ContentArea} from 'Components';
import Truck from './Truck';
import Trailer from './Trailer';

const Vehicle = ({history, match}) => {
    const [tabIndex, setTabIndex] = useState(Number(match.params.tabIndex) || 0);
    const [initialTabIndex] = useState(Number(match.params.tabIndex) || 0);

    const handleTabChange = (index) => {
        setTabIndex(index);
        history.push(`/Vehicle/${index}`);
    };

    return (
        <ContentArea>
            <Tabs
                tabPadding="md"
                initialTab={initialTabIndex}
                tabIndex={tabIndex}
                onTabChange={handleTabChange}
            >
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