const url = '/work_orders';

const getOrders = (params) => ({url, method: 'get', params});

const getOrder = (id) => ({
    url: `${url}/${id}`, method: 'get',
    params: {
        include: 'vehicle,assignee,work_order_tasks,work_order_tasks.assignee,' +
            'materials,materials.inventory_part,labours,labours.member,labours.labour_code,' +
            'additional_costs,work_order_comments'
    }
});

const postOrder = (payload) => ({url, method: 'post', data: payload});

const putOrder = (id, payload) => ({url: `${url}/${id}`, method: 'put', data: payload});

const deleteOrder = (id) => ({url: `${url}/${id}`, method: 'delete'});

export {getOrders, getOrder, postOrder, putOrder, deleteOrder};
