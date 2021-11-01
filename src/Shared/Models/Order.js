import {Member} from "./Member";
import {Truck} from "./Vehicle";
import {Part} from "./Part";
import {LaborCode} from "./LaborCode";

class Task {
    constructor(props) {
        const {
            id = '',
            name = '',
            status = null,
            task_type = '',
            assigned_to_id = '',
            assignee = null,
            note = '',
            _destroy = false
        } = props || {};

        this.id = id;
        this.name = name;
        this.status = status;
        this.task_type = task_type;
        this.assigned_to_id = assigned_to_id;
        this.assignee = assignee ? new Member(assignee) : null;
        this.note = note;
        this._destroy = _destroy;
    }

    setAssignee(assignee) {
        const {id} = assignee || {};
        this.assigned_to_id = id;
        this.assignee = assignee;
    }
}

class Material {
    constructor(props) {
        const {
            id = '',
            inventory_part_id = '',
            inventory_part = null,
            quantity = 0,
            quantity_unit = '',
            cost = 0,
            note = '',
            _destroy = false
        } = props || {};

        this.id = id;
        this.inventory_part_id = inventory_part_id;
        this.inventory_part = inventory_part ? new Part(inventory_part) : null;
        this.quantity = quantity;
        this.quantity_unit = quantity_unit;
        this.cost = cost;
        this.note = note;
        this._destroy = _destroy;
    }

    setPart(part) {
        const {id = '', quantity = '', quantity_unit = '', cost = ''} = part || {};
        this.inventory_part_id = id;
        this.quantity = quantity;
        this.quantity_unit = quantity_unit;
        this.cost = cost;
        this.inventory_part = part;
    }
}

class Labour {
    constructor(props) {
        const {
            id = '',
            member_id = '',
            member = null,
            labour_code_id = '',
            labour_code = null,
            labour_rate = 0,
            hours = '',
            minutes = '',
            _destroy = false
        } = props || {};

        this.id = id;
        this.member_id = member_id;
        this.member = member ? new Member(member) : null;
        this.labour_code_id = labour_code_id;
        this.labour_code = labour_code ? new LaborCode(labour_code) : null;
        this.labour_rate = labour_rate;
        this.hours = hours;
        this.minutes = minutes;
        this._destroy = _destroy;
    }

    setMember(member) {
        const {id} = member || {};
        this.member_id = id;
        this.member = member;
    }

    setLaborCode(laborCode) {
        const {id, hourly_rate} = laborCode || {};
        this.labour_code_id = id;
        this.labour_rate = hourly_rate;
        this.labour_code = laborCode;
    }
}

class Comment {
    constructor(props) {
        const {id = '', comment = '', _destroy = false} = props || {};
        this.id = id;
        this.comment = comment;
        this._destroy = _destroy;
    }
}

class AdditionalCost {
    constructor(props) {
        const {id = '', description = '', cost = 0, _destroy = false} = props || {};
        this.id = id;
        this.description = description;
        this.cost = cost;
        this._destroy = _destroy;
    }
}

class Order {
    constructor(props) {
        const {
            id = '',
            state = '',
            title = '',
            priority = '',
            assigned_to = '',
            assignee = null,
            work_order_type = '',
            memo = '',
            vehicle_id = '',
            vehicle = null,
            meter_reading = '',
            meter_reading_unit = '',
            start_date = null,
            due_date = null,
            estimated_cost = '',
            estimated_hours = '',
            work_order_tasks = [],
            materials = [],
            labours = [],
            work_order_comments = [],
            additional_costs = [],
            total_material_cost = 0,
            total_labour_cost = 0,
            additional_cost = 0,
            tax = 0,
            total_cost = 0
        } = props || {};

        this.id = id;
        this.state = state;
        this.title = title;
        this.priority = priority;
        this.assigned_to = assigned_to;
        this.assignee = assignee ? new Member(assignee) : null;
        this.work_order_type = work_order_type;
        this.memo = memo;
        this.vehicle_id = vehicle_id
        this.vehicle = vehicle ? new Truck(vehicle) : null;
        this.meter_reading = meter_reading;
        this.meter_reading_unit = meter_reading_unit;
        this.start_date = start_date;
        this.due_date = due_date;
        this.estimated_cost = estimated_cost;
        this.estimated_hours = estimated_hours;
        this.work_order_tasks = work_order_tasks.map(task => new Task(task));
        this.materials = materials.map(material => new Material(material));
        this.labours = labours.map(labour => new Labour(labour));
        this.work_order_comments = work_order_comments.map(comment => new Comment(comment));
        this.additional_costs = additional_costs.map(cost => new AdditionalCost(cost));
        this.total_material_cost = total_material_cost;
        this.total_labour_cost = total_labour_cost;
        this.additional_cost = additional_cost;
        this.tax = tax;
        this.total_cost = total_cost;
    }

