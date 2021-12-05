import {LATLNG} from "../../../Shared/Utilities/constant";
import {useEffect} from "react";

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

const RouteMap = () => {
    useEffect(() => {
        initMap();
    }, []);

    return <div style={{height: '100%'}} id="route-map"/>
};

export default RouteMap;