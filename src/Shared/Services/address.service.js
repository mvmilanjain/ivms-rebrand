import {instance as axios} from "./config.service";

const url = '/addresses';

const getAddresses = (per_page = 90, page_no = 1) => axios({
    url, method: 'get', params: {per_page, page_no, sort: 'created_at.desc'}
});

const getAddresses2 = (params) => ({url, method: 'get', params});

const getAddress = (id, params) => ({url: `${url}/${id}`, method: 'get', params});

const postAddress = (data) => ({url: '/addresses', method: 'post', data});

const putAddress = (id, data) => ({url: `${url}/${id}`, method: 'put', data});

const deleteAddress = (id) => ({url: `${url}/${id}`, method: 'delete'});

export {getAddresses, getAddresses2, getAddress, postAddress, putAddress, deleteAddress};
