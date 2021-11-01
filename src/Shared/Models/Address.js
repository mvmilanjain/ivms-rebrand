import {GEOFENCE, LATLNG} from "../Utilities/constant";

class Address {
    constructor(props) {
        const {
            id = '',
            name = '',
            address_type = '',
            address1 = '',
            address2 = '',
            city = '',
            state = '',
            country = '',
            zipcode = '',
            phone = '',
            drawing_type = 'polygon',
            latitude = LATLNG.lat,
            longitude = LATLNG.lng,
            geofence = GEOFENCE,
            radius = 0
        } = props || {};
        this.id = id;
        this.name = name;
        this.address_type = address_type;
        this.address1 = address1;
        this.address2 = address2;
        this.city = city;
        this.state = state;
        this.country = country;
        this.zipcode = zipcode;
        this.phone = phone;
        this.drawing_type = drawing_type;
        this.latitude = latitude;
        this.longitude = longitude;
        this.geofence = geofence || [];
        this.radius = radius;
    }

    setAddress(address) {
        this.clearAddress();
        const {address_components, geometry} = address || {};
        const {lat, lng} = geometry['location'];
        this.latitude = lat;
        this.longitude = lng;
        if (this.drawing_type === 'polygon') {
            this.setGeofence();
            this.radius = 0;
        }

        address_components.forEach(item => {
            const name = item['long_name'];
            const type = item['types'][0];
            switch (type) {
                case 'route': {
                    this.address1 = name;
                    break;
                }
                case 'administrative_area_level_2': {
                    this.city = name;
                    break;
                }
                case 'administrative_area_level_1': {
                    this.state = name;
                    break;
                }
                case 'country': {
                    this.country = name;
                    break;
                }
                case 'postal_code': {
                    this.zipcode = name;
                    break;
                }
                default:
                    break;
            }
        });
    }

    setDrawingType(type) {
        this.drawing_type = type;
        if (type === 'circle') {
            this.geofence = [];
            this.radius = 10;
        } else {
            this.setGeofence();
            this.radius = 0;
        }
    }

    clearAddress() {
        this.address1 = '';
        this.address2 = '';
        this.city = '';
        this.state = '';
        this.country = '';
        this.zipcode = '';
        this.phone = '';
        this.geofence = [];
    }

    setGeofence(geofence) {
        if (geofence) {
            this.geofence = geofence;
        } else {
            this.geofence = this.calculateGeofenceFromCenter();
        }
    }

    calculateGeofenceFromCenter() {
        const topLeft = {lat: this.latitude - 0.0001, lng: this.longitude - 0.0001}
        const topRight = {lat: this.latitude + 0.0001, lng: this.longitude - 0.0001}
        const bottomRight = {lat: this.latitude + 0.0001, lng: this.longitude + 0.0001}
        const bottomLeft = {lat: this.latitude - 0.0001, lng: this.longitude + 0.0001}
        return [topLeft, topRight, bottomRight, bottomLeft]
    }

    addressString() {
        const arr = [this.address1, this.address2, this.city, this.state, this.country, this.zipcode];
        return arr.filter(item => !!item).join(", ");
    }
}

export {Address};
