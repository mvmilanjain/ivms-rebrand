import {Address} from './Address';
import {addMinutesToDate} from '../Utilities/common.util';

class Operation {
    constructor(props) {
        const {
            id = '',
            order_number = '',
            status = '',
            pod_status = '',
            rate_per_tone = 0,
            actual_amount = 0,
            planned_origin_departure_time = null,
            planned_eta_destination = null,
            loading_odo_km = 0,
            offloading_odo_km = 0,
            is_empty_leg = false,
            vehicle = null,
            member = null,
            route_order_actual_info = {}
        } = props || {};

        this.id = id;
        this.order_number = order_number;
        this.order_state = 'operation';
        this.status = status;
        this.pod_status = pod_status;
        this.rate_per_tone = rate_per_tone;
        this.actual_amount = actual_amount;
        this.planned_origin_departure_time = planned_origin_departure_time;
        this.planned_eta_destination = planned_eta_destination;
        this.loading_odo_km = loading_odo_km;
        this.offloading_odo_km = offloading_odo_km;
        this.is_empty_leg = is_empty_leg;
        this.vehicle = vehicle;
        this.member = member;
        this.route_order_actual_info = new RouteOrderActualInfo(route_order_actual_info);
    }

    setOrder(order) {
        const {
            id = '',
            rate_per_tone = 0,
            status = '',
            pod_status = '',
            vehicle = null,
            member = null,
            planned_origin_departure_time = null,
            planned_eta_destination = null,
            estimated_fuel_location_id = '',
            estimated_fuel_location = null,
            fuel_required_for_trip = 0,
            planned_cycle_time = 0,
            planned_distance = 0,
            planned_tonnage = 0,
            is_empty_leg = false,
            route_order_stoppages = []
        } = order || {};
        this.route_order_actual_info.route_order_id = id;
        this.route_order_actual_info.start_time = planned_origin_departure_time;
        this.route_order_actual_info.end_time = planned_eta_destination;
        this.route_order_actual_info.fuel_liters_filled = fuel_required_for_trip;
        this.route_order_actual_info.cycle_time = planned_cycle_time;
        this.route_order_actual_info.distance = planned_distance;
        this.route_order_actual_info.tonnage_loaded = planned_tonnage;
        this.status = status;
        this.pod_status = pod_status;
        this.is_empty_leg = is_empty_leg;
        this.vehicle = vehicle;
        this.member = member;
        this.route_order_actual_info.fuel_point_id = estimated_fuel_location_id;
        this.route_order_actual_info.fuel_point = estimated_fuel_location;
        this.route_order_actual_info.route_order_actual_stop_infos = route_order_stoppages
            .sort((a, b) => (a.position - b.position))
            .map(stop => new RouteOrderActualStopInfo({
                ...stop, id: '', route_order_stoppage_id: stop.id
            }));

        this.planned_origin_departure_time = planned_origin_departure_time;
        this.planned_eta_destination = planned_eta_destination;
        this.setRatePerTone(rate_per_tone);
        this.setRouteStops(route_order_stoppages);

    }

    setRatePerTone(ratePerTone) {
        this.rate_per_tone = ratePerTone || 0;
        this.setActualAmount();
    }

    setTonnageLoaded(tonnage_loaded) {
        this.route_order_actual_info.tonnage_loaded = tonnage_loaded;
        this.setActualAmount();
    }

    setActualAmount() {
        this.actual_amount = Math.round(this.rate_per_tone * this.route_order_actual_info.tonnage_loaded);
    }

    setRouteStops(routeStops = []) {
        let activeRouteStops = routeStops.filter(stop => !stop._destroy)
            .sort((a, b) => (a.position > b.position) ? 1 : -1)
            .map(stop => new RouteOrderActualStopInfo(stop));
        let nonActiveRouteStops = routeStops.filter(stop => stop._destroy).map(stop => new RouteOrderActualStopInfo(stop));

        return [...activeRouteStops, ...nonActiveRouteStops];
    }
}

class RouteOrderActualInfo {
    constructor(props) {
        const {
            id = '',
            route_order_id = '',
            start_time = null,
            end_time = null,
            fuel_point_id = '',
            fuel_point = null,
            fuel_liters_filled = 0,
            distance = 0,
            cycle_time = 0,
            tonnage_loaded = 0,
            pod_number = '',
            delivery_note_number = '',
            document_recieved = false,

            loading_slips = [],
            offloading_slips = [],
            fuel_slips = [],
            toll_slips = [],
            truck_wash_slips = [],
            pod_slips = [],
            truck_stop_slips = [],

            route_order_actual_stop_infos = []
        } = props || {};
        this.id = id;
        this.route_order_id = route_order_id;
        this.start_time = start_time;
        this.end_time = end_time;
        this.fuel_point_id = fuel_point_id;
        this.fuel_point = fuel_point;
        this.fuel_liters_filled = fuel_liters_filled;
        this.distance = distance;
        this.cycle_time = cycle_time;
        this.tonnage_loaded = tonnage_loaded;
        this.pod_number = pod_number;
        this.delivery_note_number = delivery_note_number;
        this.document_recieved = document_recieved;

        this.loading_slips = loading_slips;
        this.offloading_slips = offloading_slips;
        this.fuel_slips = fuel_slips;
        this.toll_slips = toll_slips;
        this.truck_wash_slips = truck_wash_slips;
        this.pod_slips = pod_slips;
        this.truck_stop_slips = truck_stop_slips;

        this.route_order_actual_stop_infos = this.setStoppages(route_order_actual_stop_infos);
    }

