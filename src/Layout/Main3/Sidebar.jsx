import {useState} from 'react';
import {NavLink as Link, useHistory} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {Scrollbars} from 'react-custom-scrollbars';
import {ActionIcon, Box, Collapse, createStyles, Group, Navbar, Text, ThemeIcon, UnstyledButton} from '@mantine/core';
import {
    ChevronRightIcon,
    ExclamationTriangleIcon as FaultIcon,
    ExitIcon as LogoutIcon,
    GearIcon as SettingIcon,
    IdCardIcon as AddressIcon,
} from '@modulz/radix-icons';
import {FiTruck as BrandIcon} from 'react-icons/fi';
import {MdChecklist as RouteOrderIcon, MdOutlineDashboard as DashboardIcon} from 'react-icons/md';
import {FaRoute as RouteIcon, FaTruck as VehicleIcon} from 'react-icons/fa';
import {FcInspection as InspectionIcon} from 'react-icons/fc';
import {AiOutlineInbox as ProductIcon} from 'react-icons/ai';
import {GiAutoRepair as MaintenanceIcon} from 'react-icons/gi';

import {getInitials} from 'Shared/Utilities/common.util';
import {authLogout} from 'Store/actions/auth.actions';

const navList = [
    {id: 'dashboard', path: '/dashboard', label: 'Dashboard', icon: DashboardIcon, color: 'blue'},
    {id: 'route', path: '/routes', label: 'Route', icon: RouteIcon, color: 'teal'},
    {
        id: 'routeOrder', label: 'TripRoutes Order', icon: RouteOrderIcon, color: 'lime', subNav: [
            {id: 'planning', path: '/RoutePlanner/Planning', label: 'Planning'},
            {id: 'operation', path: '/RoutePlanner/Operation', label: 'Operation'},
            {id: 'finance', path: '/RoutePlanner/Finance', label: 'Finance'},
            {id: 'reports', path: '/RoutePlanner/Reports', label: 'Reports'}
        ]
    },
    {
        id: 'inspection', label: 'Inspection', icon: InspectionIcon, color: 'green', subNav: [
            {id: 'inspectionForm', path: '/Inspection/InspectionForms', label: 'Form'},
            {id: 'inspectionReport', path: '/Inspection/InspectionReport', label: 'Report'},
        ]
    },
    {
        id: 'maintenance', label: 'Maintenance', icon: MaintenanceIcon, color: 'orange', subNav: [
            {id: 'workorder', path: '/Maintenance/Workorder', label: 'Work Order'},
            {id: 'request', path: '/Maintenance/Request', label: 'Request'},
            {id: 'scheduler', path: '/Maintenance/Scheduler', label: 'Scheduler'},
            {id: 'laborcode', path: '/Maintenance/Laborcode', label: 'Labor Code'}
        ]
    },
    {id: 'fault', path: '/faults', label: 'Fault', icon: FaultIcon, color: 'red'},
    {id: 'product', path: '/products', label: 'Product', icon: ProductIcon, color: 'yellow'},
    {id: 'address', path: '/addresses', label: 'Address', icon: AddressIcon, color: 'grape'},
    {
        id: 'vehicle', label: 'Vehicle', icon: VehicleIcon, color: 'violet', subNav: [
            {id: 'truck', path: '/vehicle/truck', label: 'Truck'},
            {id: 'trailer', path: '/vehicle/trailer', label: 'Trailer'}
        ]
    },
    {id: 'setting', path: '/setting', label: 'Setting', icon: SettingIcon, color: 'indigo'}
];

const useStyles = createStyles(t => ({
    root: {
        backgroundColor: t.colors.dark[7],
        padding: 0,
        zIndex: 1
    },
    link: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: t.spacing.xs,
        borderLeft: `1px solid transparent`,
        borderTopRightRadius: t.radius.md,
        borderBottomRightRadius: t.radius.md,
        color: t.colors.dark[0],
        '&:hover': {
            backgroundColor: t.colors.dark[5],
            color: 'white'
        }
    },
    expandBtn: {
        width: '100%',
        color: t.colors.dark[0],
        '&:hover': {
            color: 'white',
            backgroundColor: t.colors.dark[5]
        }
    },
    expandBtnIcon: {
        color: 'currentcolor',
        transition: 'transform 200ms ease'
    },
    chevron: {
        color: 'currentcolor',
        transition: 'transform 200ms ease',
    }
}));

