import {useState} from 'react';
import {Scrollbars} from 'react-custom-scrollbars';
import {Box, Paper} from '@mantine/core';

import AppBar from './AppBar';
import Sidebar from './Sidebar';

const Main1 = (props) => {
    const [openNavbar, toggleNavbar] = useState(true);

    return (
        <Box component="div" sx={() => ({display: 'flex'})}>
            <Sidebar expand={openNavbar}/>
            <Box sx={t => ({
                flexGrow: 1, display: 'flex', flexDirection: "column",
                backgroundColor: t.colors.gray[0]
            })}>
                <AppBar expand={openNavbar} toggleNavbar={() => toggleNavbar(o => !o)}/>
                <Scrollbars>
                    <Paper m="md" padding="md" withBorder>
                        {props.children}
                    </Paper>
                </Scrollbars>
            </Box>
        </Box>
    );
};

export default Main1;