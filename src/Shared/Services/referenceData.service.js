const url = '/config_fields';

const getAllConfigFields = (per_page = 100, page_no = 1) => ({
    url, method: 'get', params: {per_page, page_no}
});

const getConfigField = (type, params) => ({url: `${url}/${type}`, method: 'get', params});

const postConfigField = (type, data) => ({url: `${url}/${type}`, method: 'post', data});

const putConfigField = (id, type, data) => ({url: `${url}/${type}/${id}`, method: 'put', data});

const deleteConfigField = (id, type) => ({url: `${url}/${type}/${id}`, method: 'delete'});

export {getAllConfigFields, getConfigField, postConfigField, putConfigField, deleteConfigField};
