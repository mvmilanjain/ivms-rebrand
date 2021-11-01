import get from "lodash/get";

import {addMinutesToDate, getHoursFromDate, getNumberRoundToOneDecimal} from "../Utilities/common.util";
import {Address, Member, Route, Truck} from "./";

class Plan {
    constructor(props) {
        const {
            id = '',
            order_number = '',
            order_date = new Date(),
            member_id = '',
            member = null,
            vehicle_id = '',
            vehicle = null,
            route_id = '',
            route = null,
            equivalent_loads = 0,
            planned_distance = 0,
            planned_cycle_time = 0,
            product_id = '',
            product = null,
            planned_tonnage = '',
            rate_per_tone = '',
            planned_load_start_time = null,
            planned_eta_destination = null,
            planned_origin_departure_time = null,
            planned_fuel = 0,
            fuel_required_for_trip = 0,
            fuel_stop_required = false,
            is_empty_leg = false,
            route_order_stoppages = [],
            estimated_fuel_location_id = '',
            estimated_fuel_location = null,
            service_location_id = '',
            service_location = null,
            truck_required_for_service = false,
            enroute_to_hub = false,
            congestion_at_destination = false,
            congestion_severity = '',
            driver_current_route_id = '',
            driver_current_route = null,
            estimated_distance_to_destination = 0,
            current_fuel_level = 0,
            current_consumption_rate = 0,
            current_route_empty_leg = false,
            contractor_id = '',
            contractor = null
        } = props || {};

        this.id = id;
        this.order_number = order_number;
        this.order_state = 'planning';
        this.order_date = order_date;

        this.vehicle_id = vehicle_id;
        this.vehicle = vehicle ? new Truck(vehicle) : null;

        this.member_id = member_id;
        this.member = member ? new Member(member) : null;
        this.route_id = route_id;
        this.route = route ? new Route(route) : null;
        this.equivalent_loads = equivalent_loads;
        this.planned_distance = planned_distance;
        this.planned_cycle_time = planned_cycle_time;
        this.product_id = product_id;
        this.product = product;
        this.planned_tonnage = planned_tonnage;
        this.rate_per_tone = rate_per_tone;
        this.planned_load_start_time = planned_load_start_time;
        this.planned_eta_destination = planned_eta_destination;
        this.planned_origin_departure_time = planned_origin_departure_time;
        this.planned_fuel = planned_fuel;
        this.fuel_required_for_trip = fuel_required_for_trip;
        this.fuel_stop_required = fuel_stop_required;
        this.estimated_fuel_location_id = estimated_fuel_location_id;
        this.estimated_fuel_location = estimated_fuel_location_id ? new Address(estimated_fuel_location) : null;
        this.service_location_id = service_location_id;
        this.service_location = service_location_id ? new Address(service_location) : null;
        this.is_empty_leg = is_empty_leg;
        this.route_order_stoppages = this.setRouteStops(route_order_stoppages);
        this.truck_required_for_service = truck_required_for_service;
        this.enroute_to_hub = enroute_to_hub;
        this.congestion_at_destination = congestion_at_destination;
        this.congestion_severity = congestion_severity;
        this.driver_current_route_id = driver_current_route_id;
        this.driver_current_route = driver_current_route ? new Plan(driver_current_route) : null;
        this.estimated_distance_to_destination = estimated_distance_to_destination;
        this.current_fuel_level = current_fuel_level;
        this.current_consumption_rate = (current_consumption_rate && current_consumption_rate > 0)
            ? current_consumption_rate : 1.75;
        this.current_route_empty_leg = current_route_empty_leg;
        this.contractor_id = contractor_id;
        this.contractor = contractor;
    }

    static copyPlan(plan, lastPlanEta) {
        const resultPlan = new Plan({...plan, id: '', order_number: '', order_date: new Date()});
        resultPlan.route_order_stoppages = resultPlan.route_order_stoppages.map(stoppage => ({...stoppage, id: ''}));
        resultPlan.calculatePlannedTiming(lastPlanEta);
        resultPlan.updateStoppages();
        return resultPlan;
    }

    setVehicle(vehicle) {
        const {id = '', members = []} = vehicle || {};
        this.vehicle_id = id;
        this.vehicle = vehicle;
        if (!this.member_id && members.length > 0) {
            this.setMember(members[0]);
        }
    }

    setMember(member) {
        const {id = ''} = member || {};
        this.member_id = id;
        this.member = member;
    }

