import {Container} from '@mantine/core';

const Minimal = (props) => (
    <Container fluid sx={t => ({height: 'inherit', backgroundColor: t.colors.gray[0]})}>
        {props.children}
    </Container>
);

export default Minimal;