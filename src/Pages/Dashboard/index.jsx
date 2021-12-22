import {useState} from 'react';
import {Tabs} from '@mantine/core';
import {AiOutlineTable as DetailedReportIcon} from 'react-icons/ai';
import {MdOutlineSummarize as SummaryIcon} from 'react-icons/md';

import {ContentArea} from 'Components';
import Summary from './Summary';
import DetailReports from './DetailReports';

const Dashboard = (props) => {
    const [tabIndex, setTabIndex] = useState(0);
    const [initialTabIndex] = useState(0);

    return (
        <ContentArea>
            <Tabs tabPadding="md" onTabChange={setTabIndex} tabIndex={tabIndex} initialTab={initialTabIndex}>
                <Tabs.Tab label="Summary" icon={<SummaryIcon/>}>
                    <Summary/>
                </Tabs.Tab>
                <Tabs.Tab label="Detailed Report" icon={<DetailedReportIcon/>}>
                    <DetailReports/>
                </Tabs.Tab>
            </Tabs>
        </ContentArea>
    );
};

export default Dashboard;