import {useState} from 'react';
import {Scrollbars} from 'react-custom-scrollbars';
import {createStyles, Group, Navbar, Popover, ThemeIcon, UnstyledButton, useCss, useMantineTheme} from '@mantine/core';
import {
    ExclamationTriangleIcon as FaultIcon,
    ExitIcon as LogoutIcon,
    GearIcon as SettingIcon,
    IdCardIcon as AddressIcon
} from '@modulz/radix-icons';
import {FiTruck as BrandIcon} from 'react-icons/fi';
import {MdChecklist as RouteOrderIcon, MdOutlineDashboard as DashboardIcon} from 'react-icons/md';
import {FaRoute as RouteIcon, FaTruck as VehicleIcon} from 'react-icons/fa';
import {FcInspection as InspectionIcon} from 'react-icons/fc';
import {AiOutlineInbox as ProductIcon} from 'react-icons/ai';
import {GiAutoRepair as MaintenanceIcon} from 'react-icons/gi';

const useStyles = createStyles(t => ({
    root: {
        backgroundColor: t.colors.dark[7],
        padding: t.spacing.sm,
    },
    link: {
        width: 50,
        height: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: t.colors.dark[0],
        borderLeft: `1px solid transparent`,
        borderTopRightRadius: t.radius.sm,
        borderBottomRightRadius: t.radius.sm,
        '&:hover': {backgroundColor: t.colors.dark[5]}
    }
}));

const NavbarLink = ({icon: Icon, label, color, active, onClick}) => {
    const {classes} = useStyles();
    const theme = useMantineTheme();
    const {cx, css} = useCss();
    const [opened, setOpened] = useState(false);

    return (
        <Popover
            opened={opened} onClose={() => setOpened(false)}
            position="right" transitionDuration={0}
            withArrow noFocusTrap noEscape
            styles={{
                popover: {backgroundColor: theme.colors.gray[0]},
                body: {color: theme.colors.gray[9]}
            }}
            target={<UnstyledButton
                className={cx(
                    classes.link,
                    {
                        [css({
                            '&, &:hover': {
                                backgroundColor: theme.fn.rgba(theme.colors[color][9], .45)
                            }
                        })]: active
                    }
                )}
                onMouseEnter={() => setOpened(true)}
                onMouseLeave={() => setOpened(false)}
                onClick={onClick}
            >
                <ThemeIcon color={color} variant="filled"><Icon/></ThemeIcon>
            </UnstyledButton>}
        >
            {label}
        </Popover>
    );
};

const mockdata = [
    {id: 'dashboard', label: 'Dashboard', icon: DashboardIcon, color: 'blue'},
    {id: 'route', label: 'Route', icon: RouteIcon, color: 'teal'},
    {id: 'routeOrder', label: 'TripRoutes Order', icon: RouteOrderIcon, color: 'lime'},
    {id: 'maintenance', label: 'Maintenance', icon: MaintenanceIcon, color: 'yellow'},
    {id: 'inspection', label: 'Inspection', icon: InspectionIcon, color: 'orange'},
    {id: 'fault', label: 'Fault', icon: FaultIcon, color: 'red'},
    {id: 'product', label: 'Product', icon: ProductIcon, color: 'grape'},
    {id: 'address', label: 'Address', icon: AddressIcon, color: 'violet'},
    {id: 'vehicle', label: 'Vehicle', icon: VehicleIcon, color: 'green'},
    {id: 'setting', label: 'Setting', icon: SettingIcon, color: 'indigo'}
];

const Sidebar = () => {
    const {classes} = useStyles();
    const [active, setActive] = useState(2);

    const links = mockdata.map((link, index) => (
        <NavbarLink
            {...link}
            key={link.id}
            active={index === active}
            onClick={() => setActive(index)}
        />
    ));

    return (
        <Navbar width={{base: 84}} className={classes.root}>
            <Navbar.Section sx={t => ({borderBottom: `1px solid ${t.colors.gray[2]}`})}>
                <Group sx={t => ({paddingTop: 2, paddingBottom: t.spacing.sm})} position="center">
                    <ThemeIcon variant="gradient" radius="xl" size="lg" gradient={{from: 'indigo', to: 'cyan'}}>
                        <BrandIcon size={16}/>
                    </ThemeIcon>
                </Group>
            </Navbar.Section>

            <Navbar.Section grow mt="sm">
                <Scrollbars>{links}</Scrollbars>
            </Navbar.Section>

            <Navbar.Section sx={t => ({borderTop: `1px solid ${t.colors.gray[2]}`})}>
                <Group my="sm" position="center">
                    <NavbarLink icon={LogoutIcon} label="Logout" color="blue"/>
                </Group>
            </Navbar.Section>
        </Navbar>
    );
};

export default Sidebar;