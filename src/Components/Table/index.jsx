import {createStyles, Table, Box} from '@mantine/core';

const useStyles = createStyles((t) => ({
    root: {

    },
    stickHeader: {
        top: 0,
        position: "sticky",
        backgroundColor: t.colors.gray[2]
    },
    header: {

    }
}));

export const TableComponent = ({schema, data, stickyHeader}) => {
    const {classes, cx} = useStyles();

    const renderRow = () => {
        return data.map((row, i) => (
            <tr key={i}>{schema.map((col) => <td key={`${i}_${col.id}`}>{row[col.id]}</td>)}</tr>
        ));
    }

    return (

        <Table style={{height: '100%', display: 'block', overflow: 'auto'}}>
            <thead className={cx({[classes.stickHeader]: stickyHeader})}>
            <tr>{schema.map((col) => <th key={col.id}>{col.header}</th>)}</tr>
            </thead>
            <tbody>{data && renderRow()}</tbody>
        </Table>
    );
};