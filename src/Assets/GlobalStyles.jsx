import {Global} from '@mantine/core';

export const GlobalStyles = () => <Global
    styles={t => ({
        '*, *::before, *::after': {boxSizing: 'border-box'},
        html: {
            height: '100%',
            width: '100%'
        },
        body: {
            height: '100%',
            width: '100%'
        },
        a: {textDecoration: 'none'},
        '#root': {
            height: '100%',
            width: '100%'
        }
    })}
/>;