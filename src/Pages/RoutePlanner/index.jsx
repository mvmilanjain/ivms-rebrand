import {useState} from 'react';
import {Tabs} from '@mantine/core';
import {MdOutlineInsertDriveFile as PlanIcon, MdOutlineTask as OperationIcon, MdMoney as FinanceIcon} from 'react-icons/md';

import {ContentArea} from 'Components';
import Planning from './Planning';
import Operation from './Operation';
import Finance from './Finance';

const RoutePlanner = ({history, location}) => {
    const [tabIndex, setTabIndex] = useState(location.state ? location.state.tabIndex : 0);
    const [initialTabIndex] = useState(location.state ? location.state.tabIndex : 0);

    return (
        <ContentArea>
            <Tabs
                tabPadding="md"
                initialTab={initialTabIndex}
                tabIndex={tabIndex}
                onTabChange={setTabIndex}
            >
                <Tabs.Tab label="Planning" icon={<PlanIcon/>}>
                    {tabIndex === 0 && <Planning history={history}/>}
                </Tabs.Tab>

                <Tabs.Tab label="Operations" icon={<OperationIcon/>}>
                    {tabIndex === 1 && <Operation history={history}/>}
                </Tabs.Tab>

                <Tabs.Tab label="Finance" icon={<FinanceIcon/>}>
                    {tabIndex === 2 && <Finance history={history}/>}
                </Tabs.Tab>
            </Tabs>
        </ContentArea>
    );
};

export default RoutePlanner;