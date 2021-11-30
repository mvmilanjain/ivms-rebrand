import {useState} from 'react';
import {NavLink as Link, useHistory} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {Scrollbars} from 'react-custom-scrollbars';
import {Box, UnstyledButton, Collapse, createStyles, Group, Navbar, Text, ThemeIcon, useMantineTheme} from '@mantine/core';
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
    {id: 'dashboard', path: '/Dashboard', label: 'Dashboard', icon: <DashboardIcon/>, color: 'blue'},
    {id: 'route', path: '/Route', label: 'Route', icon: <RouteIcon/>, color: 'teal'},
    {
        id: 'routeOrder', label: 'Route Order', icon: <RouteOrderIcon/>, color: 'lime', subNav: [
            {id: 'planning', path: '/RouteOrder/Planning', label: 'Planning'},
            {id: 'operation', path: '/RouteOrder/Operation', label: 'Operation'},
            {id: 'finance', path: '/RouteOrder/Finance', label: 'Finance'},
            {id: 'reports', path: '/RouteOrder/Reports', label: 'Reports'}
        ]
    },
    {
        id: 'maintenance', label: 'Maintenance', icon: <MaintenanceIcon/>, color: 'yellow', subNav: [
            {id: 'workorder', path: '/Maintenance/Workorder', label: 'Work Order'},
            {id: 'request', path: '/Maintenance/Request', label: 'Request'},
            {id: 'scheduler', path: '/Maintenance/Scheduler', label: 'Scheduler'},
            {id: 'laborcode', path: '/Maintenance/Laborcode', label: 'Labor Code'}
        ]
    },
    {
        id: 'inspection', label: 'Inspection', icon: <InspectionIcon/>, color: 'orange', subNav: [
            {id: 'inspectionForm', path: '/Inspection/InspectionForm', label: 'Form'},
            {id: 'inspectionReport', path: '/Inspection/InspectionReport', label: 'Report'},
        ]
    },
    {id: 'fault', path: '/Fault', label: 'Fault', icon: <FaultIcon/>, color: 'red'},
    {id: 'product', path: '/Product', label: 'Product', icon: <ProductIcon/>, color: 'grape'},
    {id: 'address', path: '/Address', label: 'Address', icon: <AddressIcon/>, color: 'violet'},
    {
        id: 'vehicle', label: 'Vehicle', icon: <VehicleIcon/>, color: 'green', subNav: [
            {id: 'truck', path: '/Vehicle/Truck', label: 'Truck'},
            {id: 'trailer', path: '/Vehicle/Trailer', label: 'Trailer'}
        ]
    }
];

const useStyles = createStyles(t => ({
    root: {backgroundColor: t.colors.dark[7]},
    link: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: t.spacing.xs,
        borderLeft: `1px solid transparent`,
        borderTopRightRadius: t.radius.sm,
        borderBottomRightRadius: t.radius.sm,
        color: t.colors.dark[0],
        '&:hover': {
            backgroundColor: t.colors.dark[9],
            color: 'white'
        }
    },
    logout: {
        marginTop: t.spacing.xs,
        marginBottom: t.spacing.xs
    },
    chevron: {
        color: 'currentcolor',
        transition: 'transform 200ms ease',
    }
}));

const MainLink = ({path, icon, color, label}) => {
    const {classes} = useStyles();
    const theme = useMantineTheme();

    return (
        <Link
            to={path} exact className={classes.link}
            activeStyle={{
                fontWeight: 500,
                borderLeftColor: theme.colors[color][7],
                color: theme.colors.gray[2],
                backgroundColor: theme.fn.rgba(theme.colors[color][9], .45)
            }}
        >
            <Group>
                <ThemeIcon color={color} variant="filled">{icon}</ThemeIcon>
                <Text size="md" sx={() => ({color: 'currentcolor', fontWeight: 'inherit'})}>{label}</Text>
            </Group>
        </Link>
    );
};

const NavWithSubLink = ({icon, color, label, subNav}) => {
    const {classes, theme} = useStyles();
    const [opened, setOpen] = useState(false);

    return (
        <>
            <Box className={classes.link} onClick={() => setOpen((o) => !o)}>
                <Group>
                    <ThemeIcon color={color}>{icon || getInitials(label)}</ThemeIcon>
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
                            fontWeight: 500,
                            borderLeftColor: theme.colors[color][7],
                            color: theme.colors.gray[2],
                            backgroundColor: theme.fn.rgba(theme.colors[color][9], .45)
                        }}
                    >
                        <Group>
                            <ThemeIcon ml="md" variant="light">{getInitials(label)}</ThemeIcon>
                            <Text size="md" style={{color: 'currentcolor', fontWeight: 'inherit',}}>
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
    const {classes, cx} = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const logout = () => dispatch(authLogout());

    const handleSignOut = () => {
        logout();
        history.push("/SignIn");
    };

    const getNavList = () => {
        return navList.map((link) => {
            if (!link.subNav) {
                return <MainLink key={link.id} {...link}/>;
            } else {
                return <NavWithSubLink key={link.id} {...link}/>;
            }
        });
    };

    return (
        <Navbar padding="sm" width={{base: 240, breakpoints: {sm: '100%', lg: 400}}} className={classes.root}>
            <Navbar.Section sx={t => ({borderBottom: `1px solid ${t.colors.dark[4]}`})}>
                <Group sx={t => ({paddingTop: 4, paddingBottom: t.spacing.md})}>
                    <ThemeIcon variant="gradient" radius="xl" size="lg" gradient={{from: 'indigo', to: 'cyan'}}>
                        <BrandIcon size={16}/>
                    </ThemeIcon>
                    <Text size="xl" weight="bold" sx={t => ({color: t.colors.gray[2]})}>IVMS</Text>
                </Group>
            </Navbar.Section>

            <Navbar.Section grow mt="xs">
                <Scrollbars>{getNavList()}</Scrollbars>
            </Navbar.Section>

            <Navbar.Section
                mt="xs"
                sx={t => ({
                    borderTop: `1px solid ${t.colors.dark[4]}`,
                    paddingTop: t.spacing.xs,
                    paddingBottom: t.spacing.xs
                })}
            >
                <MainLink key="setting" path="/Setting" color="indigo" icon={<SettingIcon/>} label="Setting"/>
                <UnstyledButton onClick={handleSignOut} className={cx(classes.link)}>
                    <Group>
                        <ThemeIcon color={"red"} variant="filled"><LogoutIcon/></ThemeIcon>
                        <Text size="md" sx={() => ({color: 'currentcolor', fontWeight: 'inherit'})}>Logout</Text>
                    </Group>
                </UnstyledButton>
            </Navbar.Section>
        </Navbar>
    );
};

export default Sidebar;