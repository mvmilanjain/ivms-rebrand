import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {LoadingOverlay, MantineProvider} from '@mantine/core';
import {ModalsProvider} from '@mantine/modals';
import {NotificationsProvider} from '@mantine/notifications';
import {Chart} from 'react-chartjs-2';

import {GlobalStyles} from 'Assets/GlobalStyles';
import {Main1Layout, MinimalLayout} from 'Layout';
import Routes from 'Routes';
import {draw} from 'Mixins/chartjs';
import {authCheckState} from 'Store/actions/auth.actions';

Chart.helpers.extend(Chart.elements.Rectangle.prototype, {draw: draw});

const App = () => {
    const history = useHistory();
    const isAuthenticated = useSelector(store => store.auth.isAuthenticated);
    const isLoading = useSelector(store => store.auth.loading);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(authCheckState(history));
    }, [dispatch]);

    return (
        <MantineProvider withNormalizeCSS theme={{dateFormat: 'YYYY-MM-DD'}}>
            <GlobalStyles/>
            <ModalsProvider modalProps={{centered: true}}>
                <NotificationsProvider position="top-center">
                    {isAuthenticated !== null &&
                        (isAuthenticated ? <Main1Layout>
                            <LoadingOverlay visible={isLoading}/>
                            <Routes isAuthenticated={isAuthenticated}/>
                        </Main1Layout> : <MinimalLayout>
                            <LoadingOverlay visible={isLoading}/>
                            <Routes isAuthenticated={isAuthenticated}/>
                        </MinimalLayout>)
                    }
                </NotificationsProvider>
            </ModalsProvider>
        </MantineProvider>
    );
};

export default App;