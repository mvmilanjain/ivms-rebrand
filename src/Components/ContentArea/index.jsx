import {Box, Paper, useCss} from '@mantine/core';
import {useViewportSize} from '@mantine/hooks';

const ContentArea = ({withPaper, limitToViewPort, heightToReduce = 128, ...rest}) => {
    const {cx, css} = useCss();
    const {height} = useViewportSize();

    return (
        <Box sx={t => ({padding: t.spacing.md})}>
            {withPaper && <Paper padding="md" withBorder>
                <Box className={cx({[css({height: `${height - heightToReduce}px`})]: limitToViewPort})}>
                    {rest.children}
                </Box>
            </Paper>}

            {!withPaper && <Box className={cx({[css({height: `${height - heightToReduce}px`})]: limitToViewPort})}>
                {rest.children}
            </Box>}
        </Box>
    );

};

export default ContentArea;