    setStoppages(stoppages) {
        let activeStops = stoppages.filter(stop => !stop._destroy)
            .sort((a, b) => (a.position > b.position) ? 1 : -1)
            .map(stop => new RouteOrderActualStopInfo(stop));
        let nonActiveStops = stoppages.filter(stop => stop._destroy).map(stop => new RouteOrderActualStopInfo(stop));

        return [...activeStops, ...nonActiveStops];
    }

    addStoppage(stoppage) {
        const activeStoppages = this.getActiveStoppages();
        stoppage.position = activeStoppages.length;
        const start = activeStoppages.length - 1;
        activeStoppages.splice(start, 0, stoppage);

        this.route_order_actual_stop_infos = [...activeStoppages, ...this.getNonActiveStoppages()];
        this.updateStoppagePosition();
    }

    removeStoppage(index) {
        let activeStoppages = this.getActiveStoppages();
        const nonActiveStoppages = this.getNonActiveStoppages();

        if (activeStoppages[index]['id']) {
            const selectedStoppage = activeStoppages[index];
            nonActiveStoppages.push({...selectedStoppage, _destroy: true});
            activeStoppages[index]['_destroy'] = true;
        }
        activeStoppages = activeStoppages.filter((item, i) => i !== index);
        this.route_order_actual_stop_infos = [...activeStoppages, ...nonActiveStoppages];
        this.updateStoppagePosition();
    }

    moveStoppage(index, direction) {
        const movableStoppage = {...this.route_order_actual_stop_infos[index]};
        if (direction === 'UP') {
            this.route_order_actual_stop_infos[index] = this.route_order_actual_stop_infos[index - 1];
            this.route_order_actual_stop_infos[index - 1] = movableStoppage;
        } else {
            this.route_order_actual_stop_infos[index] = this.route_order_actual_stop_infos[index + 1];
            this.route_order_actual_stop_infos[index + 1] = movableStoppage;
        }
        this.updateStoppagePosition();
    }

    updateStoppagePosition() {
        let position = 1;
        this.route_order_actual_stop_infos.forEach(stop => {
            if (!stop._destroy) {
                stop.position = position;
                position++;
            } else {
                stop.position = -1;
            }
        });
    }

    updateStoppages() {
        let startTime = new Date(this.start_time);
        let activeStoppages = this.getActiveStoppages();
        activeStoppages.forEach(stop => {
            const distanceToTravel = Number(stop.distance) || 0;
            const stopDuration = Number(stop.stop_duration) || 0;
            const estimatedArrivalTime = addMinutesToDate(startTime, Math.round((distanceToTravel / 65) * 60));
            startTime = addMinutesToDate(estimatedArrivalTime, Math.round(stopDuration * 60));

            stop.estimated_arrival_time = estimatedArrivalTime;
        });
        this.route_order_actual_stop_infos = [...activeStoppages, ...this.getNonActiveStoppages()];
        this.updateStoppagePosition();
    }

    updateDistanceAndTime() {
        this.updateStoppages();
        let totalDistance = 0;
        let totalStopDuration = 0;
        this.getActiveStoppages().forEach(stop => {
            totalDistance = totalDistance + Number(stop.distance);
            totalStopDuration = totalStopDuration + Number(stop.stop_duration);
        });
        this.distance = totalDistance;
        this.cycle_time = Math.round((totalDistance / 65) + totalStopDuration);
    }

    setFuelPoint(fuel_point) {
        const {id = ''} = fuel_point;
        this.fuel_point_id = id;
        this.fuel_point = fuel_point;
    }

    getActiveStoppages() {
        return this.route_order_actual_stop_infos.filter(stop => !stop._destroy);
    }

    getNonActiveStoppages() {
        return this.route_order_actual_stop_infos.filter(stop => stop._destroy);
    }

}

class RouteOrderActualStopInfo {
    constructor(props) {
        const {
            id = '',
            route_order_stoppage_id = '',
            position,
            address_id = '',
            address = null,
            distance = 0,
            estimated_arrival_time = null,
            actual_arrival_time = null,
            stop_duration = 0,
            _destroy = false
        } = props || {};

        this.id = id;
        this.route_order_stoppage_id = route_order_stoppage_id;
        this.position = position;
        this.address_id = address_id;
        this.address = address ? new Address(address) : null;
        this.distance = distance;
        this.estimated_arrival_time = estimated_arrival_time;
        this.actual_arrival_time = actual_arrival_time;
        this.stop_duration = stop_duration;
        this._destroy = _destroy;
    }

    setAddress(address) {
        const {id: address_id = ''} = address || {};
        this.address_id = address_id;
        this.address = address;
    }
}

export {Operation, RouteOrderActualInfo, RouteOrderActualStopInfo};
