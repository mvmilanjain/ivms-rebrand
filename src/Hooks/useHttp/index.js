import {useCallback} from "react";
import {useDispatch} from "react-redux";

import {instance as axios} from "Shared/Services/config.service";
import {startSpinner, stopSpinner} from "Store/actions/auth.actions";

const useHttp = () => {
    const dispatch = useDispatch();

    const requestHandler = useCallback((config, options = {}) => new Promise((resolve, reject) => {
        const {loader} = options;
        loader && dispatch(startSpinner());
        axios(config).then(res => {
            loader && dispatch(stopSpinner());
            resolve(res);
        }).catch(error => {
            loader && dispatch(stopSpinner());
            console.error(error);
            reject(error);
        });
    }), []);

    return {requestHandler};
};

export default useHttp;