import {useState} from 'react';
import {Tabs} from '@mantine/core';
import {
    MdMoney as FinanceIcon,
    MdOutlineInsertDriveFile as PlanIcon,
    MdOutlineTask as OperationIcon
} from 'react-icons/md';

import {ContentArea} from 'Components';
import Planning from './Planning';
import Operation from './Operation';
import Finance from './Finance';

const RoutePlanner = ({history, location, match}) => {
    const [tabIndex, setTabIndex] = useState(Number(match.params.tabIndex));
    const [initialTabIndex] = useState(Number(match.params.tabIndex));

    const handleTabChange = (index) => {
        setTabIndex(index);
        history.push(`/RoutePlanner/${index}`);
    };

    return (
        <ContentArea>
            <Tabs
                tabPadding="md"
                initialTab={initialTabIndex}
                tabIndex={tabIndex}
                onTabChange={handleTabChange}
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