    setAssignee(assignee) {
        const {id = ''} = assignee || {};
        this.assigned_to = id;
        this.assignee = assignee;
    }

    setVehicle(vehicle) {
        const {id = '', meter_reading = '', meter_reading_unit = ''} = vehicle || {};
        this.vehicle_id = id;
        this.meter_reading = meter_reading;
        this.meter_reading_unit = meter_reading_unit;
        this.vehicle = vehicle;
    }

    setTotalCost() {
        this.total_cost = this.total_material_cost + this.total_labour_cost + this.additional_cost + this.tax;
    }

    setTotalMaterialCost() {
        let total = 0;
        this.materials.filter(item => !item._destroy).forEach(material => {
            total = total + (material.quantity * material.cost);
        });
        this.total_material_cost = total;
        this.setTotalCost();
    }

    setTotalLabourCost() {
        let total = 0;
        this.labours.filter(item => !item._destroy).forEach(labour => {
            total = total + (labour.labour_rate * labour.hours);
        });
        this.total_labour_cost = total;
        this.setTotalCost();
    }

    setTotalAdditionalCost() {
        let total = 0;
        this.additional_costs.filter(item => !item._destroy).forEach(additionalCost => {
            total = total + additionalCost.cost;
        });
        this.additional_cost = total;
        this.setTotalCost();
    }

    addTask(task) {
        this.work_order_tasks.push(new Task(task));
    }

    updateTask(task, index) {
        this.work_order_tasks[index] = new Task(task);
    }

    removeTask(index) {
        if (this.work_order_tasks[index]['id']) {
            this.work_order_tasks[index]['_destroy'] = true;
        } else {
            this.work_order_tasks = this.work_order_tasks.filter((_, i) => i !== index);
        }
    }

    addMaterial(material) {
        this.materials.push(new Material(material));
        this.setTotalMaterialCost();
    }

    updateMaterial(material, index) {
        this.materials[index] = new Material(material);
        this.setTotalMaterialCost();
    }

    removeMaterial(index) {
        if (this.materials[index]['id']) {
            this.materials[index]['_destroy'] = true;
        } else {
            this.materials = this.materials.filter((_, i) => i !== index);
        }
        this.setTotalMaterialCost();
    }

    addLabour(labour) {
        this.labours.push(new Labour(labour));
        this.setTotalLabourCost();
    }

    updateLabour(labour, index) {
        this.labours[index] = new Labour(labour);
        this.setTotalLabourCost();
    }

    removeLabour(index) {
        if (this.labours[index]['id']) {
            this.labours[index]['_destroy'] = true;
        } else {
            this.labours = this.labours.filter((_, i) => i !== index);
        }
        this.setTotalLabourCost();
    }

    addAdditionalCost(additionalCost) {
        this.additional_costs.push(new AdditionalCost(additionalCost));
        this.setTotalAdditionalCost();
    }

    updateAdditionalCost(additionalCost, index) {
        this.additional_costs[index] = new AdditionalCost(additionalCost);
        this.setTotalAdditionalCost();
    }

    removeAdditionalCost(index) {
        if (this.additional_costs[index]['id']) {
            this.additional_costs[index]['_destroy'] = true;
        } else {
            this.additional_costs = this.additional_costs.filter((_, i) => i !== index);
        }
        this.setTotalAdditionalCost();
    }

    addComment(comment) {
        this.work_order_comments.push(new Comment(comment));
    }

    updateComment(comment, index) {
        this.work_order_comments[index] = new Comment(comment);
    }

    removeComment(index) {
        if (this.work_order_comments[index]['id']) {
            this.work_order_comments[index]['_destroy'] = true;
        } else {
            this.work_order_comments = this.work_order_comments.filter((_, i) => i !== index);
        }
    }
}

export {Order, Task, Material, Labour, Comment, AdditionalCost};
