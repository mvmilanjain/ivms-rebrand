import {Supplier} from "./Supplier";

class Part {
    constructor(props) {
        const {
            id = '',
            item_number = '',
            name = '',
            quantity = '',
            quantity_unit = 'piece',
            cost = '',
            item_type_id = '',
            item_type = null,
            location = '',
            supplier_id = '',
            supplier = null,
            description = ''
        } = props || {};

        this.id = id;
        this.item_number = item_number;
        this.name = name;
        this.quantity = quantity;
        this.quantity_unit = quantity_unit;
        this.cost = cost;
        this.item_type_id = item_type_id;
        this.item_type = item_type;
        this.location = location;
        this.supplier_id = supplier_id;
        this.supplier = supplier ? new Supplier(supplier) : null;
        this.description = description;
    }

    setItemType(item_type) {
        const {id = ''} = item_type || {};
        this.item_type_id = id;
        this.item_type = item_type;
    }

    setSupplier(supplier) {
        const {id: supplier_id = ''} = supplier || {};
        this.supplier_id = supplier_id;
        this.supplier = supplier;
    }
}

export {Part};
