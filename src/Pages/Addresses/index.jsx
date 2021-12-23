import {useEffect, useState} from 'react';
import {
    ActionIcon,
    Badge,
    Box,
    Button,
    Center,
    Group,
    Image,
    Pagination,
    Paper,
    Skeleton,
    Text,
    TextInput,
    ThemeIcon,
    Title,
    useMantineTheme
} from '@mantine/core';
import {useDebouncedValue, useSetState} from '@mantine/hooks';
import {useModals} from '@mantine/modals';
import {useNotifications} from '@mantine/notifications';
import {MagnifyingGlassIcon} from '@modulz/radix-icons';
import {
    MdLocationPin as MapPinIcon,
    MdOutlineAddBox as CreateIcon,
    MdOutlineDelete as DeleteIcon,
    MdOutlineEdit as EditIcon,
    MdPhone as PhoneIcon,
} from 'react-icons/md';
import {AiOutlineInbox} from 'react-icons/ai';

import {ContentArea} from 'Components';
import {useHttp} from 'Hooks';
import {deleteAddress, getAddresses, getStaticMap} from 'Shared/Services';
import {getAddressString, getOptionLabel} from 'Shared/Utilities/common.util';
import {ADDRESS_TYPE} from "../../Shared/Utilities/referenceData.util";

