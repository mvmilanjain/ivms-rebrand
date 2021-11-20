import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {LoadingOverlay, MantineProvider} from '@mantine/core';
import {ModalsProvider} from '@mantine/modals';
import {NotificationsProvider} from '@mantine/notifications';

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
        <MantineProvider withNormalizeCSS withGlobalStyles theme={{dateFormat: 'yyyy-MM-dd hh:mm a'}}>
            <LoadingOverlay visible={isLoading} loaderProps={{variant: 'dots'}}/>
            <ModalsProvider modalProps={{styles: {inner: {alignItems: 'center'}}}}>
                <NotificationsProvider position="top-center">
                    {isAuthenticated !== null && (
                        isAuthenticated ?
                            <MainLayout><Routes isAuthenticated={isAuthenticated}/></MainLayout> :
                            <MinimalLayout><Routes isAuthenticated={isAuthenticated}/></MinimalLayout>
                    )}
                </NotificationsProvider>
            </ModalsProvider>
        </MantineProvider>
    );
};

export default App;