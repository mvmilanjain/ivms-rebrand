import {applyMiddleware, combineReducers, createStore} from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import authReducer from './reducers/auth.reducer';

const rootReducer = combineReducers({auth: authReducer});

let store = process.env.NODE_ENV === 'development' ?
    createStore(rootReducer, applyMiddleware(thunk, logger)) :
    createStore(rootReducer, applyMiddleware(thunk));

export default store;