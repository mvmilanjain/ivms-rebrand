import {useEffect, useState} from 'react';
import {Col, Grid, Group, LoadingOverlay, Select} from '@mantine/core';

import {useHttp} from 'Hooks';
import {getRevenueMasterReport} from 'Shared/Services';
import {ALL_MONTH_SCHEMA} from 'Shared/Utilities/tableSchema';
import {getYearList} from 'Shared/Utilities/common.util';
import LoadsRevenueChart from './Charts/LoadsRevenueChart';
import LoadsCompletedChart from './Charts/LoadsCompletedChart';
import PodAnalysisChart from "./Charts/PodAnalysisChart";
import PodOutstandingChart from "./Charts/PodOutstandingChart";
import InvoiceAnalysisChart from "./Charts/InvoiceAnalysisChart";
import InvoiceOutstandingChart from "./Charts/InvoiceOutstandingChart";

const type = 'monthly_revenue';
const YEARS = getYearList(2015);

const Summary = (props) => {
    const {requestHandler} = useHttp();

    const [loading, toggleLoading] = useState(false);
    const [report, setReport] = useState({revenue: [], pod: [], invoice: []});
    const [dashboard, setDashboard] = useState({
        overallLoad: [], completedLoad: [], totalCompletedLoad: [],
        collectedPod: [], notCollectedPod: [], totalOutstandingPod: [],
        invoicePrepared: [], invoiceSent: [], invoicePaid: [], totalOutstandingInvoice: []
    });
    const [selectedYear, setSelectedYear] = useState(String(new Date().getFullYear()));

    useEffect(() => {
        getReportSummary();
    }, [selectedYear]);

    const getPromise = (type, requestConfig) => new Promise(async (resolve) => {
        const report = {type, total: 0};
        try {
            const res = await requestHandler(requestConfig);
            res.data.forEach(item => {
                report[item.month] = item.total_cost;
                report.total += item.total_cost;
            });
            resolve(report);
        } catch (e) {
            resolve(report);
        }
    });

    const getListPromise = (promises) => new Promise(resolve => {
        Promise.allSettled(promises).then(results => {
            const list = results.map(result => result.value);
            resolve(list);
        });
    });

    const getReportSummary = () => {
        const year_eq = Number(selectedYear);
        const revenueReportPromises = [
            getPromise('Sum of Overall Loads', getRevenueMasterReport(type, {year_eq})),
            getPromise('Sum of Completed Loads', getRevenueMasterReport(type, {status_eq: 2, year_eq})),
            getPromise('Total Completed Loads', getRevenueMasterReport('count', {status_eq: 2, year_eq}))
        ];
        const revenueListPromise = getListPromise(revenueReportPromises);

        const podReportPromises = [
            getPromise('Sum of Collected POD\'s', getRevenueMasterReport(type, {pod_status_eq: 'recieved', year_eq})),
            getPromise('Sum of Not Collected POD\'s', getRevenueMasterReport(type, {
                pod_status_not_eq: 'recieved',
                year_eq
            })),
            getPromise('Total Not Collected POD\'s', getRevenueMasterReport('count', {
                pod_status_not_eq: 'recieved',
                year_eq
            }))
        ];
        const podListPromise = getListPromise(podReportPromises);

        const invoiceReportPromises = [
            getPromise('Sum of Prepared Invoice', getRevenueMasterReport(type, {invoice_status: 'prepared', year_eq})),
            getPromise('Sum of Sent to LCS Invoice', getRevenueMasterReport(type, {
                invoice_status: 'sent_to_lcs',
                year_eq
            })),
            getPromise('Sum of Paid Invoice', getRevenueMasterReport(type, {invoice_status: 'paid', year_eq})),
            getPromise('Total Outstanding Invoice', getRevenueMasterReport('count', {
                invoice_status_not_eq: 'paid', status_eq: 1, year_eq
            }))
        ];
        const invoiceListPromise = getListPromise(invoiceReportPromises);

        toggleLoading(true);
        Promise.allSettled([revenueListPromise, podListPromise, invoiceListPromise]).then(results => {
            toggleLoading(false);
            setReportViewData(results);
            setDashboardViewData(results);
        }).catch(error => {
            toggleLoading(false);
            console.error(error)
        });
    };

    const setReportViewData = (results) => {
        const revenue = results[0].value;
        const pod = results[1].value;
        const invoice = results[2].value;
        invoice[4] = invoice[3];
        invoice[3] = {type: 'Sum of Outstanding Invoice', total: 0};
        ALL_MONTH_SCHEMA.forEach(item => {
            const completedLoad = revenue[1][item.name] || 0;
            const invoiceSentToLcs = invoice[1][item.name] || 0;
            const invoicePaid = invoice[2][item.name] || 0;
            invoice[3][item.name] = completedLoad - invoiceSentToLcs - invoicePaid;
            invoice[3]['total'] += invoice[3][item.name];
        });
        setReport({revenue, pod, invoice});
    };

    const setDashboardViewData = (results) => {
        let overallLoad = [], completedLoad = [], totalCompletedLoad = [],
            collectedPod = [], notCollectedPod = [], totalOutstandingPod = [],
            invoicePrepared = [], invoiceSent = [], invoicePaid = [], totalOutstandingInvoice = [];
        const revenue = results[0].value;
        const pod = results[1].value;
        const invoice = results[2].value;
        ALL_MONTH_SCHEMA.forEach(item => {
            overallLoad.push(revenue[0][item.name] || 0);
            completedLoad.push(revenue[1][item.name] || 0);
            totalCompletedLoad.push(revenue[2][item.name] || 0);

            collectedPod.push(pod[0][item.name] || 0);
            notCollectedPod.push(pod[1][item.name] || 0);
            totalOutstandingPod.push(pod[2][item.name] || 0);

            invoicePrepared.push(invoice[0][item.name] || 0);
            invoiceSent.push(invoice[1][item.name] || 0);
            invoicePaid.push(invoice[2][item.name] || 0);
            totalOutstandingInvoice.push(invoice[4][item.name] || 0);
        });
        setDashboard({
            overallLoad, completedLoad, totalCompletedLoad,
            collectedPod, notCollectedPod, totalOutstandingPod,
            invoicePrepared, invoiceSent, invoicePaid, totalOutstandingInvoice
        });
    };

    return (
        <>
            <LoadingOverlay visible={loading} />
            <Group position="right" mb="md">
                <Select
                    variant="filled" style={{width: 80}}
                    data={YEARS} value={selectedYear}
                    onChange={setSelectedYear}
                />
            </Group>
            <Grid>
                <Col span={7}>
                    <LoadsRevenueChart overall={dashboard.overallLoad} completed={dashboard.completedLoad}/>
                </Col>
                <Col span={5}>
                    <LoadsCompletedChart completed={dashboard.totalCompletedLoad}/>
                </Col>

                <Col span={7}>
                    <PodAnalysisChart collected={dashboard.collectedPod} notCollected={dashboard.notCollectedPod}/>
                </Col>
                <Col span={5}>
                    <PodOutstandingChart outstanding={dashboard.totalOutstandingPod}/>
                </Col>

                <Col span={7}>
                    <InvoiceAnalysisChart
                        prepared={dashboard.invoicePrepared}
                        sent={dashboard.invoiceSent}
                        paid={dashboard.invoicePaid}
                    />
                </Col>
                <Col span={5}>
                    <InvoiceOutstandingChart outstanding={dashboard.totalOutstandingInvoice}/>
                </Col>
            </Grid>
        </>
    );

};

export default Summary;