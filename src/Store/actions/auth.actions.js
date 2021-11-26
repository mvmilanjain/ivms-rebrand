import {refreshAuthorization} from "Shared/Services";
import {instance as axios} from "Shared/Services/config.service";

import {AUTH_FAILURE, AUTH_LOGOUT, AUTH_SUCCESS, START_SPINNER, STOP_SPINNER} from "./actionTypes";

export const startSpinner = () => ({type: START_SPINNER});

export const stopSpinner = () => ({type: STOP_SPINNER});

export const authSuccess = (data) => ({type: AUTH_SUCCESS, ...data});

export const authFailure = () => ({type: AUTH_FAILURE});

export const authLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('expirationTime');
    return {type: AUTH_LOGOUT};
};

export const authCheckState = (history) => (dispatch => {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    if (!token) {
        dispatch(authLogout());
        history.push('/signin');
    } else {
        const expirationTime = new Date(localStorage.getItem('expirationTime'));
        if (expirationTime <= new Date()) {
            dispatch(authLogout());
            history.push('/signIn');
        } else {
            dispatch(authSuccess({data: {token, refreshToken}}));
            dispatch(checkAuthTimeout((expirationTime.getTime() - new Date().getTime()) / 1000));
        }
    }
});

export const checkAuthTimeout = (expirationTime) => (dispatch => {
    setTimeout(() => {
        const refreshToken = localStorage.getItem('refreshToken');
        if(refreshToken) {
            axios(refreshAuthorization(refreshToken)).then(res => {
                const {expires_in, access_token: token, refresh_token: refreshToken} = res;
                const expirationTime = new Date(new Date().getTime() + (expires_in - 60) * 1000);
                localStorage.setItem('token', token);
                localStorage.setItem('refreshToken', refreshToken);
                localStorage.setItem('expirationTime', expirationTime);
                dispatch(authSuccess({data: {token, refreshToken}}));
                dispatch(checkAuthTimeout((expires_in - 60) * 1000));
            }).catch(error => {
                console.error(error);
                dispatch(authLogout());
            });
        }
    }, expirationTime);
});
