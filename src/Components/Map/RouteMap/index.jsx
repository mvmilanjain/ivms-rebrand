import {useEffect} from 'react';
import {Paper} from '@mantine/core';
import {useSetState} from '@mantine/hooks';
import {useNotifications} from '@mantine/notifications';

import {LATLNG} from 'Shared/Utilities/constant';
import {getAddressLabel} from 'Shared/Utilities/common.util';

const RouteMap = ({id = "route-map", route, activeStoppages, initialLoad, onChange}) => {
    const [mapState, setMapState] = useSetState({
        map: null, directionsService: null, directionsRenderer: null
    });

    const notifications = useNotifications();

    useEffect(() => {
        const mapOptions = {center: {lat: LATLNG.lat, lng: LATLNG.lng}, zoom: 10};
        let map = new window.google.maps.Map(document.getElementById(id), mapOptions);
        let directionsService = new window.google.maps.DirectionsService();
        let directionsRenderer = new window.google.maps.DirectionsRenderer();
        directionsRenderer.setMap(map);
        setMapState({map, directionsService, directionsRenderer});
    }, []);

    useEffect(() => {
        mapState.directionsService && activeStoppages && (activeStoppages.length > 1) && calculateAndDisplayRoute();
    }, [mapState.directionsService, activeStoppages]);

    const calculateAndDisplayRoute = () => {
        const originAddress = activeStoppages[0].address;
        const destinationAddress = activeStoppages[activeStoppages.length - 1].address;
        const waypoints = [];
        activeStoppages.slice(1, activeStoppages.length - 1).filter(stop => stop.address).forEach(stop => {
            const lat = stop.address.latitude;
            const lng = stop.address.longitude;
            waypoints.push({location: new window.google.maps.LatLng(lat, lng), stopover: true});
        });
        const origin = new window.google.maps.LatLng(originAddress.latitude, originAddress.longitude);
        const destination = new window.google.maps.LatLng(destinationAddress.latitude, destinationAddress.longitude);
        const waypointsList = [];
        if (waypoints.length > 20) {
            const total = waypoints.length;
            let start = 0, end = 10;
            waypointsList.push(waypoints.slice(start, end));
            while (end < total) {
                start = start + 5;
                end = end + 5;
                waypointsList.push(waypoints.slice(start, end));
            }
        } else {
            waypointsList.push(waypoints);
        }

        const routeRenderPromises = [];
        waypointsList.forEach(waypoints => {
            routeRenderPromises.push(new Promise((resolve, reject) => {
                const payload = {
                    origin, destination, waypoints, optimizeWaypoints: false,
                    travelMode: window.google.maps.TravelMode.DRIVING
                };
                mapState.directionsService.route(payload).then(res => resolve(res)).catch(error => reject(error));
            }));
        });
        Promise.allSettled(routeRenderPromises).then(results => {
            if (results.every(res => res.status === 'fulfilled')) {
                let start = 0, result = null;
                results.forEach(res => {
                    if (!result) {
                        result = res.value;
                        start = start + 5;
                    } else {
                        result.geocoded_waypoints = [...result.geocoded_waypoints.slice(0, start + 1), ...res.value.geocoded_waypoints.slice(1)];
                        result.routes[0].legs = [...result.routes[0].legs.slice(0, start), ...res.value.routes[0].legs.slice(0)];
                        start = start + 5;
                    }
                });
                result.routes[0].waypoint_order = [];
                result.routes[0].legs.forEach((item, i) => result.routes[0].waypoint_order.push(i));

                result.routes[0].legs.forEach((leg, i) => {
                    leg.start_address = getAddressLabel(activeStoppages[i].address);
                    leg.end_address = getAddressLabel(activeStoppages[i + 1].address);
                });
                mapState.directionsRenderer.setDirections(result);
                typeof onChange === 'function' && onChange('success', result.routes[0], route, initialLoad);
            } else {
                const error = results.find(res => res.status === 'rejected');
                notifications.showNotification({title: "Error", color: 'red', message: error.reason.message});
                typeof onChange === 'function' && onChange('fail', [], route, initialLoad);
            }
        });
    };

    return <Paper withBorder radius="md" style={{height: '100%'}} id={id}/>
};

export default RouteMap;