    setRoute(route, lastPlanEta) {
        const {
            id = '',
            std_distance_cycle = 0,
            std_cycle_hours = 0,
            route_planner = null,
            equivalent_loads = 0
        } = route || {};
        const {route_stops = []} = route_planner || {};
        this.route_id = id;
        this.route = route;
        this.planned_distance = std_distance_cycle;
        this.planned_cycle_time = std_cycle_hours;
        this.equivalent_loads = equivalent_loads;
        this.calculateFuelData();
        this.calculatePlannedTiming(lastPlanEta);

        let startTime = new Date(this.planned_load_start_time);
        this.route_order_stoppages = route_stops.map(stop => {
            const {address} = stop;
            const {id: address_id = ''} = address || {};
            const routeOrderStop = new RouteOrderStop({...stop, id: '', address_id});
            const distanceToTravel = Number(stop.distance) || 0;
            const estimatedArrivalTime = addMinutesToDate(startTime, Math.round((distanceToTravel / 65) * 60));
            const estimatedDepartureTime = addMinutesToDate(estimatedArrivalTime, Math.round(routeOrderStop.stop_duration * 60));

            routeOrderStop.estimated_arrival_time = estimatedArrivalTime;
            routeOrderStop.estimated_departure_time = estimatedDepartureTime;
            startTime = estimatedDepartureTime;
            return routeOrderStop;
        });
    }

    setPlannedCycleTime(planned_cycle_time) {
        const minutesToAdd = Math.round(planned_cycle_time * 60);
        this.planned_cycle_time = planned_cycle_time;
        this.planned_eta_destination = addMinutesToDate(this.planned_load_start_time, minutesToAdd);
    }

    setPlannedLoadStartTime(planned_load_start_time, lastPlanEta) {
        if (planned_load_start_time) {
            this.planned_load_start_time = planned_load_start_time;
            this.planned_origin_departure_time = planned_load_start_time;
            this.planned_eta_destination = addMinutesToDate(this.planned_load_start_time, this.planned_cycle_time * 60);
        } else {
            this.calculatePlannedTiming(lastPlanEta);
        }
        this.updateStoppages();
    }

    setProduct(product) {
        const {id = ''} = product || {};
        this.product_id = id;
        this.product = product;
        !product && this.setContractor(null);
    }

    setContractor(contractor) {
        const {id = ''} = contractor || {};
        this.contractor_id = id;
        this.contractor = contractor;

        if (contractor) {
            const {product_routes = []} = this.product;
            const selectedProductRoute = product_routes.find(item => (item.route_id === this.route_id) && (item.contractor_id === id));
            this.rate_per_tone = get(selectedProductRoute, 'route_rate.rate_per_tone', this.rate_per_tone);
            this.planned_tonnage = get(selectedProductRoute, 'std_tonnage', this.planned_tonnage);
        }
    }

    setCongestionAtDestination(congestion_at_destination) {
        this.congestion_at_destination = congestion_at_destination;
        if (!congestion_at_destination) {
            this.congestion_severity = '';
        }
    }

    setCurrentTripInfo() {
    }

    setRouteStops(routeStops = []) {
        let activeRouteStops = routeStops.filter(stop => !stop._destroy)
            .sort((a, b) => (a.position > b.position) ? 1 : -1)
            .map(stop => new RouteOrderStop(stop));
        let nonActiveRouteStops = routeStops.filter(stop => stop._destroy).map(stop => new RouteOrderStop(stop));

        return [...activeRouteStops, ...nonActiveRouteStops];
    }

    addStoppage(stoppage) {
        const activeStoppages = this.getActiveStoppages();
        const lastIndex = activeStoppages.length - 1;

        if (this.route_id && activeStoppages[lastIndex].address_id === this.route.destination) {
            stoppage.position = activeStoppages.length;
            const start = activeStoppages.length - 1;
            activeStoppages.splice(start, 0, stoppage);
        } else {
            stoppage.position = activeStoppages.length + 1;
            activeStoppages.push(stoppage);
        }
        this.route_order_stoppages = [...activeStoppages, ...this.getNonActiveStoppages()];
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
        this.route_order_stoppages = [...activeStoppages, ...nonActiveStoppages];
        this.updateStoppagePosition();
    }

    moveStoppage(index, direction) {
        const movableStoppage = {...this.route_order_stoppages[index]};
        if (direction === 'UP') {
            this.route_order_stoppages[index] = this.route_order_stoppages[index - 1];
            this.route_order_stoppages[index - 1] = movableStoppage;
        } else {
            this.route_order_stoppages[index] = this.route_order_stoppages[index + 1];
            this.route_order_stoppages[index + 1] = movableStoppage;
        }
        this.updateStoppagePosition();
    }

    updateStoppagePosition() {
        let position = 1;
        this.route_order_stoppages.forEach(stop => {
            if (!stop._destroy) {
                stop.position = position;
                position++;
            } else {
                stop.position = -1;
            }
        });
    }

