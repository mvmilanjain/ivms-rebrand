import {Scrollbars} from 'react-custom-scrollbars';
import {Group, Navbar, Space, Text, ThemeIcon} from "@mantine/core";
import {Component1Icon as BrandIcon} from "@modulz/radix-icons";

const Sidebar = () => {
    return (
        <Navbar
            padding="sm" width={{base: 264, breakpoints: {sm: '100%', lg: 400}}}
            sx={t => ({backgroundColor: t.colors.dark[4]})}
        >
            <Navbar.Section sx={t => ({borderBottom: `1px solid ${t.colors.gray[2]}`})}>
                <Group withGutter>
                    <ThemeIcon variant="gradient" radius="xl" size="lg" gradient={{from: 'indigo', to: 'cyan'}}>
                        <BrandIcon/>
                    </ThemeIcon>
                    <Text size="xl" weight="bold" sx={t => ({color: t.colors.gray[2]})}>IVMS</Text>
                </Group>
                <Space h="xs"/>
            </Navbar.Section>
            <Navbar.Section grow mt="lg">
                <Scrollbars>

                </Scrollbars>
            </Navbar.Section>
        </Navbar>
    );
};

export default Sidebar;