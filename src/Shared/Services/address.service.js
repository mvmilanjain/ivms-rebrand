const url = '/addresses';

const getAddresses = (params) => ({url, method: 'get', params});

const getAddress = (id, params) => ({url: `${url}/${id}`, method: 'get', params});

const postAddress = (data) => ({url: '/addresses', method: 'post', data});

const putAddress = (id, data) => ({url: `${url}/${id}`, method: 'put', data});

const deleteAddress = (id) => ({url: `${url}/${id}`, method: 'delete'});

export {getAddresses, getAddress, postAddress, putAddress, deleteAddress};
