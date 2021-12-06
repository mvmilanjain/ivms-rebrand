import {useEffect} from 'react';
import {useNotifications} from '@mantine/notifications';

import {LATLNG} from 'Shared/Utilities/constant';
import {getAddressLabel} from 'Shared/Utilities/common.util';

let map = null;
let directionsService = null;
let directionsRenderer = null;

const initMap = () => {
    const mapOptions = {center: {lat: LATLNG.lat, lng: LATLNG.lng}, zoom: 10};
    map = new window.google.maps.Map(document.getElementById("route-map"), mapOptions);
    directionsService = new window.google.maps.DirectionsService();
    directionsRenderer = new window.google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);
};

const RouteMap = ({routeStoppageList, onRouteStopChange}) => {
    const notifications = useNotifications();

    useEffect(() => {
        initMap();
    }, []);

    useEffect(() => {
        (routeStoppageList.length > 1) && calculateAndDisplayRoute();
    }, [routeStoppageList]);

    const calculateAndDisplayRoute = (routeStoppageList) => {
        const originAddress = routeStoppageList[0].address;
        const destinationAddress = routeStoppageList[routeStoppageList.length - 1].address;
        const waypoints = [];
        routeStoppageList.slice(1, routeStoppageList.length - 1).filter(stop => stop.address).forEach(stop => {
            const lat = stop.address.latitude;
            const lng = stop.address.longitude;
            waypoints.push({location: new window.google.maps.LatLng(lat, lng), stopover: true});
        });
        const origin = new window.google.maps.LatLng(originAddress.latitude, originAddress.longitude);
        const destination = new window.google.maps.LatLng(destinationAddress.latitude, destinationAddress.longitude);
        const payload = {
            origin, destination, waypoints,
            optimizeWaypoints: false,
            travelMode: window.google.maps.TravelMode.DRIVING
        };
        directionsService.route(payload).then(res => {
            res.routes[0].legs.forEach((leg, i) => {
                leg.start_address = getAddressLabel(routeStoppageList[i].address);
                leg.end_address = getAddressLabel(routeStoppageList[i + 1].address);
            });
            directionsRenderer.setDirections(res);
            onRouteStopChange('success', res.routes[0]);
        }).catch(error => {
            console.error(error);
            notifications.showNotification({
                title: "Error", color: 'red',
                message: error.message
            });
            onRouteStopChange('fail', []);
        });
    };

    return <div style={{height: '100%'}} id="route-map"/>
};

export default RouteMap;