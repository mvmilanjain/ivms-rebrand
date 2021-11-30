import {Scrollbars} from 'react-custom-scrollbars';
import {Box} from '@mantine/core';
import Sidebar from './Sidebar';

const Main2 = (props) => (
    <div style={{display: 'flex'}}>
        <Sidebar/>

        <div style={{flexGrow: 1, display: 'flex', flexDirection: "column"}}>
            <Scrollbars>
                <Box component="div" sx={t => ({height: '100%', padding: t.spacing.md})}>
                    {props.children}
                </Box>
            </Scrollbars>
        </div>
    </div>
);

export default Main2;