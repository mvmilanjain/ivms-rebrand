import {instance as axios} from "./config.service";

const url = '/members';

const getMembers = (per_page = 100, page_no = 1) => axios({
    url, method: 'get', params: {per_page, page_no}
});

const getMembers2 = (params) => ({url, method: 'get', params});

const getMember = (id) => ({url: `${url}/${id}`, method: 'get'});

const postMember = (data) => ({url, method: 'post', data});

const putMember = (id, data) => ({url: `${url}/${id}`, method: 'put', data});

export {getMembers, getMembers2, getMember, postMember, putMember};
