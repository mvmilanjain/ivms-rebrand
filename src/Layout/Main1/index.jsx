import {useState} from 'react';
import {Scrollbars} from 'react-custom-scrollbars';
import {Box, Paper} from '@mantine/core';

import AppBar from './AppBar';
import Sidebar from './Sidebar';

const Main1 = (props) => {
    const [openNavbar, toggleNavbar] = useState(true);

    return (
        <Box component="div" sx={() => ({display: 'flex'})}>
            <Sidebar expand={openNavbar} />
            <Box component="div" sx={() => ({flexGrow: 1, display: 'flex', flexDirection: "column"})}>
                <AppBar expand={openNavbar} toggleNavbar={() => toggleNavbar(o => !o)}/>
                <Scrollbars>
                    <Box component="div" sx={t => ({
                        height: '100%',
                        backgroundColor: t.colors.gray[0],
                        padding: t.spacing.sm
                    })}>
                        <Paper padding="sm" withBorder style={{height: '100%'}}>
                            {props.children}
                        </Paper>
                    </Box>
                </Scrollbars>
            </Box>
        </Box>
    );
};

export default Main1;