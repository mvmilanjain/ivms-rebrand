import {Box} from '@mantine/core';

import AppBar from './AppBar';
import Sidebar from './Sidebar';

export const Main = (props) => (
    <Box component="div" sx={() => ({display: 'flex'})}>
        <Sidebar/>
        <Box component="div" sx={() => ({flexGrow: 1, display: 'flex', flexDirection: "column"})}>
            <AppBar/>
            <Box component="div" m="md" sx={() => ({flexGrow: 1})}>{props.children}</Box>
        </Box>
    </Box>
);