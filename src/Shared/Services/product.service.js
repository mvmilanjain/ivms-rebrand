const url = '/products';

const getProducts = (params) => ({url, method: 'get', params});

const getProduct = (id, params) => ({url: `${url}/${id}`, method: 'get', params});

const postProduct = (payload) => ({url, method: 'post', data: payload});

const putProduct = (id, payload) => ({url: `${url}/${id}`, method: 'put', data: payload});

const deleteProduct = (id) => ({url: `${url}/${id}`, method: 'delete'});

export {getProducts, getProduct, putProduct, postProduct, deleteProduct};
