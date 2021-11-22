import {useEffect} from 'react';
import {usePagination, useRowSelect, useSortBy, useTable} from 'react-table';
import {
    ActionIcon,
    Checkbox,
    createStyles,
    Divider,
    Group,
    LoadingOverlay,
    Select,
    Table,
    Text,
    NumberInput
} from '@mantine/core';
import {
    ArrowUpIcon as AscIcon,
    CaretSortIcon as SortIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    DoubleArrowLeftIcon,
    DoubleArrowRightIcon
} from '@modulz/radix-icons';

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
        initialPageSize = 10,
        initialPageIndex = 0,
        pageCount = 0,
        total = 0,
        stickyHeader,
        fetchData,
        loading,
        sorting,
        selection,
        pagination,
        onRowClick,
        onAllRowsSelection,
        manualPagination,
        manualSortBy,
        autoResetPage = true,
        autoResetSortBy = true,
    }
) => {
    const {classes, cx} = useStyles();

    const tableOptions = useTable(
        {
            columns: schema,
            data,
            manualPagination,
            manualSortBy,
            autoResetPage,
            autoResetSortBy,
            pageCount,
            initialState: {pageSize: initialPageSize, pageIndex: initialPageIndex}
        },
        useSortBy,
        usePagination,
        useRowSelect,
        (hook) => selectionHook(hook, selection)
    );

    const {
        getTableProps, getTableBodyProps, headerGroups, rows, prepareRow,
        page, gotoPage, nextPage, previousPage, setPageSize, canPreviousPage, canNextPage,
        state: {pageIndex, pageSize, sortBy}
    } = tableOptions;

    useEffect(() => {
        fetchData && fetchData({pageIndex, pageSize, sortBy});
    }, [sortBy, fetchData, pageIndex, pageSize]);

    const handleRowClick = (e, row) => {
        console.log('Row Selected: ', row);
        onRowClick && onRowClick(row);
    };

    const renderHeader = () => headerGroups.map(hg => <tr {...hg.getHeaderGroupProps()}>
        {hg.headers.map(column => {
            if (!sorting || !column.canSort) {
                return <th {...column.getHeaderProps()}>{column.render('Header')}</th>;
            } else {
                return (
                    <th
                        className={classes.sortableHeader}
                        {...column.getHeaderProps(column.getSortByToggleProps({title: undefined}))}
                    >
                        <Group noWrap>
                            <span>{column.render('Header')}</span>
                            {column.isSorted ?
                                <AscIcon
                                    className={classes.sortDirectionIcon}
                                    style={{transform: column.isSortedDesc ? 'rotate(180deg)' : 'none'}}
                                /> :
                                <SortIcon className={classes.disableSortIcon}/>
                            }
                        </Group>
                    </th>
                );
            }
        })}
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
            <div className={classes.tableContainer} style={{
                height: pagination ? 'calc(100% - 44px)' : '100%'
            }}>
                <Table {...getTableProps()}>
                    <thead className={cx({[classes.stickHeader]: stickyHeader})}>
                    {renderHeader()}
                    </thead>

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