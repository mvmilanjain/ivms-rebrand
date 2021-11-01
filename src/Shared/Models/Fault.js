import {Truck} from "./Vehicle";

class Fault {
    constructor(props) {
        const {
            id = '',
            name = '',
            fault_type = '',
            vehicle_id = '',
            vehicle = null,
            description = ''
        } = props || {};
        this.id = id;
        this.name = name;
        this.fault_type = fault_type;
        this.vehicle_id = vehicle_id;
        this.vehicle = vehicle ? new Truck(vehicle) : null;
        this.description = description;
    }

    setVehicle(vehicle) {
        const {id = ''} = vehicle || {};
        this.vehicle_id = id;
        this.vehicle = vehicle;
    }
}

export {Fault};