const MainLink = ({path, icon: Icon, color, label}) => {
    const {classes, theme} = useStyles();

    return (
        <Link to={path} exact className={classes.link} activeStyle={{
            borderLeftColor: theme.colors[color][9],
            color: theme.colors.gray[0],
            backgroundColor: theme.fn.rgba(theme.colors[color][9], .45)
        }}>
            <Group>
                <ThemeIcon color={color} variant="filled"><Icon/></ThemeIcon>
                <Text size="md" sx={() => ({color: 'currentcolor', fontWeight: 500})}>{label}</Text>
            </Group>
        </Link>
    );
};

const NavWithSubLink = ({icon: Icon, color, label, subNav}) => {
    const {classes, theme} = useStyles();
    const [opened, setOpen] = useState(false);

    return (
        <>
            <Box className={classes.link} onClick={() => setOpen(o => !o)}>
                <Group>
                    <ThemeIcon color={color}><Icon/></ThemeIcon>
                    <Box>{label}</Box>
                </Group>
                <ChevronRightIcon
                    className={classes.chevron}
                    style={{transform: opened ? 'rotate(90deg)' : 'none'}}
                />
            </Box>
            <Collapse in={opened} ml="xl">
                {subNav.map(({id, path, label}) => (
                    <Link
                        key={id} to={path} exact className={classes.link}
                        style={{borderLeftColor: theme.colors.dark[4]}}
                        activeStyle={{
                            borderLeftColor: theme.colors[color][9],
                            color: theme.colors.gray[0],
                            backgroundColor: theme.fn.rgba(theme.colors[color][9], .45)
                        }}
                    >
                        <Group>
                            <ThemeIcon ml="md" color={color}>{getInitials(label)}</ThemeIcon>
                            <Text size="md" style={{color: 'currentcolor', fontWeight: 500}}>
                                {label}
                            </Text>
                        </Group>
                    </Link>
                ))}
            </Collapse>
        </>
    );
};

const Sidebar = () => {
    const {classes, cx, theme} = useStyles();
    const [openNavbar, toggleNavbar] = useState(true);
    const history = useHistory();
    const dispatch = useDispatch();
    const logout = () => dispatch(authLogout());

    const handleSignOut = () => {
        logout();
        history.push("/SignIn");
    };

    const links = navList.map(l => (l.subNav) ? <NavWithSubLink key={l.id} {...l} /> : <MainLink key={l.id} {...l}/>);

    return (
        <Navbar width={{base: 260, breakpoints: {sm: '100%', lg: 400}}} className={classes.root}>
            <Navbar.Section my="xs" mx="sm" sx={t => ({
                borderBottom: `1px solid ${t.colors.dark[4]}`,
                padding: `4px ${t.spacing.xs}px ${t.spacing.md}px`
            })}>
                <Group>
                    <ThemeIcon variant="gradient" radius="xl" size="lg" gradient={{from: 'indigo', to: 'cyan'}}>
                        <BrandIcon size={16}/>
                    </ThemeIcon>
                    <Text size="xl" weight="bold" sx={t => ({color: t.colors.gray[2]})}>IVMS</Text>
                </Group>
            </Navbar.Section>

            <Navbar.Section grow mx="sm" mb="sm">
                <Scrollbars>{links}</Scrollbars>
            </Navbar.Section>

            <Navbar.Section mx="sm">
                <UnstyledButton onClick={handleSignOut} className={cx(classes.link)}>
                    <Group>
                        <ThemeIcon color={"red"} variant="filled"><LogoutIcon/></ThemeIcon>
                        <Text size="md" sx={() => ({color: 'currentcolor', fontWeight: 'inherit'})}>Logout</Text>
                    </Group>
                </UnstyledButton>
            </Navbar.Section>

            <Navbar.Section>
                <ActionIcon
                    radius={0} variant="transparent"
                    className={classes.expandBtn}
                    onClick={() => toggleNavbar(o => !o)}
                >
                    <ChevronRightIcon
                        className={classes.expandBtnIcon}
                        style={{transform: !openNavbar ? 'rotate(180deg)' : 'none'}}
                    />
                </ActionIcon>
            </Navbar.Section>
        </Navbar>
    );
};

export default Sidebar;