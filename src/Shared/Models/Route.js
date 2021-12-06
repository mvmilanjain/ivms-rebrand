import {Address} from "./Address";
import {getNumberRoundToOneDecimal} from "../Utilities/common.util";

class Route {
    constructor(props) {
        const {
            id = '',
            route_code = '',
            name = '',
            std_distance_cycle = 0,
            std_cycle_hours = 0,
            equivalent_loads = 0,
            source = '',
            source_address = null,
            destination = '',
            destination_address = null,
            route_planner = null
        } = props || {};

        this.id = id;
        this.route_code = route_code;
        this.name = name;
        this.std_distance_cycle = std_distance_cycle;
        this.std_cycle_hours = std_cycle_hours;
        this.equivalent_loads = equivalent_loads;
        this.source = source;
        this.source_address = source_address ? new Address(source_address) : null;
        this.destination = destination;
        this.destination_address = destination_address ? new Address(destination_address) : null;
        this.route_planner = new RoutePlanner(route_planner);
    }

    setSource(address) {
        const {id: source = ''} = address || {};
        const activeRouteStops = this.getActiveRouteStops();

        if (address) {
            const routeStop = new RouteStop({address_id: source, address, position: 1});
            if (this.source) {
                if (activeRouteStops.length && activeRouteStops[0].address_id === this.source) {
                    this.route_planner.route_stops = [routeStop, ...this.route_planner.route_stops];
                    this.removeRouteStop(1);
                } else {
                    activeRouteStops.splice(0, 0, routeStop);
                    this.route_planner.route_stops = [...activeRouteStops, ...this.getNonActiveRouteStops()];
                    this.updateRouteStopPosition();
                }
            } else {
                this.route_planner.route_stops = [routeStop, ...this.route_planner.route_stops];
                this.updateRouteStopPosition();
            }

        } else if (this.source && activeRouteStops.length && activeRouteStops[0].address_id === this.source) {
            this.removeRouteStop(0);
        }
        this.source = source;
        this.source_address = address;
        this.route_planner.origin = source;
        this.route_planner.origin_address = address;
    }

    setDestination(address) {
        const {id: destination = ''} = address || {};
        const activeRouteStops = this.getActiveRouteStops();
        const lastIndex = activeRouteStops.length - 1;

        if (address) {
            const routeStop = new RouteStop({address_id: destination, address});
            if (this.destination) {
                if (activeRouteStops.length && activeRouteStops[lastIndex].address_id === this.destination) {
                    activeRouteStops.push(routeStop);
                    this.route_planner.route_stops = [...activeRouteStops, ...this.getNonActiveRouteStops()];
                    this.removeRouteStop(lastIndex);
                } else {
                    activeRouteStops.push(routeStop);
                    this.route_planner.route_stops = [...activeRouteStops, ...this.getNonActiveRouteStops()];
                    this.updateRouteStopPosition();
                }
            } else {
                this.addRouteStop(routeStop);
            }
        } else if (this.destination && activeRouteStops.length && activeRouteStops[lastIndex].address_id === this.destination) {
            this.removeRouteStop(lastIndex);
        }

        this.destination = destination;
        this.destination_address = address;
    }

    setLoadingTime(loading_time) {
        this.route_planner.loading_time = loading_time;
        if (this.source && this.route_planner.route_stops[0].address_id === this.source) {
            this.route_planner.route_stops[0].stop_duration = loading_time;
        }
    }

    addRouteStop(routeStop) {
        const activeRouteStops = this.getActiveRouteStops();
        let nonActiveRouteStops = this.getNonActiveRouteStops();
        const lastIndex = activeRouteStops.length - 1;

        if (this.destination && activeRouteStops[lastIndex].address_id === this.destination) {
            routeStop.position = activeRouteStops.length;
            const start = activeRouteStops.length - 1;
            activeRouteStops.splice(start, 0, routeStop);
        } else {
            routeStop.position = this.getActiveRouteStops().length + 1;
            activeRouteStops.push(routeStop);
        }
        this.route_planner.route_stops = [...activeRouteStops, ...nonActiveRouteStops];
        this.updateRouteStopPosition();
    }

    removeRouteStop(index) {
        let activeRouteStops = this.getActiveRouteStops();
        let nonActiveRouteStops = this.getNonActiveRouteStops();

        if (activeRouteStops[index]['id']) {
            const selectedRouteStop = activeRouteStops[index];
            nonActiveRouteStops.push({...selectedRouteStop, _destroy: true});
            activeRouteStops[index]['_destroy'] = true;
        }
        activeRouteStops = activeRouteStops.filter((item, i) => i !== index);
        this.route_planner.route_stops = [...activeRouteStops, ...nonActiveRouteStops];
        this.updateRouteStopPosition();
    }

    moveRouteStop(index, direction) {
        const movableRouteStop = {...this.route_planner.route_stops[index]};
        if (direction === 'UP') {
            this.route_planner.route_stops[index] = this.route_planner.route_stops[index - 1];
            this.route_planner.route_stops[index - 1] = movableRouteStop;
        } else {
            this.route_planner.route_stops[index] = this.route_planner.route_stops[index + 1];
            this.route_planner.route_stops[index + 1] = movableRouteStop;
        }
        this.updateRouteStopPosition();
    }

    updateRouteStopPosition() {
        let position = 1;
        this.route_planner.route_stops.forEach(stop => {
            if (!stop._destroy) {
                stop.position = position;
                position++;
            } else {
                stop.position = -1;
            }
        });
    }

    getActiveRouteStops() {
        return this.route_planner.route_stops.filter(stop => !stop._destroy);
    }

    getNonActiveRouteStops() {
        return this.route_planner.route_stops.filter(stop => stop._destroy);
    }

    updateTotalDistanceAndCycleTime() {
        let totalDistance = 0;
        let totalStopDuration = 0;
        this.getActiveRouteStops().forEach(stop => {
            totalDistance = totalDistance + Number(stop.distance);
            totalStopDuration = totalStopDuration + Number(stop.stop_duration);
        });
        this.std_distance_cycle = totalDistance;
        this.std_cycle_hours = getNumberRoundToOneDecimal(totalDistance / 65) + totalStopDuration;
    }
}

class RoutePlanner {
    constructor(props) {
        const {
            id = '',
            loading_time = 0,
            route_stops = []
        } = props || {};

        this.id = id;
        this.loading_time = loading_time;
        this.route_stops = this.setRouteStops(route_stops);
    }

    setRouteStops(routeStops = []) {
        let activeRouteStops = routeStops.filter(stop => !stop._destroy)
            .sort((a, b) => (a.position > b.position) ? 1 : -1)
            .map(stop => new RouteStop(stop));
        let nonActiveRouteStops = routeStops.filter(stop => stop._destroy).map(stop => new RouteStop(stop));

        return [...activeRouteStops, ...nonActiveRouteStops];
    }

}

class RouteStop {
    constructor(props) {
        const {
            id = '',
            position,
            address_id = '',
            address = null,
            distance = 0,
            stop_duration = 0,
            _destroy = false
        } = props || {};

        this.id = id;
        this.position = position;
        this.address_id = address ? address.id : '';
        this.address = address ? new Address(address) : null;
        this.distance = distance;
        this.stop_duration = stop_duration;
        this._destroy = _destroy;
    }

    setAddress(address) {
        const {id: address_id = ''} = address || {};
        this.address_id = address_id;
        this.address = address;
    }
}

export {Route, RoutePlanner, RouteStop};