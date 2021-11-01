const getReports = (type) => ({
    url: `/reports/${type}`,
    method: 'get'
});

const getRevenueMasterReport = (type, filter) => ({
    url: `/reports/revenue_master/${type}`,
    method: 'get',
    params: {filter}
});

export {getReports, getRevenueMasterReport};
