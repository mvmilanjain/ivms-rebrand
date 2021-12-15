import {useCallback, useState} from 'react';
import {Button, Group, Title} from '@mantine/core';
import {useSetState} from '@mantine/hooks';
import {MdOutlineAddBox as CreateIcon} from 'react-icons/md';

import {ContentArea, ReactTable} from 'Components';
import {useHttp} from 'Hooks';
import {getInspectionReports} from 'Shared/Services';
import {getFilterList, getSortText} from 'Shared/Utilities/common.util';
import {INSPECTION} from 'Shared/Utilities/tableSchema';

const InspectionReport = (props) => {
    const {requestHandler} = useHttp();
    const [loading, toggleLoading] = useState(false);
    const [state, setState] = useSetState({
        reload: false, data: [],
        pagination: {total: 0, pageCount: 0, pageIndex: 0}
    });

    const fetchData = useCallback(({pageSize, pageIndex, sortBy, filters}) => {
        toggleLoading(l => !l);
        const params = {
            per_page: pageSize, page_no: pageIndex + 1,
            include: 'vehicle,inspector,location',
            sort: getSortText(sortBy), filter: getFilterList(filters)
        };
        requestHandler(getInspectionReports(params)).then(res => {
            const {data, meta: {pagination: {count, current_page, total_pages}}} = res;
            setState({
                reload: false, data,
                pagination: {total: count, pageCount: total_pages, pageIndex: current_page - 1}
            });
        }).catch(e => console.error(e)).finally(() => toggleLoading(l => !l));
    }, []);

    return (
        <ContentArea withPaper limitToViewPort>
            <Group position="apart" mb="md">
                <Title order={2}>Inspection Report</Title>
                <Button leftIcon={<CreateIcon/>}>Create Inspection Report</Button>
            </Group>
            <div style={{height: 'calc(100% - 60px)'}}>
                <ReactTable
                    columns={INSPECTION.INSPECTION_REPORT}
                    data={state.data}
                    serverSideDataSource
                    fetchData={fetchData}
                    loading={loading}
                    reload={state.reload}
                    stickyHeader sorting
                    pagination initialPageSize={50}
                    {...state.pagination}
                />
            </div>
        </ContentArea>
    );
};

export default InspectionReport;