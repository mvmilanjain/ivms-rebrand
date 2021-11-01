import {Container} from '@mantine/core';

export const Minimal = (props) => (
    <Container fluid padding={"md"} style={{height: 'inherit'}}>
        {props.children}
    </Container>
);