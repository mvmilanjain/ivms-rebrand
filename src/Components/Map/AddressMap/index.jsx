import {forwardRef, useCallback, useEffect} from 'react';
import {Box} from '@mantine/core';

let map = null;
let marker = null;
let polygon = null;
let circle = null;

const AddressMap = forwardRef(({address, isClosing, onClose, onMarkerChange}, ref) => {

    useEffect(() => {
        const {lat, lng, geofence, radius} = address
        const center = {lat, lng};
        const mapOptions = {center, zoom: 18};
        map = new window.google.maps.Map(document.getElementById("address-map"), mapOptions);
        marker = new window.google.maps.Marker({map, position: center, draggable: true});
        const shapesOption = {
            map,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35
        };
        polygon = new window.google.maps.Polygon({...shapesOption, paths: geofence, editable: true});
        circle = new window.google.maps.Circle({...shapesOption, center, radius});

        marker.addListener('dragend', onMarkerDragEnd);
    }, []);

    useEffect(() => {
        const newCenter = new window.google.maps.LatLng(address.latitude, address.longitude);
        map.setCenter(newCenter);
        circle.setCenter(newCenter);
        marker.setPosition(newCenter);
        polygon.setPath(address.geofence);
        circle.setRadius(address.radius);
    }, [address]);

    useEffect(() => {
        if (isClosing && onClose) {
            const geofence = [];
            const vertices = polygon.getPath();
            for (let i = 0; i < vertices.getLength(); i++) {
                const coord = vertices.getAt(i);
                geofence.push({lat: coord.lat(), lng: coord.lng()});
            }
            onClose(geofence);
        }
    }, [isClosing])

    const onMarkerDragEnd = useCallback(() => {
        const latitude = marker.getPosition().lat();
        const longitude = marker.getPosition().lng();
        onMarkerChange && onMarkerChange({latitude, longitude});
    }, []);

    return <Box id="address-map" ref={ref} sx={t => ({boxShadow: t.shadows.md, height: '100%'})}/>
});

export default AddressMap;