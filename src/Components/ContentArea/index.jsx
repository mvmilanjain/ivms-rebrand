import {Box} from '@mantine/core';
import {useViewportSize} from '@mantine/hooks';

const ContentArea = (props) => {
    const {height} = useViewportSize();

    return (
        <Box style={{height: `${height - 128}px`}}>
            {props.children}
        </Box>
    );

};

export default ContentArea;