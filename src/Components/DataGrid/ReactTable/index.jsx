import {useRowSelect, useSortBy, useTable} from 'react-table';
import {Checkbox, createStyles, Group, Table} from '@mantine/core';
import {TiArrowSortedUp as AscIcon, TiArrowUnsorted as SortIcon} from 'react-icons/ti';

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
    disableSortIcon: {color: t.colors.gray[6]},
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

export const ReactTable = ({schema, data, stickyHeader, sorting, selection, onRowClick, onAllRowsSelection}) => {
    const {classes, cx} = useStyles();

    const {getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, selectedFlatRows} = useTable(
        {columns: schema, data},
        useSortBy,
        useRowSelect,
        (hook) => selectionHook(hook, selection)
    );

    const handleRowClick = (e, row) => {
        console.log('Row Selected: ', row);
        onRowClick && onRowClick(row);
    };

    const handleAllRowsSelection = (e) => {
        const rowsData = selectedFlatRows.map(d => d.original);
        console.log(rowsData);
        onAllRowsSelection && onAllRowsSelection(rowsData);
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

    return (
        <div className={classes.root}>
            {/*<pre>
                <code>
                    {JSON.stringify({'selectedFlatRows': selectedFlatRows.map(d => d.original)}, null, 2)}
                </code>
            </pre>*/}
            <div className={classes.tableContainer} style={{height: '100%'}}>
                <Table {...getTableProps()}>
                    <thead className={cx({[classes.stickHeader]: stickyHeader})}>
                    {renderHeader()}
                    </thead>

                    <tbody {...getTableBodyProps()}>
                    {rows.map((row, i) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps({onClick: e => handleRowClick(e, row)})}>
                                {row.cells.map(cell => (<td {...cell.getCellProps()}>{cell.render('Cell')}</td>))}
                            </tr>
                        )
                    })}
                    </tbody>
                </Table>
            </div>
        </div>
    );
};