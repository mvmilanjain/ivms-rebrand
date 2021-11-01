import {instance as axios} from "./config.service";

const url = '/products';
const getProducts = (per_page = 100, page_no = 1) => axios({
    url, method: 'get', params: {per_page, page_no}
});

const getProducts2 = (params) => ({url, method: 'get', params});

const getProduct = (id, params) => ({url: `${url}/${id}`, method: 'get', params});

const postProduct = (payload) => ({url, method: 'post', data: payload});

const putProduct = (id, payload) => ({url: `${url}/${id}`, method: 'put', data: payload});

const deleteProduct = (id) => ({url: `${url}/${id}`, method: 'delete'});

export {getProducts, getProducts2, getProduct, putProduct, postProduct, deleteProduct};
