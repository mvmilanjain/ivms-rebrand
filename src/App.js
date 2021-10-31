import React from 'react';
import {MantineProvider, NormalizeCSS} from '@mantine/core';

import {SignIn} from 'Pages';
import {GlobalStyles} from "./Assets/GlobalStyles";

const App = () => {
    return (
        <MantineProvider>
            <GlobalStyles />
            <NormalizeCSS />

            <SignIn />
        </MantineProvider>
    );
};

export default App;