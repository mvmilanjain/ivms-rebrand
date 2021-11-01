const url = '/faults';

const getFaults = (params) => ({url, method: 'get', params});

const getFault = (id, params) => ({url: `${url}/${id}`, method: 'get', params});

const postFault = (data) => ({url, method: 'post', data});

const putFault = (id, data) => ({url: `${url}/${id}`, method: 'put', data});

export {getFaults, getFault, postFault, putFault};
