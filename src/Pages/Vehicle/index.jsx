import {useState} from 'react';
import {Tabs} from '@mantine/core';
import {FaTrailer as TrailerIcon, FaTruck as TruckIcon} from "react-icons/fa";
import Truck from "./Truck";
import Trailer from "./Trailer";

const Vehicle = ({}) => {
    const [tabIndex, setTabIndex] = useState(0);

    return (
        <Tabs onTabChange={setTabIndex}>
            <Tabs.Tab label="Truck" icon={<TruckIcon/>}>
                {tabIndex === 0 && <Truck />}
            </Tabs.Tab>
            <Tabs.Tab label="Trailer" icon={<TrailerIcon/>}>
                {tabIndex === 1 && <Trailer />}
            </Tabs.Tab>
        </Tabs>
    );
};

export default Vehicle;