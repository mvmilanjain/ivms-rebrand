import {useEffect} from 'react';
import {useFilters, usePagination, useRowSelect, useSortBy, useTable} from 'react-table';
import {
    ActionIcon,
    Box,
    Checkbox,
    createStyles,
    Divider,
    Group,
    LoadingOverlay,
    NumberInput,
    Select,
    Table,
    Text
} from '@mantine/core';
import {ChevronLeftIcon, ChevronRightIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon} from '@modulz/radix-icons';
import {BsArrowDownUp as SortIcon, BsArrowUp as AscIcon,} from 'react-icons/bs';

import FilterTypes from './filterTypes';
import {StringFilter} from './Filters';

const pageSizeOptions = ['10', '25', '50', '100'];

const useStyles = createStyles((t) => ({
    root: {height: '100%', display: 'block'},
    tableContainer: {
        display: 'block',
        overflow: 'auto',
        '& > table': {
            '& > thead': {backgroundColor: t.colors.gray[0], zIndex: 1},
            '& > thead > tr > th': {padding: t.spacing.md},
            '& > tbody > tr > td': {padding: t.spacing.md},
        }
    },
    stickHeader: {top: 0, position: 'sticky'},
    sortableHeader: {'&:hover': {backgroundColor: t.colors.gray[2]}},
    disableSortIcon: {color: t.colors.gray[5]},
    sortDirectionIcon: {transition: 'transform 200ms ease'}
}));

const defaultColumn = {
    Filter: StringFilter,
    filter: 'stringFilter'
};

const selectionHook = (hook, selection) => {
    if (selection) {
        hook.visibleColumns.push(columns => [
            {
                id: 'selection',
                Header: ({getToggleAllRowsSelectedProps}) => (
                    <Checkbox {...getToggleAllRowsSelectedProps({title: undefined})}/>
                ),
                Cell: ({row}) => (
                    <Checkbox {...row.getToggleRowSelectedProps({
                        title: undefined,
                        onClick: e => e.stopPropagation()
                    })}/>
                )
            },
            ...columns
        ]);
    }
};

export const ReactTable = (
    {
        schema,
        data = [],
        serverSideDataSource = false,
        initialPageSize = 10,
        initialPageIndex = 0,
        pageCount = 0,
        total = 0,
        stickyHeader,
        loading,
        filtering,
        sorting,
        selection,
        pagination,
        onRowClick,
        onAllRowsSelection,
        fetchData, // Pass function to fetch data for server side operations
        ...rest
    }
) => {
    const {classes, cx} = useStyles();

    const tableOptions = useTable(
        {
            columns: schema,
            data,
            defaultColumn,
            disableFilters: !filtering,
            disableSortBy: !sorting,
            manualFilters: serverSideDataSource,
            manualPagination: serverSideDataSource,
            manualSortBy: serverSideDataSource,
            autoResetFilters: !serverSideDataSource,
            autoResetPage: !serverSideDataSource,
            autoResetSortBy: !serverSideDataSource,
            pageCount,
            filterTypes: FilterTypes,
            initialState: {pageSize: initialPageSize, pageIndex: initialPageIndex}
        },
        useFilters,
        useSortBy,
        usePagination,
        useRowSelect,
        (hook) => selectionHook(hook, selection)
    );

    const {
        getTableProps, getTableBodyProps, headerGroups, rows, prepareRow,
        page, gotoPage, nextPage, previousPage, setPageSize, canPreviousPage, canNextPage,
        state: {pageIndex, pageSize, sortBy, filters}
    } = tableOptions;

    useEffect(() => {
        fetchData && fetchData({pageIndex, pageSize, sortBy, filters});
    }, [sortBy, fetchData, pageIndex, pageSize, filters]);

    const handleRowClick = (e, row) => {
        console.log('Row Selected: ', row);
        onRowClick && onRowClick(row);
    };

    const renderHeader = () => headerGroups.map(hg => <tr {...hg.getHeaderGroupProps()}>
        {hg.headers.map(column => (
            <th
                className={cx({[classes.sortableHeader]: column.canSort})}
                {...column.getHeaderProps(column.getSortByToggleProps({title: undefined}))}
            >
                <Group noWrap position="apart">
                    <span>{column.render('Header')}</span>
                    <div>
                        {column.canFilter ? column.render('Filter') : null}
                        {column.canSort ?
                            (
                                column.isSorted ?
                                    <Box component="span" ml="xs">
                                        <AscIcon
                                            className={classes.sortDirectionIcon}
                                            style={{transform: column.isSortedDesc ? 'rotate(180deg)' : 'none'}}
                                        />
                                    </Box> :
                                    <Box component="span" ml="xs">
                                        <SortIcon className={classes.disableSortIcon}/>
                                    </Box>
                            ) : null
                        }
                    </div>
                </Group>
            </th>
        ))}
    </tr>);

    const renderRow = rows => rows.map((row, i) => {
        prepareRow(row);
        return (
            <tr {...row.getRowProps({onClick: e => handleRowClick(e, row)})}>
                {row.cells.map(cell => (<td {...cell.getCellProps()}>{cell.render('Cell')}</td>))}
            </tr>
        )
    });

    return (
        <div className={classes.root}>
            <LoadingOverlay visible={loading}/>
            <div className={classes.tableContainer} style={{height: pagination ? 'calc(100% - 44px)' : '100%'}}>
                {/*<pre>
                  <code>{JSON.stringify(filters, null, 2)}</code>
                </pre>*/}
                <Table {...getTableProps()}>
                    <thead className={cx({[classes.stickHeader]: stickyHeader})}>{renderHeader()}</thead>

                    <tbody {...getTableBodyProps()}>{pagination ? renderRow(page) : renderRow(rows)}</tbody>
                </Table>
            </div>
            {pagination && <>
                <Divider mb="md" variant="dotted"/>
                <Group position="left">
                    <Text size="sm">Rows per page: </Text>
                    <Select
                        style={{width: '72px'}}
                        variant="filled"
                        data={pageSizeOptions}
                        value={pageSize + ''}
                        onChange={pageSize => setPageSize(Number(pageSize))}
                    />
                    <Divider orientation="vertical"/>

                    <Text size="sm">{(pageIndex * pageSize) + 1} - {(pageIndex + 1) * pageSize} of {total}</Text>
                    <Divider orientation="vertical"/>

                    <Text size="sm">Go to page: </Text>
                    <NumberInput
                        style={{width: '100px'}}
                        variant="filled"
                        hideControls
                        defaultValue={pageIndex + 1}
                        onChange={pageNum => gotoPage(pageNum - 1)}
                    />
                    <Divider orientation="vertical"/>

                    <ActionIcon variant="default" disabled={!canPreviousPage} onClick={() => gotoPage(0)}>
                        <DoubleArrowLeftIcon/>
                    </ActionIcon>
                    <ActionIcon variant="default" disabled={!canPreviousPage} onClick={previousPage}>
                        <ChevronLeftIcon/>
                    </ActionIcon>
                    <ActionIcon variant="default" disabled={!canNextPage} onClick={nextPage}>
                        <ChevronRightIcon/>
                    </ActionIcon>
                    <ActionIcon variant="default" disabled={!canNextPage} onClick={() => gotoPage(pageCount - 1)}>
                        <DoubleArrowRightIcon/>
                    </ActionIcon>
                </Group>
            </>}
        </div>
    );
};