import {useHistory} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {ActionIcon, Avatar, Box, Center, Divider, Header, Menu} from '@mantine/core';
import {ExitIcon, GearIcon, HamburgerMenuIcon as NavbarIcon, PersonIcon} from '@modulz/radix-icons';

import {authLogout} from 'Store/actions/auth.actions';

const AppBar = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const logout = () => dispatch(authLogout());

    const handleSetting = () => history.push("/setting");

    const handleSignOut = () => {
        logout();
        history.push("/signin");
    };

    return (
        <Header padding="sm" height={64} sx={t => ({flexGrow: 1, boxShadow: t.shadows.xs})} zIndex={1}>
            <Center style={{height: '100%'}}>
                <ActionIcon size="lg" variant="light"><NavbarIcon/></ActionIcon>
                <Box component="div" sx={() => ({flexGrow: 1})}/>
                <Menu
                    control={<Avatar size="md" radius="xl" color="blue">MJ</Avatar>}
                    placement="end" withArrow
                >
                    <Menu.Label>Personal Details</Menu.Label>
                    <Menu.Item icon={<PersonIcon/>}>Milan Jain</Menu.Item>
                    <Divider/>
                    <Menu.Label>Application</Menu.Label>
                    <Menu.Item icon={<GearIcon/>} onClick={handleSetting}>Settings</Menu.Item>
                    <Menu.Item icon={<ExitIcon/>} onClick={handleSignOut}>Sign Out</Menu.Item>
                </Menu>
            </Center>
        </Header>
    );
};

export default AppBar;