const url = '/tools';

const getTools = (params) => ({url, method: 'get', params});

const getTool = (id) => ({url: `${url}/${id}`, method: 'get', params: {include: 'vehicle'}});

const postTool = (data) => ({url, method: 'post', data});

const putTool = (id, data) => ({url: `${url}/${id}`, method: 'put', data});

export {getTools, getTool, postTool, putTool};
