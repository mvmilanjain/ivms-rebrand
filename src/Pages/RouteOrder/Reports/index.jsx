import {Tabs} from '@mantine/core';
import {AiOutlineTable as DetailedReportIcon} from 'react-icons/ai';
import {MdOutlineSummarize as SummaryIcon} from 'react-icons/md';

const Reports = (props) => {
    return (
        <Tabs>
            <Tabs.Tab label="Summary" icon={<SummaryIcon/>}>Summary Content</Tabs.Tab>
            <Tabs.Tab label="Detailed Report" icon={<DetailedReportIcon/>}>Detailed Report Content</Tabs.Tab>
        </Tabs>
    );
};

export default Reports;