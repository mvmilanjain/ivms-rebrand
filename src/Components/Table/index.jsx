import {useEffect, useState} from 'react';
import get from 'lodash/get';
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
import {ArrowUpIcon as AscIcon} from '@modulz/radix-icons';
import {AiOutlineInbox} from 'react-icons/ai';

const pageSizeOptions = [
    {value: '10', label: '10'},
    {value: '25', label: '25'},
    {value: '50', label: '50'},
    {value: '100', label: '100'}
];

const descendingComparator = (a, b, sortBy) => {
    if (get(b, sortBy, '') < get(a, sortBy, '')) return -1;
    if (get(b, sortBy, '') > get(a, sortBy, '')) return 1;
    return 0;
};

const useStyles = createStyles((t) => ({
    root: {height: '100%', display: 'block'},
    tableContainer: {
        display: 'block',
        overflow: 'auto',
        '& > table': {
            '& > thead': {backgroundColor: t.colors.gray[0]},
            '& > thead > tr > th': {padding: t.spacing.md},
            '& > tbody > tr > td': {padding: t.spacing.md}
        }
    },
    stickHeader: {top: 0, position: 'sticky'},
    sortableHeader: {cursor: 'pointer'},
    sortDirectionIcon: {transition: 'transform 200ms ease'}
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
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [pageCount, setPageCount] = useState(1);
    const [pageSize, setPageSize] = useState(rowsPerPage);
    const [paginatedData, setPaginatedData] = useState();
    const [position, setPosition] = useState({start: 1, end: 10});
    const [sortDirection, setSortDirection] = useState('none');
    const [sortBy, setSortBy] = useState('');


    useEffect(() => {
        if (!loading) {
            calculatePageCount(rowsPerPage);
            handlePaginatedData(currentPage, pageSize, sortDirection, sortBy);
        }
    }, [loading]);

    const sortData = (sortDirection, sortBy) => {
        if (sortDirection === 'none') return data;

        const stabilizedThis = data.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = (sortDirection === 'desc') ?
                descendingComparator(a[0], b[0], sortBy) :
                -descendingComparator(a[0], b[0], sortBy);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    };

    const calculatePageCount = (pageSize = 10) => {
        const totalPages = data ? Math.ceil(total / pageSize) : 0;
        setPageCount(totalPages);
    };

    const handlePageSizeChange = (pageSize) => {
        pageSize = Number(pageSize);
        calculatePageCount(pageSize);
        setPageSize(pageSize);
        handlePaginatedData(initialPage, pageSize, sortDirection, sortBy);
    };

    const handlePageChange = (pageNum) => {
        setCurrentPage(pageNum);
        handlePaginatedData(pageNum, pageSize, sortDirection, sortBy);
    };

    const handlePaginatedData = (pageNum, pageSize, sortDirection, sortBy) => {
        const startIndex = (pageNum - 1) * pageSize;
        const endIndex = pageNum * pageSize;
        setPaginatedData(sortData(sortDirection, sortBy).slice(startIndex, endIndex));
        setPosition({start: startIndex + 1, end: endIndex > total ? total : endIndex});
    };

    const handleSort = (columnId) => {
        let newDirection = 'asc';
        if (columnId === sortBy) {
            if (sortDirection === 'asc') {
                newDirection = 'desc';
            } else if (sortDirection === 'desc') {
                newDirection = 'none';
            }
        }
        setSortDirection(newDirection);
        setSortBy(columnId);
        handlePaginatedData(currentPage, pageSize, newDirection, columnId);
    };

    const renderHeader = () => {
        return schema.map((col) => {
            if (!col.sort) {
                return <th key={col.id} style={{minWidth: col.width, textAlign: col.align || 'left'}}>
                    {col.header}
                </th>;
            } else {
                return <th
                    key={col.id}
                    className={classes.sortableHeader}
                    style={{minWidth: col.width}}
                    onClick={() => handleSort(col.id)}
                >
                    <Group noWrap position={col.align || 'left'}>
                        <span>{col.header}</span>
                        {(sortBy !== col.id || sortDirection === 'none') &&
                        <div style={{width: '15px', height: '15px'}}/>}
                        {sortBy === col.id && sortDirection !== 'none' && <AscIcon
                            className={classes.sortDirectionIcon}
                            style={{transform: sortDirection === 'desc' ? 'rotate(180deg)' : 'none'}}
                        />}
                    </Group>
                </th>;
            }
        });
    };

    const renderRow = () => {
        return paginatedData.map((row, i) => (
            <tr key={i}>
                {schema.map((col) => {
                    if (col.hidden) {
                        return null;
                    } else if (col.hasOwnProperty('render')) {
                        return <td key={`${i}_${col.id}`} align={col.align || 'left'}>
                            {col.render(row)}
                        </td>;
                    } else {
                        return <td key={`${i}_${col.id}`} align={col.align || 'left'}>
                            {get(row, col.id, '')}
                        </td>;
                    }
                })}
            </tr>
        ));
    };

    return (
        <Box component="div" className={classes.root}>
            <LoadingOverlay visible={loading}/>
            <Box component="div" className={classes.tableContainer} style={{
                height: pagination ? 'calc(100% - 44px)' : '100%'
            }}>
                <Table highlightOnHover={!loading && (data.length > 0)}>
                    <thead className={cx({[classes.stickHeader]: stickyHeader})}>
                    <tr>{renderHeader()}</tr>
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
                        value={pageSize + ''}
                        onChange={handlePageSizeChange}
                    />
                    <Divider orientation="vertical" mx="sm"/>

                    <Text size="sm">{position.start} - {position.end} of {total}</Text>
                    <Divider orientation="vertical" mx="sm"/>

                    <Pagination
                        initialPage={initialPage}
                        total={pageCount}
                        onChange={handlePageChange}
                    />
                </Group>
            </>}
        </Box>
    );
};