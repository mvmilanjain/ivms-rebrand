import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {Button, Center, Col, Grid, Paper, PasswordInput, Text, TextInput, ThemeIcon, Title} from '@mantine/core'
import {useNotifications} from '@mantine/notifications';
import {LockClosedIcon, LockOpen1Icon, PersonIcon} from '@modulz/radix-icons';

import {useHttp} from 'Hooks';
import {signIn} from 'Shared/Services';
import {SIGN_IN} from 'Shared/Utilities/validationSchema.util';
import {authFailure, authSuccess, checkAuthTimeout} from 'Store/actions/auth.actions';

const SignIn = ({history}) => {
    const [loading, toggleLoading] = useState(false);
    const dispatch = useDispatch();
    const notifications = useNotifications();
    const {requestHandler} = useHttp();

    const onSubmit = async (values) => {
        toggleLoading(true);
        const {username, password} = values;
        try {
            const res = await requestHandler(signIn(username, password));
            const {expires_in, access_token: token, refresh_token: refreshToken} = res;
            const expirationTime = new Date(new Date().getTime() + (expires_in - 60) * 1000);
            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('expirationTime', expirationTime);
            dispatch(authSuccess({data: {token, refreshToken}}));
            dispatch(checkAuthTimeout((expires_in - 60) * 1000));
            history.push('/');
        } catch (e) {
            dispatch(authFailure());
            notifications.showNotification({
                title: 'Error', color: 'red',
                message: 'Username or Password is incorrect.'
            });
        } finally {
            toggleLoading(false);
        }
    };

    const {formState, register, handleSubmit} = useForm({
        defaultValues: {username: 'saurabh', password: '12345678'},
        resolver: yupResolver(SIGN_IN)
    });

    return (
        <Grid justify={"center"} align={"center"} style={{height: 'inherit'}}>
            <Col span={12} md={6} lg={4}>
                <Paper padding={"md"} shadow={"sm"}>
                    <form onSubmit={handleSubmit(onSubmit)}>
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
                            error={formState.errors.username?.message}
                        />
                        <PasswordInput
                            mb="lg" {...register("password")}
                            label="Password" placeholder="Password"
                            required icon={<LockClosedIcon/>}
                            error={formState.errors.password?.message}
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