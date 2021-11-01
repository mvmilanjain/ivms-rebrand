const url = '/routes';

const getRoutes = (params) => ({url, method: 'get', params});

const getRoute = (id) => ({
    url: `${url}/${id}`, method: 'get',
    params: {
        include: 'source_address,destination_address,route_planner,route_planner.origin_address,' +
            'route_planner.route_stops,route_planner.route_stops.address'
    }
});

const postRoute = (data) => ({url, method: 'post', data});

const putRoute = (id, data) => ({url: `${url}/${id}`, method: 'put', data});

const deleteRoute = (id) => ({url: `${url}/${id}`, method: 'delete'});

export {getRoutes, getRoute, postRoute, putRoute, deleteRoute};
