import {useState} from "react";
import {NavLink as Link} from "react-router-dom";
import {Scrollbars} from 'react-custom-scrollbars';
import {
    ActionIcon,
    Box,
    Collapse,
    createStyles,
    Group,
    hexToRgba,
    Navbar,
    Text,
    ThemeIcon,
    useMantineTheme
} from "@mantine/core";
import {
    CubeIcon as ProductIcon,
    DashboardIcon,
    DoubleArrowUpIcon as VehicleIcon,
    GearIcon as SettingIcon,
    Pencil2Icon as RouteOrderIcon,
    TriangleDownIcon,
    TriangleUpIcon
} from "@modulz/radix-icons";
import {Truck as BrandIcon, MapPin as AddressIcon, Map as RouteIcon} from "react-feather";

import {getInitials} from "Shared/Utilities/common.util";

const navList = [
    {id: "dashboard", path: "/dashboard", label: 'Dashboard', icon: <DashboardIcon/>, color: 'blue'},
    {id: "route", path: "/route", label: 'Route', icon: <RouteIcon size={16}/>, color: 'teal'},
    {
        id: "routeOrder", label: 'Route Order', icon: <RouteOrderIcon/>, color: 'lime', subNav: [
            {id: "plan", path: "/plan", label: 'Planning'},
            {id: "operation", path: "/operation", label: 'Operation'},
            {id: "finance", path: "/finance", label: 'Finance'},
            {id: "reports", path: "/reports", label: 'Reports'}
        ]
    },
    {id: "product", path: "/product", label: 'Product', icon: <ProductIcon/>, color: 'grape'},
    {id: "address", path: "/address", label: 'Address', icon: <AddressIcon size={16}/>, color: 'violet'},
    {
        id: "vehicle", label: 'Vehicle', icon: <VehicleIcon/>, color: 'green', subNav: [
            {id: "truck", path: "/truck", label: 'Truck'},
            {id: "trailer", path: "/trailer", label: 'Trailer'}
        ]
    },
    {id: "setting", path: "/setting", label: 'Setting', icon: <SettingIcon/>, color: 'indigo'}
];

const useStyles = createStyles(t => ({
    root: {backgroundColor: t.colors.dark[4]},
    link: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        padding: t.spacing.xs,
        borderLeft: `1px solid transparent`,
        borderTopRightRadius: t.radius.sm,
        borderBottomRightRadius: t.radius.sm,
        color: t.colors.dark[0],
        '&:hover': {
            backgroundColor: t.colors.dark[5],
            color: 'white'
        }
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
                backgroundColor: hexToRgba(theme.colors[color][9], .45)
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
    const {classes} = useStyles();
    const theme = useMantineTheme();
    const [opened, setOpen] = useState(false);

    return (
        <>
            <Box component="div" className={classes.link} onClick={() => setOpen((o) => !o)}>
                <Group>
                    <ThemeIcon color={color} variant="filled">{icon || getInitials(label)}</ThemeIcon>
                    <Text size="md" sx={() => ({color: 'currentcolor', fontWeight: 'inherit'})}>{label}</Text>
                </Group>
                <ActionIcon variant="transparent" sx={() => ({color: 'currentcolor'})}>
                    {opened ? <TriangleUpIcon/> : <TriangleDownIcon/>}
                </ActionIcon>
            </Box>
            <Collapse in={opened} ml="xl">
                {subNav.map(({id, path, label}) => (
                    <Link
                        key={id} to={path} exact className={classes.link}
                        style={{borderLeftColor: theme.colors.gray[2]}}
                        activeStyle={{
                            fontWeight: 500,
                            borderLeftColor: theme.colors[color][7],
                            color: theme.colors.gray[2],
                            backgroundColor: hexToRgba(theme.colors[color][9], .45)
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
    const {classes} = useStyles();
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
        <Navbar padding="sm" width={{base: 264, breakpoints: {sm: '100%', lg: 400}}} className={classes.root}>
            <Navbar.Section sx={t => ({borderBottom: `1px solid ${t.colors.gray[2]}`})}>
                <Group withGutter sx={t => ({paddingTop: 4, paddingBottom: t.spacing.md})}>
                    <ThemeIcon variant="gradient" radius="xl" size="lg" gradient={{from: 'indigo', to: 'cyan'}}>
                        <BrandIcon size={16}/>
                    </ThemeIcon>
                    <Text size="xl" weight="bold" sx={t => ({color: t.colors.gray[2]})}>IVMS</Text>
                </Group>
            </Navbar.Section>

            <Navbar.Section grow mt="lg">
                <Scrollbars>{getNavList()}</Scrollbars>
            </Navbar.Section>
        </Navbar>
    );
};

export default Sidebar;