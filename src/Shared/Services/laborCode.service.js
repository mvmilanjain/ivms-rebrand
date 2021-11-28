const url = '/labour_codes';

const getLaborCodes = (params) => ({url, method: 'get', params});

const getLaborCode = (id, params) => ({url: `${url}/${id}`, method: 'get', params});

const postLaborCode = (data) => ({url: '/labour_codes', method: 'post', data});

const putLaborCode = (id, data) => ({url: `${url}/${id}`, method: 'put', data});

const deleteLaborCode = (id) => ({url: `${url}/${id}`, method: 'delete'});

export {getLaborCodes, getLaborCode, postLaborCode, putLaborCode, deleteLaborCode};