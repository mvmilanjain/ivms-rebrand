import {Route} from "./Route";

class RouteRate {
    constructor(props) {
        const {
            id = '',
            count_in_hand = 0,
            rate_per_tone = 0,
            rate_per_tone_km = 0,
            proposed_rate_per_tone = 0,
            avg_tonnage = 0
        } = props || {};
        this.id = id;
        this.count_in_hand = count_in_hand;
        this.rate_per_tone = rate_per_tone;
        this.rate_per_tone_km = rate_per_tone_km;
        this.proposed_rate_per_tone = proposed_rate_per_tone;
        this.avg_tonnage = avg_tonnage;
    }
}

class ProductRoute {
    constructor(props) {
        const {
            id = '',
            route_id = '',
            route = null,
            contractor_id = '',
            contractor = null,
            std_tonnage = '',
            avg_rate = 0,
            avg_load_weight = 0,
            max_load_weight = 0,
            route_rate = null,
            _destroy = false
        } = props || {};

        this.id = id;
        this.route_id = route_id;
        this.route = route ? new Route(route) : null;
        this.contractor_id = contractor_id;
        this.contractor = contractor;
        this.std_tonnage = std_tonnage;
        this.avg_rate = avg_rate;
        this.avg_load_weight = avg_load_weight;
        this.max_load_weight = max_load_weight;
        this.route_rate = new RouteRate(route_rate);
        this._destroy = _destroy;
    }

    setRoute(route) {
        const {id = ''} = route || {};
        this.route_id = id;
        this.route = route;
    }

    setContractor(contractor) {
        const {id = ''} = contractor || {};
        this.contractor_id = id;
        this.contractor = contractor;
    }
}

class Product {
    constructor(props) {
        const {id = '', name = '', volume = 0, product_routes = []} = props || {};
        this.id = id;
        this.name = name;
        this.volume = volume;
        this.product_routes = [];
        this.setProductRoutes(product_routes);
    }

    setProductRoutes(productRoutes) {
        let activeProductRoutes = productRoutes.filter(item => !item._destroy).map(item => new ProductRoute(item));
        let nonActiveProductRoutes = productRoutes.filter(item => item._destroy).map(item => new ProductRoute(item));
        this.product_routes = [...activeProductRoutes, ...nonActiveProductRoutes];
    }

    addProductRoute(productRoute) {
        let activeProductRoutes = this.getActiveProductRoute();
        activeProductRoutes.push(new ProductRoute(productRoute));
        this.product_routes = [...activeProductRoutes, ...this.getNonActiveProductRoute()];
    }

    updateProductRoute(productRoute, index) {
        this.product_routes[index] = new ProductRoute(productRoute);
    }

    removeProductRoute(index) {
        let activeProductRoutes = this.getActiveProductRoute();
        let nonActiveProductRoutes = this.getNonActiveProductRoute();

        if (activeProductRoutes[index]['id']) {
            nonActiveProductRoutes.push({...activeProductRoutes[index], _destroy: true});
        }
        activeProductRoutes = activeProductRoutes.filter((item, i) => i !== index);
        this.product_routes = [...activeProductRoutes, ...nonActiveProductRoutes];
    }

    getActiveProductRoute() {
        return this.product_routes.filter(item => !item._destroy);
    }

    getNonActiveProductRoute() {
        return this.product_routes.filter(item => item._destroy);
    }
}

export {Product, ProductRoute, RouteRate};