    updateStoppages() {
        let startTime = new Date(this.planned_load_start_time);
        let activeStoppages = this.getActiveStoppages();
        activeStoppages.forEach(stop => {
            const distanceToTravel = Number(stop.distance) || 0;
            const stopDuration = Number(stop.stop_duration) || 0;
            const estimatedArrivalTime = addMinutesToDate(startTime, Math.round((distanceToTravel / 65) * 60));
            const estimatedDepartureTime = addMinutesToDate(estimatedArrivalTime, Math.round(stopDuration * 60));
            startTime = estimatedDepartureTime;

            stop.estimated_arrival_time = estimatedArrivalTime;
            stop.estimated_departure_time = estimatedDepartureTime;
        });
        this.route_order_stoppages = [...activeStoppages, ...this.getNonActiveStoppages()];
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
        this.planned_distance = totalDistance;
        this.planned_cycle_time = getNumberRoundToOneDecimal(totalDistance / 65) + totalStopDuration;
        this.planned_eta_destination = addMinutesToDate(this.planned_load_start_time, this.planned_cycle_time * 60);
    }

    // START: Current Trip Info
    setDriverCurrentRoute(routeOrder) {
        const {id = ''} = routeOrder || {};
        this.driver_current_route_id = id;
        this.driver_current_route = routeOrder;
    }

    setEstimatedDistanceToDestination(distance, shouldCalculatePlannedTime) {
        this.estimated_distance_to_destination = distance;
        this.calculateFuelData();
        shouldCalculatePlannedTime && this.setPlannedLoadStartTime();
    }

    setCurrentFuelLevel(current_fuel_level) {
        this.current_fuel_level = current_fuel_level;
        this.calculateFuelData();
    }

    setConsumptionRate(consumption_rat) {
        this.current_consumption_rate = consumption_rat;
        this.calculateFuelData();
    }

    toggleCurrentRouteEmptyLeg(shouldCalculatePlannedTime) {
        this.current_route_empty_leg = !this.current_route_empty_leg;
        shouldCalculatePlannedTime && this.setPlannedLoadStartTime();
    }

    // END: Current Trip Info

    // Calculation Methods
    calculateFuelData() {
        const distanceCoverOnCurrentFuel = this.current_fuel_level * this.current_consumption_rate;
        const fuelRemAtTripEnd = distanceCoverOnCurrentFuel - this.estimated_distance_to_destination;

        this.planned_fuel = Math.round(this.planned_distance / this.current_consumption_rate);
        this.fuel_stop_required = (this.planned_fuel > fuelRemAtTripEnd);
        this.fuel_required_for_trip = (this.fuel_stop_required) ? (this.planned_fuel - fuelRemAtTripEnd) : 0;
    }

    calculatePlannedTiming(lastPlanEta) {
        if (this.route_id) {
            this.planned_load_start_time = this.getLoadStartTime(lastPlanEta);
            this.planned_origin_departure_time = this.planned_load_start_time;
            this.planned_eta_destination = addMinutesToDate(this.planned_load_start_time, this.planned_cycle_time * 60);
        } else {
            this.planned_load_start_time = null;
            this.planned_eta_destination = null;
            this.planned_origin_departure_time = null;
        }
    }

    getActiveStoppages() {
        return this.route_order_stoppages.filter(stop => !stop._destroy);
    }

    getNonActiveStoppages() {
        return this.route_order_stoppages.filter(stop => stop._destroy);
    }

    getLoadStartTime(lastPlanEta) {
        const currTime = new Date();
        const startTime = (lastPlanEta && (new Date(lastPlanEta) > currTime)) ? new Date(lastPlanEta) : currTime;
        const hoursToReachDestination = lastPlanEta ? 0 : Number(this.estimated_distance_to_destination) / 65;
        const offLoadingHours = this.current_route_empty_leg ? 0 : 0;
        const estimatedStartTime = addMinutesToDate(startTime, Math.round(hoursToReachDestination * 60))
        const estimatedStartHour = getHoursFromDate(estimatedStartTime);
        const sleepOverHours = (estimatedStartHour < 4 || estimatedStartHour >= 23) ? 5 : 0;
        const hoursToAddInStartTime = (hoursToReachDestination + offLoadingHours + sleepOverHours);
        return addMinutesToDate(startTime, Math.round((hoursToAddInStartTime) * 60))
    }
}

class RouteOrderStop {
    constructor(props) {
        const {
            id = '',
            position,
            address_id = '',
            address = null,
            distance = 0,
            estimated_arrival_time = null,
            estimated_departure_time = null,
            stop_duration = 0,
            _destroy = false
        } = props || {};

        this.id = id;
        this.position = position;
        this.address_id = address_id;
        this.address = address ? new Address(address) : null;
        this.distance = distance;
        this.estimated_arrival_time = estimated_arrival_time;
        this.estimated_departure_time = estimated_departure_time;
        this.stop_duration = stop_duration;
        this._destroy = _destroy;
    }

    setAddress(address) {
        const {id: address_id = ''} = address || {};
        this.address_id = address_id;
        this.address = address;
    }
}

export {Plan, RouteOrderStop};
