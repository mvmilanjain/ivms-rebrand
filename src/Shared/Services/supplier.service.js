import {instance as axios} from "./config.service";

const url = '/suppliers';

const getSuppliers = (per_page = 100, page_no = 1) => axios({
    url, method: 'get', params: {per_page, page_no, include: 'address'}
});

const getSuppliers2 = (params) => ({url, method: 'get', params});

const getSupplier = (id, params) => ({url: `${url}/${id}`, method: 'get', params});

const postSupplier = (data) => ({url, method: 'post', data});

const putSupplier = (id, data) => ({url: `${url}/${id}`, method: 'put', data});

const deleteSupplier = (id) => ({url: `${url}/${id}`, method: 'delete'});

export {getSuppliers, getSuppliers2, getSupplier, postSupplier, putSupplier, deleteSupplier};