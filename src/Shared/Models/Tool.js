import {Truck} from "./Vehicle";

class Tool {
    constructor(props) {
        const {
            id = '',
            serial_number = '',
            name = '',
            quantity = '',
            tool_type = '',
            status = '',
            vehicle_id = '',
            vehicle = null,
            model = '',
            year = '',
            reading = '',
            location = '',
            department = '',
            manufacture = '',
            purchase_vendor = '',
            purchase_price = '',
            purchase_date = null,
            last_service_date = null,
            warranty_expire_date = null,
            description = '',
            barcode = ''
        } = props || {};

        this.id = id;
        this.serial_number = serial_number;
        this.name = name;
        this.quantity = quantity;
        this.tool_type = tool_type;
        this.status = status;
        this.vehicle_id = vehicle_id;
        this.vehicle = vehicle ? new Truck(vehicle) : null;
        this.model = model;
        this.year = year;
        this.reading = reading;
        this.location = location;
        this.department = department;
        this.manufacture = manufacture;
        this.purchase_vendor = purchase_vendor;
        this.purchase_price = purchase_price;
        this.purchase_date = purchase_date;
        this.last_service_date = last_service_date;
        this.warranty_expire_date = warranty_expire_date;
        this.description = description;
        this.barcode = barcode;
    }

    setVehicle(vehicle) {
        const {id = ''} = vehicle || {};
        this.vehicle_id = id;
        this.vehicle = vehicle;
    }
}

export {Tool};
