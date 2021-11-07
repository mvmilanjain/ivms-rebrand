import {useEffect, useState} from 'react';
import {
    ActionIcon,
    Box,
    createStyles,
    Divider,
    Group,
    LoadingOverlay,
    Pagination,
    Select,
    Table,
    Text
} from '@mantine/core';
import {AiOutlineInbox} from 'react-icons/ai';

const pageSizeOptions = [
    {value: '10', label: '10'},
    {value: '25', label: '25'},
    {value: '50', label: '50'},
    {value: '100', label: '100'}
];

const useStyles = createStyles((t) => ({
    root: {
        height: '100%',
        display: 'block'
    },
    tableContainer: {
        display: 'block',
        overflow: 'auto',
        '& > table': {
            '& > thead': {backgroundColor: t.colors.gray[0]},
            '& > thead > tr > th': {padding: t.spacing.md},
            '& > tbody > tr > td': {padding: t.spacing.sm}
        }
    },
    stickHeader: {top: 0, position: 'sticky'}
}));

export const TableComponent = (
    {
        schema, data, loading,
        stickyHeader = false,
        pagination = false,
        rowsPerPage = 10,
        initialPage = 1,
        total = 0
    }
) => {
    const {classes, cx} = useStyles();
    const [pageCount, setPageCount] = useState(1);
    const [pageSize, setPageSize] = useState(rowsPerPage);
    const [paginatedData, setPaginatedData] = useState();
    const [position, setPosition] = useState({start: 1, end: 10})

    useEffect(() => {
        if (!loading) {
            calculatePageCount(rowsPerPage);
            handlePageChange(initialPage, pageSize)
        }
    }, [loading]);

    const calculatePageCount = (pageSize = 10) => {
        const totalPages = data ? Math.ceil(total / pageSize) : 0;
        setPageCount(totalPages);
    };

    const handlePageSizeChange = (pageSize) => {
        pageSize = Number(pageSize);
        calculatePageCount(pageSize);
        setPageSize(pageSize);
        handlePageChange(initialPage, pageSize);
    };

    const handlePageChange = (pageNum = 1, pageSize = 10) => {
        const startIndex = (pageNum - 1) * pageSize;
        const endIndex = pageNum * pageSize;
        setPaginatedData(data.slice(startIndex, endIndex));
        setPosition({start: startIndex + 1, end: endIndex > total ? total : endIndex});
    };

    const renderRow = () => {
        return paginatedData.map((row, i) => (
            <tr key={i}>
                {schema.map((col) => (
                    <td key={`${i}_${col.id}`} style={{minWidth: col.width}}>
                        {row[col.id]}
                    </td>
                ))}
            </tr>
        ));
    };

    return (
        <Box component="div" className={classes.root}>
            <LoadingOverlay visible={loading}/>
            <Box component="div" className={classes.tableContainer} style={{
                height: pagination ? 'calc(100% - 44px)' : '100%'
            }}>
                <Table highlightOnHover>
                    <thead className={cx({[classes.stickHeader]: stickyHeader})}>
                    <tr>{schema.map((col) => <th key={col.id}>{col.header}</th>)}</tr>
                    </thead>

                    <tbody>
                    {!loading && (data.length > 0) && renderRow()}

                    {!loading && (data.length <= 0) && <tr>
                        <Box component="td" colSpan="1000">
                            <Group position="center" direction="column" spacing="xs" my="md">
                                <ActionIcon variant="transparent" color="gray" size="lg" sx={t => ({
                                    color: t.colors.gray[6],
                                    cursor: 'default'
                                })}>
                                    <AiOutlineInbox size={48}/>
                                </ActionIcon>
                                <Text weight={500} size="xl" sx={t => ({color: t.colors.gray[6]})}>No Data</Text>
                            </Group>
                        </Box>
                    </tr>}
                    </tbody>
                </Table>
            </Box>
            {pagination && <>
                <Divider mb="xs"/>
                <Group position="left">
                    <Text size="sm">Rows per page: </Text>
                    <Select
                        style={{width: '72px'}}
                        variant="filled"
                        data={pageSizeOptions}
                        value={`${pageSize}`}
                        onChange={handlePageSizeChange}
                    />
                    <Divider orientation="vertical" mx="sm"/>

                    <Text size="sm">{position.start} - {position.end} of {total}</Text>
                    <Divider orientation="vertical" mx="sm"/>

                    <Pagination total={pageCount} initialPage={initialPage} onChange={handlePageChange}/>
                </Group>
            </>}
        </Box>
    );
};