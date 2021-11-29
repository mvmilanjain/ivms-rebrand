import {Container} from '@mantine/core';

const Minimal = (props) => (
    <Container fluid padding={"md"} style={{height: 'inherit'}}>
        {props.children}
    </Container>
);

export default Minimal;