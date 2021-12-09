import {Link} from 'react-router-dom';
import {Anchor, Center, Group, Text, ThemeIcon, Title} from '@mantine/core';
import {ArrowRightIcon} from '@modulz/radix-icons';
import {FiTruck as BrandIcon} from 'react-icons/fi';

import {ContentArea} from 'Components';

const PageNotFound = () => (
    <ContentArea>
        <Group position="center" direction="column" m="xl">
            <ThemeIcon variant="gradient" radius="xl" size="xl" gradient={{from: 'indigo', to: 'cyan'}}>
                <BrandIcon size={20}/>
            </ThemeIcon>

            <Text weight="bold" variant="gradient" gradient={{from: 'indigo', to: 'cyan'}}>
                404 ERROR
            </Text>

            <Title order={1} sx={t => ({fontSize: 48})}>Page not found.</Title>

            <Text color="dimmed">Sorry, we couldn't find the page you're looking for.</Text>

            <Anchor component={Link} to="/Dashboard">
                <Center inline>
                    <span>Go to dashboard</span>
                    <ArrowRightIcon style={{marginLeft: 5}}/>
                </Center>
            </Anchor>
        </Group>
    </ContentArea>
);

export default PageNotFound;