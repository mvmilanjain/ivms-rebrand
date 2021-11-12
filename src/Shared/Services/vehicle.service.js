const truckUrl = '/vehicles';
const trailerUrl = '/trailers';
const trailerSolUrl = '/trailersol_vehicles';

// TRUCK
const getTrucks = (params) => ({url: truckUrl, method: 'get', params});

const getTruck = (id, params) => ({url: `${truckUrl}/${id}`, method: 'get', params});

const postTruck = (data) => ({url: truckUrl, method: 'post', data});

const putTruck = (id, data) => ({url: `${truckUrl}/${id}`, method: 'put', data});

const deleteTruck = (id) => ({url: `${truckUrl}/${id}`, method: 'delete'});

// TRAILER
const getTrailers = (params) => ({url: trailerUrl, method: 'get', params});

const getTrailer = (id, params) => ({url: `${trailerUrl}/${id}`, method: 'get', params});

const postTrailer = (data) => ({url: trailerUrl, method: 'post', data});

const putTrailer = (id, data) => ({url: `${trailerUrl}/${id}`, method: 'put', data});

const deleteTrailer = (id) => ({url: `${trailerUrl}/${id}`, method: 'delete'});

const getTrailerSolVehicles =() => ({url: `${trailerSolUrl}`, method: 'get'});

export {
    getTrucks,
    getTruck,
    putTruck,
    postTruck,
    deleteTruck,
    getTrailers,
    getTrailer,
    postTrailer,
    putTrailer,
    deleteTrailer,
    getTrailerSolVehicles
};
