import React from 'react';
import {
    Box,
    Button,
    Center,
    Col,
    Container,
    Grid,
    Paper,
    PasswordInput,
    Space,
    TextInput,
    ThemeIcon,
    Title
} from '@mantine/core'
import {LockClosedIcon, LockOpen1Icon, PersonIcon} from "@modulz/radix-icons";

export const SignIn = (props) => {
    return (
        <Container fluid padding={"md"} style={{height: 'inherit'}}>
            <Grid justify={"center"} align={"center"} style={{height: 'inherit'}}>
                <Col span={12} md={6} lg={4}>
                    <Paper padding={"md"} shadow={"sm"}>
                        <Center>
                            <ThemeIcon radius="xl" size="xl"><LockOpen1Icon/></ThemeIcon>
                        </Center>
                        <Space h={"lg"}/>

                        <Title align={"center"} order={2}>
                            <Box component="span" sx={(theme) => ({
                                color: theme.colors.blue[6]
                            })}>Sign in </Box>
                            your account
                        </Title>
                        <Space h={"xl"}/>

                        <TextInput label="Username" placeholder="Username" required icon={<PersonIcon/>}/>
                        <Space h={"md"}/>

                        <PasswordInput label="Password" placeholder="Password" required icon={<LockClosedIcon/>}/>
                        <Space h={"lg"}/>

                        <Button fullWidth>Sign In</Button>
                    </Paper>
                </Col>
            </Grid>
        </Container>
    );
};
