import qs from "qs";
import {googleInstance as axios} from "./config.service";
import {LATLNG} from "../Utilities/constant";

const getPlaceDetails = address => axios({
    url: 'geocode/json',
    method: 'get',
    params: {address, key: process.env.REACT_APP_GOOGLE_API_KEY},
    paramsSerializer: params => qs.stringify(params)
});

const getStaticMap = (lat, lng) => {
    const url = `${process.env.REACT_APP_GOOGLE_MAP_API_BASE_URL}staticmap?`;
    const position = (lat && lng) ? `${lat},${lng}` : `${LATLNG.lat},${LATLNG.lng}`;
    const center = `center=${position}`;
    const zoom = '&zoom=13';
    const size = '&size=600x300';
    const markers = `&markers=${position}`;
    const key = `&key=${process.env.REACT_APP_GOOGLE_API_KEY}`;
    return `${url}${center}${zoom}${size}${markers}${key}`;
};

export {getPlaceDetails, getStaticMap};
