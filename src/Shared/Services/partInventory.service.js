import {instance as axios} from "./config.service";

const url = '/inventory_parts';

const getPartInventories = (per_page = 100, page_no = 1, include = '') => axios({
    url, method: 'get', params: {per_page, page_no, include}
});

const getPartInventories2 = (params) => ({url, method: 'get', params});

const getPartInventory = (id) => ({url: `${url}/${id}`, method: 'get'});

const postPartInventory = (payload) => ({url, method: 'post', data: payload});

const putPartInventory = (id, payload) => ({url: `${url}/${id}`, method: 'put', data: payload});

export {getPartInventories, getPartInventories2, getPartInventory, putPartInventory, postPartInventory};
