import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {LoadingOverlay, MantineProvider, NormalizeCSS} from '@mantine/core';
import {NotificationsProvider} from '@mantine/notifications';

import {GlobalStyles} from "Assets/GlobalStyles";
import Routes from 'Routes';
import {MainLayout, MinimalLayout} from 'Layout';
import {authCheckState} from 'Store/actions/auth.actions';


const App = () => {
    const history = useHistory();
    const isAuthenticated = useSelector(store => store.auth.isAuthenticated);
    const isLoading = useSelector(store => store.auth.loading);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(authCheckState(history));
    }, [dispatch]);

    return (
        <MantineProvider>
            <GlobalStyles/>
            <NormalizeCSS/>
            <LoadingOverlay visible={isLoading}/>
            <NotificationsProvider position={"top-right"}>
                {isAuthenticated !== null && (
                    isAuthenticated ?
                        <MainLayout><Routes isAuthenticated={isAuthenticated}/></MainLayout> :
                        <MinimalLayout><Routes isAuthenticated={isAuthenticated}/></MinimalLayout>
                )}
            </NotificationsProvider>
        </MantineProvider>
    );
};

export default App;