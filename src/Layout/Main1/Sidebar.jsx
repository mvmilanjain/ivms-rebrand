import {useState} from 'react';
import {NavLink as Link} from 'react-router-dom';
import {Box, Collapse, createStyles, Group, Navbar, ScrollArea, Text, ThemeIcon} from '@mantine/core';
import {
    ChevronRightIcon,
    ExclamationTriangleIcon as FaultIcon,
    GearIcon as SettingIcon,
    IdCardIcon as AddressIcon
} from '@modulz/radix-icons';
import {FiTruck as BrandIcon} from 'react-icons/fi';
import {MdChecklist as RouteOrderIcon, MdOutlineDashboard as DashboardIcon} from 'react-icons/md';
import {FaRoute as RouteIcon, FaTruck as VehicleIcon} from 'react-icons/fa';
import {FcInspection as InspectionIcon} from 'react-icons/fc';
import {AiOutlineInbox as ProductIcon} from 'react-icons/ai';
import {GiAutoRepair as MaintenanceIcon} from 'react-icons/gi';

import {getInitials} from 'Shared/Utilities/common.util';

const navList = [
    {id: 'dashboard', path: '/dashboard', label: 'Dashboard', icon: DashboardIcon, color: 'blue'},
    {id: 'tripRoutes', path: '/routes', label: 'Route', icon: RouteIcon, color: 'teal'},
    {id: 'routePlanner', path: '/route_planner/0', label: 'Route Planner', icon: RouteOrderIcon, color: 'lime'},
    {id: 'inspection', path: '/inspection/0', label: 'Inspection', icon: InspectionIcon, color: 'green'},
    {
        id: 'maintenance', label: 'Maintenance', icon: MaintenanceIcon, color: 'orange', subNav: [
            {id: 'workorder', path: '/Maintenance/Workorder', label: 'Work Order'},
            {id: 'request', path: '/Maintenance/Request', label: 'Request'},
            {id: 'scheduler', path: '/Maintenance/Scheduler', label: 'Scheduler'},
            {id: 'laborcode', path: '/Maintenance/Laborcode', label: 'Labor Code'}
        ]
    },
    {id: 'faults', path: '/faults', label: 'Fault', icon: FaultIcon, color: 'red'},
    {id: 'products', path: '/products', label: 'Product', icon: ProductIcon, color: 'yellow'},
    {id: 'addresses', path: '/addresses', label: 'Address', icon: AddressIcon, color: 'grape'},
    {id: 'vehicle', path: '/vehicle/0', label: 'Vehicle', icon: VehicleIcon, color: 'violet'},
    {id: 'setting', path: '/setting', label: 'Setting', icon: SettingIcon, color: 'indigo'}
];

const useStyles = createStyles(t => ({
    root: {
        backgroundColor: t.colors.dark[7],
        padding: t.spacing.md
    },
    navbarOpen: {width: 240},
    navbarClose: {width: 80},
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
    chevron: {
        color: 'currentcolor',
        transition: 'transform 200ms ease',
    }
}));

const MainLink = ({path, icon: Icon, color, label, showLabel}) => {
    const {classes, theme} = useStyles();

    return (
        <Link to={path} exact className={classes.link} activeStyle={{
            borderLeftColor: theme.colors[color][9],
            color: theme.colors.gray[0],
            backgroundColor: theme.fn.rgba(theme.colors[color][9], .45)
        }}>
            <Group>
                <ThemeIcon color={color} variant="filled"><Icon/></ThemeIcon>
                {showLabel && <Text size="md" sx={() => ({color: 'currentcolor', fontWeight: 500})}>{label}</Text>}
            </Group>
        </Link>
    );
};

const NavWithSubLink = ({icon: Icon, color, label, subNav, showLabel}) => {
    const {classes, theme} = useStyles();
    const [opened, setOpen] = useState(false);

    return (
        <>
            <Box className={classes.link} onClick={() => setOpen(o => !o)}>
                <Group>
                    <ThemeIcon color={color}><Icon/></ThemeIcon>
                    {showLabel && <Box>{label}</Box>}
                </Group>
                {showLabel && <ChevronRightIcon
                    className={classes.chevron}
                    style={{transform: opened ? 'rotate(90deg)' : 'none'}}
                />}
            </Box>
            <Collapse in={opened} ml={showLabel ? "xl" : 0}>
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
                            <ThemeIcon ml={showLabel ? "md" : 0} color={color}>{getInitials(label)}</ThemeIcon>
                            {showLabel && <Text size="md" style={{color: 'currentcolor', fontWeight: 500}}>
                                {label}
                            </Text>}
                        </Group>
                    </Link>
                ))}
            </Collapse>
        </>
    );
};

const Sidebar = ({expand}) => {
    const {classes, cx} = useStyles();

    const links = navList.map(l => (l.subNav) ?
        <NavWithSubLink key={l.id} {...l} showLabel={expand}/> :
        <MainLink key={l.id} {...l} showLabel={expand}/>);

    return (
        <Navbar className={cx(classes.root, {[classes.navbarOpen]: expand, [classes.navbarClose]: !expand})}>
            <Navbar.Section sx={t => ({
                borderBottom: `1px solid ${t.colors.dark[4]}`,
                padding: `4px ${t.spacing.sm}px ${t.spacing.sm}px`
            })}>
                <Group>
                    <ThemeIcon variant="gradient" gradient={{from: 'indigo', to: 'cyan'}}>
                        <BrandIcon size={16}/>
                    </ThemeIcon>
                    {expand && <Text size="xl" weight="bold" sx={t => ({color: t.colors.gray[2]})}>IVMS</Text>}
                </Group>
            </Navbar.Section>

            <Navbar.Section
                grow my="md" component={ScrollArea} mr={-10}
                styles={{
                    root: {paddingRight: 10},
                    scrollbar: {"&:hover": {backgroundColor: "transparent"}},
                    thumb: {backgroundColor: "rgba(255, 255, 255, .1) !important"}
                }}
            >
                {links}
            </Navbar.Section>
        </Navbar>
    );
};

export default Sidebar;