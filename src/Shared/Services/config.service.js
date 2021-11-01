import axios from "axios";
import qs from "qs";
import {deserialize} from "deserialize-json-api";

import store from "../../Store/store";

export const googleInstance = axios.create({
    baseURL: process.env.REACT_APP_GOOGLE_MAP_API_BASE_URL,
    headers: {'Content-Type': 'application/json; charset=utf-8'}
});

export const instance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Pragma': 'no-cache'
    }
});

// REQUEST INTERCEPTOR
instance.interceptors.request.use(req => {
    req.paramsSerializer = params => qs.stringify(params, {arrayFormat: 'brackets'});
    req.headers['Authorization'] = `Bearer ${store.getState().auth.token}`;
    return req;
}, error => Promise.reject(error));

// RESPONSE INTERCEPTOR
instance.interceptors.response.use(res => {
    return deserialize(res.data);
}, error => Promise.reject(error));
