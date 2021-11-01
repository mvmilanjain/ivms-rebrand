const url = '/route_orders';

const getRouteOrders = (params) => ({url, method: 'get', params});

const getRouteOrder = (id, params = {}) => ({url: `${url}/${id}`, method: 'get', params});

const postRouteOrder = (data) => ({url, method: 'post', data});

const putRouteOrder = (id, data) => ({url: `${url}/${id}`, method: 'put', data});

const postUpdateState = (id, event, data) => ({
    url: `${url}/${id}/update_state/${event}`,
    method: 'post', event, data
});

export {getRouteOrders, getRouteOrder, postRouteOrder, putRouteOrder, postUpdateState};
