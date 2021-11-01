import {useDispatch} from 'react-redux';
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
import {useNotifications} from '@mantine/notifications';
import {useForm, useBooleanToggle} from '@mantine/hooks';
import {LockClosedIcon, LockOpen1Icon, PersonIcon, InfoCircledIcon} from "@modulz/radix-icons";

import {useHttp} from 'Hooks';
import {signIn} from "Shared/Services";
import {authFailure, authSuccess, checkAuthTimeout} from "Store/actions/auth.actions";

const SignIn = ({history}) => {
    const [loading, toggleLoading] = useBooleanToggle(false);
    const dispatch = useDispatch();
    const notifications = useNotifications();
    const {requestHandler} = useHttp();

    const handleSubmit = async () => {
        toggleLoading(true);
        const {username, password} = form.values;
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
                title: 'Error', message: 'Username or Password is incorrect.',
                color: "red", icon: <InfoCircledIcon/>
            });
        } finally {
            toggleLoading(false);
        }
    };

    const form = useForm({
        initialValues: {username: 'saurabh', password: '12345678'}
    });

    return (
        <Grid justify={"center"} align={"center"} style={{height: 'inherit'}}>
            <Col span={12} md={6} lg={4}>
                <Paper padding={"md"} shadow={"sm"}>
                    <form onSubmit={form.onSubmit(handleSubmit)}>
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

                        <TextInput
                            label="Username" placeholder="Username"
                            required icon={<PersonIcon/>}
                            value={form.values.username}
                            onChange={(e) => form.setFieldValue('username', e.currentTarget.value)}
                            onFocus={() => form.setFieldError('username', false)}
                            error={form.errors.username && 'Username is required'}
                        />
                        <Space h={"md"}/>

                        <PasswordInput
                            label="Password" placeholder="Password"
                            required icon={<LockClosedIcon/>}
                            value={form.values.password}
                            onChange={(e) => form.setFieldValue('password', e.currentTarget.value)}
                            onFocus={() => form.setFieldError('password', false)}
                            error={form.errors.password && 'Password is required'}
                        />
                        <Space h={"lg"}/>

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