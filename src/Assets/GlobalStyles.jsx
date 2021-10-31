import {Global} from '@mantine/core';

export const GlobalStyles = () => <Global
    styles={theme => ({
        '*, *::before, *::after': {
            boxSizing: 'border-box',
        },
        html: {
            '-webkit-font-smoothing': 'antialiased',
            '-moz-osx-font-smoothing': 'grayscale',
            height: '100%',
            width: '100%'
        },
        body: {
            backgroundColor: theme.colors.gray[0],
            height: '100%',
            width: '100%'
        },
        a: {
            textDecoration: 'none'
        },
        '#root': {
            height: '100%',
            width: '100%'
        }
    })}
/>;