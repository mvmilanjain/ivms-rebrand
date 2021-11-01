class ServiceTask {
    constructor(props) {
        const {id = '', name = '', _destroy = false} = props || {};
        this.id = id;
        this.name = name;
        this._destroy = _destroy;
    }
}

class Scheduler {
    constructor(props) {
        const {
            id = '',
            title = '',
            vehicle_id = '',
            vehicle = null,
            last_meter_reading = '',
            meter_reading_unit = 'miles',
            last_service_date = null,
            repeat_type = 'repeat',
            distance_interval = '',
            day_interval = '',
            day_interval_unit = 'year',
            next_service_date = null,
            note = '',
            service_tasks = [],
            notify_distance = '',
            notify_day = '',
            notify_day_unit = 'day',
            completed_at = '',
            completed_meter_reading = ''
        } = props || {};

        this.id = id;
        this.title = title;
        this.vehicle_id = vehicle_id;
        this.vehicle = vehicle;
        this.last_meter_reading = last_meter_reading;
        this.meter_reading_unit = meter_reading_unit;
        this.last_service_date = last_service_date;
        this.repeat_type = repeat_type;
        this.distance_interval = distance_interval;
        this.day_interval = day_interval;
        this.day_interval_unit = day_interval_unit;
        this.next_service_date = next_service_date;
        this.note = note;
        this.service_tasks = this.setServiceTask(service_tasks);
        this.notify_distance = notify_distance;
        this.notify_day = notify_day;
        this.notify_day_unit = notify_day_unit;
        this.completed_at = completed_at;
        this.completed_meter_reading = completed_meter_reading;
    }

    setVehicle(vehicle) {
        const {id = ''} = vehicle || {};
        this.vehicle_id = id;
        this.vehicle = vehicle;
    }

    setServiceTask(serviceTask) {
        return serviceTask.map(task => new ServiceTask(task));
    }

    addServiceTask(task) {
        this.service_tasks.push(new ServiceTask({name: task}));
    }

    removeServiceTask(index) {
        if (this.service_tasks[index]['id']) {
            this.service_tasks[index]['_destroy'] = true;
        } else {
            this.service_tasks = this.service_tasks.filter((item, i) => i !== index);
        }
    }

    getActiveServiceTasks() {
        return this.service_tasks.filter(stop => !stop._destroy);
    }

    getServiceTaskString() {
        const taskNameArr = [];
        this.service_tasks.forEach(task => taskNameArr.push(task.name));
        return taskNameArr.toString();
    }
}

export {Scheduler, ServiceTask};
