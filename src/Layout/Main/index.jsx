import {Scrollbars} from 'react-custom-scrollbars';
import {Box} from '@mantine/core';

import AppBar from './AppBar';
import Sidebar from './Sidebar';

export const Main = (props) => (
    <Box component="div" sx={() => ({display: 'flex'})}>
        <Sidebar/>
        <Box component="div" sx={() => ({flexGrow: 1, display: 'flex', flexDirection: "column"})}>
            <AppBar/>
            <Scrollbars>
                <Box component="div" sx={t => ({height: '100%', padding: t.spacing.sm})}>{props.children}</Box>
            </Scrollbars>
        </Box>
    </Box>
);