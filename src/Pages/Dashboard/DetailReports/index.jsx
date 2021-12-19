import {useState} from 'react';
import {Autocomplete} from '@mantine/core';

import {ContentArea, ReactTable} from 'Components';
import {useHttp} from 'Hooks';
import {getReports} from 'Shared/Services';
import {REPORT_TYPE} from 'Shared/Utilities/constant';
import {DASHBOARD, VEHICLE} from 'Shared/Utilities/tableSchema';

const REPORT_TYPE_LIST = [
    {value: 'Revenue Master', type: REPORT_TYPE.REVENUE_MASTER, schema: DASHBOARD.REPORTS.REVENUE_MASTER},
    {value: 'Driver Load Tracker', type: REPORT_TYPE.DRIVER_LOAD_TRACKER, schema: DASHBOARD.REPORTS.DRIVER_LOAD_TRACKER},
    {value: 'Daily Revenue Tracker', type: REPORT_TYPE.DAILY_REVENUE_TRACKER, schema: []},
    {value: 'Revenue Analysis', type: REPORT_TYPE.REVENUE_ANALYSIS, schema: DASHBOARD.REPORTS.REVENUE_ANALYSIS},
    {value: 'Standard VS Actual ODOTIF', type: REPORT_TYPE.STD_VS_ACTUAL, schema: DASHBOARD.REPORTS.STD_VS_ACTUAL}
];

const DetailReports = (props) => {
    const {requestHandler} = useHttp();
    const [report, setReport] = useState({type: '', schema: []});
    const [dataSource, setDataSource] = useState([]);

    const onChangeReportType = (report) => {
        if (!report) {
            setReport({type: '', schema: []});
        } else {
            const {type, schema} = report;
            requestHandler(getReports(type), {loader: true}).then(res => {
                if (type === REPORT_TYPE.DAILY_REVENUE_TRACKER) {
                    const {schema: newSchema, dataSource} = getDailyRevenueTrackerSchema(res.data);
                    setReport({type, schema: newSchema});
                    setDataSource(dataSource);
                } else {
                    setReport({type, schema});
                    setDataSource(res.data);
                }
            }).catch(e => {
                setDataSource([]);
            });
        }
    };

    const getDailyRevenueTrackerSchema = (dataSource) => {
        const schema = [{name: 'vehicle_number', header: 'Vehicle No.', defaultFlex: 1},];
        const newDataSource = [];
        const uniqueDateList = [];
        dataSource.forEach(item => {
            const {calender_date: itemDate, vehicle_number, total_cost} = item;
            if (!uniqueDateList.includes(itemDate)) {
                uniqueDateList.push(itemDate);
                schema.push({name: `${itemDate}`, header: `${itemDate}`, defaultFlex: 1});
            }
            const index = newDataSource.findIndex(item => item.vehicle_number === vehicle_number);
            if (index < 0) {
                newDataSource.push({vehicle_number, [itemDate]: total_cost, total: Number(total_cost)});
            } else {
                newDataSource[index][itemDate] = total_cost;
                newDataSource[index]['total'] = newDataSource[index]['total'] + Number(total_cost);
            }
        });
        schema.push({name: 'total', header: 'Total', defaultFlex: 1});
        return {schema, dataSource: newDataSource};
    };

    return (
        <ContentArea withPaper limitToViewPort heightToReduce={184} withPadding={false}>
            <Autocomplete
                mb="md"
                placeholder="Select report type"
                data={REPORT_TYPE_LIST}
                onItemSubmit={onChangeReportType}
            />

            {report.type !== '' && <div style={{height: 'calc(100% - 60px)'}}>
                <ReactTable
                    columns={report.schema}
                    data={dataSource}
                    stickyHeader
                />
            </div>}
        </ContentArea>
    );
};

export default DetailReports;