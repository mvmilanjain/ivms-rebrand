import {Tabs} from '@mantine/core';
import {AiOutlineTable as DetailedReportIcon} from 'react-icons/ai';
import {MdOutlineSummarize as SummaryIcon} from 'react-icons/md';
import {ContentArea} from "../../../Components";

const Reports = (props) => {
    return (
        <ContentArea>
            <Tabs>
                <Tabs.Tab label="Summary" icon={<SummaryIcon/>}>Summary Content</Tabs.Tab>
                <Tabs.Tab label="Detailed Report" icon={<DetailedReportIcon/>}>Detailed Report Content</Tabs.Tab>
            </Tabs>
        </ContentArea>
    );
};

export default Reports;