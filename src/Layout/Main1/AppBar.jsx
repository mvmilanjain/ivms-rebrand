import {useHistory} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {ActionIcon, Avatar, Box, Center, Divider, Header, Menu} from '@mantine/core';
import {ExitIcon, GearIcon, PersonIcon} from '@modulz/radix-icons';
import {AiOutlineMenuFold as MenuFoldIcon, AiOutlineMenuUnfold as MenuUnfoldIcon} from 'react-icons/ai';

import {authLogout} from 'Store/actions/auth.actions';

const AppBar = ({toggleNavbar, expand}) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const logout = () => dispatch(authLogout());

    const handleSetting = () => history.push("/setting");

    const handleSignOut = () => {
        logout();
        history.push("/SignIn");
    };

    return (
        <Header padding="sm"  sx={t => ({flexGrow: 1})}>
            <Center style={{height: '100%'}}>
                <ActionIcon size="lg" variant="light" onClick={toggleNavbar} color="blue">
                    {expand ? <MenuFoldIcon/> : <MenuUnfoldIcon/>}
                </ActionIcon>
                <Box component="div" sx={() => ({flexGrow: 1})}/>
                <Menu
                    control={<Avatar size="md" radius="xl" color="blue">SG</Avatar>}
                    placement="end" withArrow
                >
                    <Menu.Label>Application</Menu.Label>
                    <Menu.Item icon={<PersonIcon/>}>Saurabh Gulati</Menu.Item>
                    <Menu.Item icon={<GearIcon/>} onClick={handleSetting}>Settings</Menu.Item>
                    <Divider/>
                    <Menu.Label>Danger Zone</Menu.Label>
                    <Menu.Item icon={<ExitIcon/>} onClick={handleSignOut} color="red">Sign Out</Menu.Item>
                </Menu>
            </Center>
        </Header>
    );
};

export default AppBar;