const Addresses = ({history}) => {
    const PAGE_SIZE = 10;
    const {requestHandler} = useHttp();
    const theme = useMantineTheme();
    const modals = useModals();
    const notifications = useNotifications();

    const [loading, toggleLoading] = useState(false);
    const [state, setState] = useSetState({data: [], pagination: {count: 0, pageNum: 1, next_page: null}});
    const [searchText, setSearchText] = useState(null);
    const [debouncedSearchText] = useDebouncedValue(searchText, 300);

    useEffect(() => {
        fetchData();
    }, [debouncedSearchText]);

    const fetchData = () => {
        toggleLoading(l => !l);
        const params = {
            per_page: (PAGE_SIZE * 10), page_no: 1, filter: {
                name_cont: searchText, address1_cont: searchText, m: 'or'
            }
        };
        requestHandler(getAddresses(params)).then(res => {
            const {data, meta: {pagination: {count, next_page}}} = res;
            setState({data, pagination: {count, pageNum: 1, next_page}});
        }).catch(e => {
            notifications.showNotification({
                title: 'Error', color: 'red', message: 'Not able to fetch addresses. Something went wrong!!'
            });
        }).finally(() => toggleLoading(l => !l));
    };

    const handleCreate = () => history.push(`/Addresses/Address`);

    const handleEdit = (id) => history.push(`/Addresses/Address/${id}`);

    const handleDelete = (id) => {
        modals.openConfirmModal({
            title: "Are you sure you want to delete the address?",
            labels: {confirm: "Delete address", cancel: "No don't delete it"},
            confirmProps: {color: "red"},
            onConfirm: () => {
                requestHandler(deleteAddress(id), {loader: true}).then(() => {
                    notifications.showNotification({
                        title: 'Success', color: 'green', message: 'Addresses has been deleted successfully.'
                    });
                    fetchData();
                }).catch(e => {
                    notifications.showNotification({
                        title: 'Error', color: 'red', message: 'Not able to delete address. Something went wrong!!'
                    });
                });
            }
        });
    };

    const handlePageChange = (pageNum) => {
        const recordNum = pageNum * PAGE_SIZE;
        if (recordNum > state.data.length && recordNum <= state.pagination.count) {
            toggleLoading(l => !l);
            const params = {
                per_page: (PAGE_SIZE * 10), page_no: state.pagination.next_page, filter: {
                    name_cont: searchText, address1_cont: searchText, m: 'or'
                }
            };
            requestHandler(getAddresses(params)).then(res => {
                const {data, meta: {pagination: {count, next_page}}} = res;
                setState({
                    data: [...state.data, ...data],
                    pagination: {...state.pagination, next_page, count, pageNum}
                });
            }).catch(e => {
                console.error(e);
                notifications.showNotification({
                    title: 'Error', color: 'red', message: 'Not able to fetch addresses. Something went wrong!!'
                });
            }).finally(() => toggleLoading(l => !l));
        } else {
            setState({pagination: {...state.pagination, pageNum}});
        }
    };

    return (
        <ContentArea withPaper>
            <Group mb="xl">
                <Title order={2} mr="xl">Address</Title>
                <Box mx="xl" style={{flexGrow: 1}}>
                    <TextInput
                        placeholder="Search address"
                        icon={<MagnifyingGlassIcon size={16}/>}
                        fullWidth radius="xl"
                        rightSectionWidth={40}
                        onChange={e => setSearchText(e.target.value)}
                    />
                </Box>
                <Button leftIcon={<CreateIcon/>} onClick={handleCreate} ml="xl">Create Address</Button>
            </Group>

            <Group mb="xl" direction="column" grow>
                {!loading && state.data.slice((state.pagination.pageNum - 1) * PAGE_SIZE, state.pagination.pageNum * PAGE_SIZE)
                    .map(item => (
                        <Paper key={item.id} withBorder shadow="sm" padding={0} radius="md"
                               style={{overflow: 'hidden'}}>
                            <Group align="start" spacing="md">
                                <Image src={getStaticMap(item.latitude, item.longitude)} width={160} height={120}/>
                                <Group align="start" position="apart" sx={t => ({padding: t.spacing.sm, flexGrow: 1})}>
                                    <Box>
                                        <Text size="md" weight={500}>{item.name}</Text>
                                        <Box>
                                            <Center inline>
                                                <MapPinIcon size={12} color={theme.colors.gray[5]}/>
                                                <Text size="sm" color="dimmed" ml={4}>{getAddressString(item)}</Text>
                                            </Center>
                                        </Box>
                                        {item.phone && <Box>
                                            <Center inline>
                                                <PhoneIcon size={12} color={theme.colors.gray[5]}/>
                                                <Text size="sm" color="dimmed" ml={4}>{item.phone}</Text>
                                            </Center>
                                        </Box>}
                                        {item.address_type && <Badge
                                            size={"sm"} mt="xs" variant="gradient"
                                            gradient={{from: 'yellow', to: 'red'}}
                                        >
                                            {getOptionLabel(ADDRESS_TYPE, item.address_type)}
                                        </Badge>}
                                    </Box>
                                    <Group align="start" position="right" spacing="xs">
                                        <ActionIcon onClick={() => handleEdit(item.id)}><EditIcon/></ActionIcon>
                                        <ActionIcon color="red" onClick={() => handleDelete(item.id)}>
                                            <DeleteIcon/>
                                        </ActionIcon>
                                    </Group>
                                </Group>
                            </Group>
                        </Paper>
                    ))
                }

                {loading && [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(item => (
                    <Paper withBorder shadow="sm" padding={0} key={item} radius="md">
                        <Group align="start" spacing="md">
                            <Skeleton width={160} height={120} radius={0}/>
                            <Group align="start" direction="column" sx={t => ({padding: t.spacing.sm})}
                                   style={{flexGrow: 1}}>
                                <Skeleton height={20} width={200}/>
                                <Skeleton height={12} width={360}/>
                                <Skeleton height={16} width={100} radius="xl"/>
                            </Group>
                        </Group>
                    </Paper>))
                }
            </Group>

            {!loading && state.data.length === 0 && <Group position="center" direction="column" m="xl">
                <ThemeIcon variant="gradient" radius="xl" size="xl" gradient={{from: 'indigo', to: 'cyan'}}>
                    <AiOutlineInbox size={20}/>
                </ThemeIcon>

                <Title order={1} style={{fontSize: 48}}>No record found.</Title>

                <Text color="dimmed">Sorry, we couldn't find the records you're looking for.</Text>
            </Group>}

            {/*<Grid mb="xl">
                {state.data.map(item => (
                    <Col span={4} key={item.id}>
                        <Card shadow="md" padding="md" withBorder>
                            <Card.Section mb="md">
                                <Image src={getStaticMap(item.latitude, item.longitude)} height={180}/>
                            </Card.Section>
                            {item.address_type && <Badge
                                size={"sm"} variant="gradient"
                                gradient={{from: 'yellow', to: 'red'}}
                                sx={t => ({
                                    position: 'absolute',
                                    top: t.spacing.xs,
                                    right: t.spacing.xs + 2,
                                    pointerEvents: 'none'
                                })}
                            >
                                {item.address_type}
                            </Badge>}
                            <Text size="md" weight={500}>{item.name}</Text>
                            <Text size="sm" color="dimmed">{getAddressString(item)}</Text>
                            {item.phone && <Box>
                                <Center inline>
                                    <PhoneIcon size={12} color={theme.colors.gray[5]}/>
                                    <Text size="sm" color="dimmed" ml={"xs"}>{item.phone}</Text>
                                </Center>
                            </Box>}
                            <Card.Section>
                                <Group m="md" spacing={"md"}>
                                    <Button style={{flex: 1}}>Show details</Button>
                                    <ActionIcon color="red" variant="light" radius="md" size={36}>
                                        <DeleteIcon/>
                                    </ActionIcon>
                                </Group>
                            </Card.Section>
                        </Card>
                    </Col>
                ))}
            </Grid>*/}

            {state.data.length > 0 && <Pagination
                position="center" size="lg" radius="md"
                page={state.pagination.pageNum}
                total={Math.ceil(state.pagination.count / PAGE_SIZE)}
                onChange={handlePageChange}
            />}
        </ContentArea>
    );
};

export default Addresses;