import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {useFormik} from 'formik';
import {Button, Center, Col, Grid, Paper, PasswordInput, Text, TextInput, ThemeIcon, Title} from '@mantine/core'
import {useNotifications} from '@mantine/notifications';
import {LockClosedIcon, LockOpen1Icon, PersonIcon} from '@modulz/radix-icons';

import {authFailure, authSuccess, checkAuthTimeout} from 'Store/actions/auth.actions';
import {useHttp} from 'Hooks';
import {signIn} from 'Shared/Services';
import {SIGN_IN} from 'Shared/Utilities/validationSchema.util';
import {registerField} from 'Shared/Utilities/common.util';

const SignIn = ({history}) => {
    const {requestHandler} = useHttp();
    const dispatch = useDispatch();
    const notifications = useNotifications();
    const [loading, toggleLoading] = useState(false);

    const onSubmit = () => {
        toggleLoading(true);
        const {username, password} = values;
        requestHandler(signIn(username, password)).then(res => {
            const {expires_in, access_token: token, refresh_token: refreshToken} = res;
            const expirationTime = new Date(new Date().getTime() + (expires_in - 60) * 1000);
            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('expirationTime', expirationTime);
            dispatch(authSuccess({data: {token, refreshToken}}));
            dispatch(checkAuthTimeout((expires_in - 60) * 1000));
            history.push('/');
        }).catch(e => {
            dispatch(authFailure());
            notifications.showNotification({
                title: 'Error', color: 'red',
                message: 'Username or Password is incorrect.'
            });
        }).finally(() => toggleLoading(false));
    };

    const register = (fieldName) => registerField(fieldName, {values, handleChange, touched, errors});

    const {values, touched, errors, handleSubmit, handleChange} = useFormik({
        initialValues: {username: 'saurabh', password: '12345678'},
        validationSchema: SIGN_IN,
        onSubmit
    });

    return (
        <Grid justify={"center"} align={"center"} style={{height: 'inherit'}}>
            <Col span={12} md={6} lg={4}>
                <Paper padding={"md"} shadow={"sm"}>
                    <form onSubmit={handleSubmit}>
                        <Center mb="lg">
                            <ThemeIcon radius="xl" size="xl"><LockOpen1Icon/></ThemeIcon>
                        </Center>

                        <Title align={"center"} order={2} mb="xl">
                            <Text color="blue" inherit component="span">Sign in</Text> your account
                        </Title>

                        <TextInput
                            mb="lg" {...register("username")}
                            label="Username" placeholder="Username"
                            required icon={<PersonIcon/>}
                        />
                        <PasswordInput
                            mb="lg" {...register("password")}
                            label="Password" placeholder="Password"
                            required icon={<LockClosedIcon/>}
                        />
                        <Button fullWidth type="submit" loading={loading}>
                            {loading ? 'Signing...' : 'Sign In'}
                        </Button>
                    </form>
                </Paper>
            </Col>
        </Grid>
    );
};

export default SignIn;