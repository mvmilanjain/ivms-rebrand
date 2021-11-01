import {AUTH_FAILURE, AUTH_LOGOUT, AUTH_SUCCESS, START_SPINNER, STOP_SPINNER} from "../actions/actionTypes";

const initialState = {
    isAuthenticated: null,
    token: null,
    refreshToken: null,
    loading: false,
    current_user: null,
    current_company: null,
    user_type: ''
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case START_SPINNER:
            return {...state, loading: true};
        case STOP_SPINNER:
            return {...state, loading: false};
        case AUTH_SUCCESS:
            return {...state, isAuthenticated: true, ...action.data};
        case AUTH_FAILURE:
        case AUTH_LOGOUT:
            return {...state, token: null, refreshToken: null, isAuthenticated: false};
        default:
            return state;
    }
};

export default authReducer;
