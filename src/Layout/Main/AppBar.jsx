import {useHistory} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {ActionIcon, Avatar, Box, Center, Divider, Header, Menu} from '@mantine/core';
import {ExitIcon, GearIcon, PersonIcon} from '@modulz/radix-icons';
import {AiOutlineMenuFold as MenuOpenIcon} from 'react-icons/ai';

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
        <Header padding="sm" height={64} sx={t => ({flexGrow: 1})} zIndex={1}>
            <Center style={{height: '100%'}}>
                <ActionIcon size="lg" variant="light"><MenuOpenIcon/></ActionIcon>
                <Box component="div" sx={() => ({flexGrow: 1})}/>
                <Menu
                    control={<Avatar size="md" radius="xl" color="blue">MJ</Avatar>}
                    placement="end" withArrow
                >
                    <Menu.Label>Application</Menu.Label>
                    <Menu.Item icon={<PersonIcon/>}>Milan Jain</Menu.Item>
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