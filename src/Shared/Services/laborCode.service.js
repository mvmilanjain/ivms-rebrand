import {instance as axios} from "./config.service";

const url = '/labour_codes';

const getLaborCodes = (per_page = 100, page_no = 1, include = '') => axios({
    url, method: 'get', params: {per_page, page_no, include}
});

const getLaborCodes2 = (params) => ({url, method: 'get', params});

const getLaborCode = (id, params) => ({url: `${url}/${id}`, method: 'get', params});

const postLaborCode = (data) => ({url: '/labour_codes', method: 'post', data});

const putLaborCode = (id, data) => ({url: `${url}/${id}`, method: 'put', data});

export {getLaborCodes, getLaborCodes2, getLaborCode, postLaborCode, putLaborCode};
