import {useState} from 'react';
import {Tabs} from '@mantine/core';
import {HiOutlineDocumentReport as ReportIcon} from 'react-icons/hi';
import {MdOutlineDescription as FormIcon} from 'react-icons/md';

import {ContentArea} from 'Components';
import InspectionForms from './InspectionForms';
import InspectionReport from './InspectionReport';

const Inspection = ({history, match}) => {
    const [tabIndex, setTabIndex] = useState(Number(match.params.tabIndex) || 0);
    const [initialTabIndex] = useState(Number(match.params.tabIndex) || 0);

    const handleTabChange = (index) => {
        setTabIndex(index);
        history.push(`/inspection/${index}`);
    };

    return (
        <ContentArea>
            <Tabs
                tabPadding="md"
                initialTab={initialTabIndex}
                tabIndex={tabIndex}
                onTabChange={handleTabChange}
            >
                <Tabs.Tab label="Forms" icon={<FormIcon/>}>
                    {tabIndex === 0 && <InspectionForms history={history}/>}
                </Tabs.Tab>
                <Tabs.Tab label="Reports" icon={<ReportIcon/>}>
                    {tabIndex === 1 && <InspectionReport history={history}/>}
                </Tabs.Tab>
            </Tabs>
        </ContentArea>
    );
};

export default Inspection;