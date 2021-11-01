const url = '/service_schedules';

const getSchedules = (params) => ({url, method: 'get', params});

const getSchedule = (id) => ({url: `${url}/${id}`, method: 'get', params: {include: 'vehicle,service_tasks'}});

const postSchedule = (data) => ({url, method: 'post', data});

const putSchedule = (id, data) => ({url: `${url}/${id}`, method: 'put', data});

const deleteSchedule = (id) => ({url: `${url}/${id}`, method: 'delete'});

export {getSchedules, getSchedule, postSchedule, putSchedule, deleteSchedule};
