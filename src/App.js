import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {LoadingOverlay, MantineProvider} from '@mantine/core';
import {ModalsProvider} from '@mantine/modals';
import {NotificationsProvider} from '@mantine/notifications';

import {GlobalStyles} from 'Assets/GlobalStyles';
import {Main1Layout, Main2Layout, Main3Layout, MinimalLayout} from 'Layout';
import Routes from 'Routes';
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
        <MantineProvider withNormalizeCSS theme={{dateFormat: 'YYYY-MM-DD'}}>
            <GlobalStyles />
            <LoadingOverlay visible={isLoading} loaderProps={{variant: 'dots'}}/>
            <ModalsProvider modalProps={{styles: {inner: {alignItems: 'center'}}}}>
                <NotificationsProvider position="top-center">
                    {isAuthenticated !== null && (
                        isAuthenticated ?
                            <Main1Layout><Routes isAuthenticated={isAuthenticated}/></Main1Layout> :
                            <MinimalLayout><Routes isAuthenticated={isAuthenticated}/></MinimalLayout>
                    )}
                    {/*<Main2Layout><div>Main Content</div></Main2Layout>*/}
                    {/*<Main3Layout><div>Main Content</div></Main3Layout>*/}
                </NotificationsProvider>
            </ModalsProvider>
        </MantineProvider>
    );
};

export default App;