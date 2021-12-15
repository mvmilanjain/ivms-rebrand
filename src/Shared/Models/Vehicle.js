class Truck {
    constructor(props) {
        const {
            id = '',
            vehicle_number = '',
            name = '',
            vehicle_category_id = '',
            vehicle_category = null,
            manufacture = '',
            model = '',
            trailersol_meter_reading = '',
            meter_reading = '',
            meter_reading_unit = 'miles',
            status = '',
            capacity = '',
            chassis_number = '',
            vin_number = '',
            year = '',
            license_number = '',
            asset_value = '',
            purchase_date = null,
            last_service_reading = '',
            last_service_date = null,
            registration_state = '',
            depo_id = '',
            depo = null,
            business_unit_id = '',
            business_unit = null,
            current_book_value = '',
            warranty_start_date = null,
            warranty_end_date = null,
            operator_name = '',
            maintainence_priority = 'normal',
            note = '',
            member_ids = [],
            members = [],
            trailer_id = [],
            trailer = [],
            trailersol_vehicle_id = '',
            trailersol_vehicle = null
        } = props || {};

        this.id = id;
        this.vehicle_number = vehicle_number;
        this.name = name;
        this.vehicle_category_id = vehicle_category_id;
        this.vehicle_category = vehicle_category;
        this.manufacture = manufacture;
        this.model = model;
        this.trailersol_meter_reading = trailersol_meter_reading;
        this.meter_reading = meter_reading;
        this.meter_reading_unit = meter_reading_unit;
        this.status = status;
        this.capacity = capacity;
        this.chassis_number = chassis_number;
        this.vin_number = vin_number;
        this.year = year;
        this.license_number = license_number;
        this.asset_value = asset_value;
        this.purchase_date = purchase_date;
        this.last_service_reading = last_service_reading;
        this.last_service_date = last_service_date;
        this.registration_state = registration_state;
        this.depo_id = depo_id;
        this.depo = depo;
        this.business_unit_id = business_unit_id;
        this.business_unit = business_unit;
        this.current_book_value = current_book_value;
        this.warranty_start_date = warranty_start_date;
        this.warranty_end_date = warranty_end_date;
        this.operator_name = operator_name;
        this.maintainence_priority = maintainence_priority;
        this.note = note;
        this.member_ids = member_ids;
        this.members = members;
        this.trailer_id = trailer_id;
        this.trailer = [];
        this.setTrailers(trailer);
        this.trailersol_vehicle_id = trailersol_vehicle_id;
        this.trailersol_vehicle = trailersol_vehicle;
    }

    setTrailers(trailers) {
        this.trailer = trailers.map(item => new Trailer(item));
    }

    setTrailerIds(trailers) {
        this.trailer_id = trailers.map(item => item.id);
    }

    setCategory(vehicle_category) {
        const {id = ''} = vehicle_category || {};
        this.vehicle_category_id = id;
        this.vehicle_category = vehicle_category;
    }

    setTrailerSolVehicle(trailerSolVehicle) {
        const {ID = ''} = trailerSolVehicle || {};
        this.trailersol_vehicle_id = ID;
        this.trailersol_vehicle = trailerSolVehicle;
    }

    setDepo(depo) {
        const {id = ''} = depo || {};
        this.depo_id = id;
        this.depo = depo;
    }

    setBusinessUnit(business_unit) {
        const {id = ''} = business_unit;
        this.business_unit_id = id;
        this.business_unit = business_unit;
    }

    updateMembers(members) {
        this.members = members && members.length ? members : [];
        this.member_ids = this.members.map(member => member.id);
    }

    updateTrailer(trailers) {
        this.setTrailerIds(trailers);
        this.setTrailers(trailers);
    }
}

class Trailer {
    constructor(props) {
        const {
            id = '',
            name = '',
            category_id = '',
            trailer_category = null,
            vin_number = '',
            model = '',
            meter_reading = 0,
            status = '',
            license_expiry = null
        } = props || {};

        this.id = id;
        this.name = name;
        this.vin_number = vin_number;
        this.category_id = category_id;
        this.trailer_category = trailer_category;
        this.model = model;
        this.meter_reading = meter_reading;
        this.status = status;
        this.license_expiry = license_expiry;
    }

    setCategory(category) {
        const {id = ''} = category || {};
        this.category_id = id;
        this.trailer_category = category;
    }
}

export {Truck, Trailer};
