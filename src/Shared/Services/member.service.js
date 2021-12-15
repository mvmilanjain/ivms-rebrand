const url = '/members';

const getMembers = (params) => ({url, method: 'get', params});

const getMember = (id) => ({url: `${url}/${id}`, method: 'get'});

const postMember = (data) => ({url, method: 'post', data});

const putMember = (id, data) => ({url: `${url}/${id}`, method: 'put', data});

export {getMembers, getMember, postMember, putMember};
