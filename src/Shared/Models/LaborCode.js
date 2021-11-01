import {Supplier} from "./Supplier";

class LaborCode {
    constructor(props) {
        const {
            id = '',
            code = '',
            hourly_rate = '',
            description = '',
            supplier_id = '',
            supplier = null,
            travel = '',
            call_out = ''
        } = props || {};
        this.id = id;
        this.code = code;
        this.hourly_rate = hourly_rate;
        this.description = description;
        this.supplier_id = supplier_id;
        this.supplier = supplier ? new Supplier(supplier) : null;
        this.travel = travel;
        this.call_out = call_out;
    }

    setSupplier(supplier) {
        const {id = ''} = supplier || {};
        this.supplier_id = id;
        this.supplier = supplier;
    }
}

export {LaborCode};
