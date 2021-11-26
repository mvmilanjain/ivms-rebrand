import {useCallback, useEffect, useRef, useState} from 'react';
import {
    ActionIcon,
    Anchor,
    Button,
    Divider,
    Group,
    Paper,
    Popover,
    Radio,
    RadioGroup,
    TextInput,
    Title
} from '@mantine/core';
import {BsFilter as FilterIcon} from 'react-icons/bs';

import {ReactTable} from 'Components';

const Demo = (props) => {
    const [data, setData] = useState([]);

    const [loading, toggleLoading] = useState(false);
    const [pageCount, setPageCount] = useState(0);
    const [total, setTotal] = useState(0);

    const [opened, setOpened] = useState(false);
    const fetchIdRef = useRef(0);

    useEffect(() => {
        // getDataSource();
    }, []);

    const getDataSource = () => {
        fetch('https://jsonplaceholder.typicode.com/comments').then(res => res.json()).then(data => {
            setData(data);
            setTotal(data.length);
            setPageCount(Math.ceil(data.length / 10));
        });
    };

    const fetchData = useCallback(({pageSize, pageIndex, sortBy}) => {
        const fetchId = ++fetchIdRef.current;
        toggleLoading(true);

        fetch('https://jsonplaceholder.typicode.com/comments').then(res => res.json()).then(serverData => {
            if (fetchId === fetchIdRef.current) {
                const startRow = pageSize * pageIndex;
                const endRow = startRow + pageSize;
                if (sortBy.length === 0) {
                    setData(serverData.sort().slice(startRow, endRow));
                } else {
                    setData(
                        serverData.sort((a, b) => {
                            const field = sortBy[0].id;
                            const desc = sortBy[0].desc;
                            if (a[field] < b[field]) return desc ? 1 : -1;
                            if (a[field] > b[field]) return desc ? -1 : 1;
                            return 0;
                        }).slice(startRow, endRow)
                    );
                }
                setTotal(serverData.length);
                setPageCount(Math.ceil(serverData.length / pageSize));
                toggleLoading(false);
            }
        });
    }, []);

    return (
        <Paper padding="lg" withBorder style={{height: '100%'}}>
            <Group position="apart" mb="sm">
                <Title order={2}>Demo</Title>

                <Popover
                    target={<ActionIcon onClick={() => setOpened(o => !o)}><FilterIcon/></ActionIcon>}
                    opened={opened}
                    onClose={() => setOpened(false)}
                    position="bottom"
                    placement="end"
                    withArrow
                    transition="scale-y"
                >
                    <RadioGroup description="Select your option" value="cont" mb="md" variant="vertical" size="sm">
                        <Radio value="cont">Contains</Radio>
                        <Radio value="not_cont">Does not contain</Radio>
                        <Radio value="start">Starts with</Radio>
                        <Radio value="end">Ends with</Radio>
                        <Radio value="eq">Equals</Radio>
                        <Radio value="not_eq">Not equal</Radio>
                    </RadioGroup>
                    <Divider mb="md"/>
                    <TextInput placeholder="Enter filter string..." mb="xl" autoFocus/>

                    <Group position="apart">
                        <Anchor component="button" color="gray" onClick={() => setOpened(false)}>Clear</Anchor>
                        <Button>Apply</Button>
                    </Group>

                </Popover>
            </Group>

            <div style={{height: 'calc(100% - 60px)'}}>
                <ReactTable
                    schema={[
                        {accessor: 'id', Header: 'Id'},
                        {accessor: 'postId', Header: 'Post Id'},
                        {accessor: 'name', Header: 'Name'},
                        {accessor: 'email', Header: 'Email Address'}
                    ]}
                    data={data}
                    loading={loading}
                    pageCount={pageCount}
                    total={total}
                    stickyHeader
                    // selection
                    sorting
                    pagination
                    fetchData={fetchData}
                    manualSortBy
                    autoResetSortBy={false}
                    manualPagination
                    autoResetPage={false}
                />
            </div>
        </Paper>
    );
};

export default Demo;