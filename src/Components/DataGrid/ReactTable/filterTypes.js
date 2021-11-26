const stringFilterFn = (rows, id, filter) => {
    let result = [];
    const {operator = 'cont', value} = filter;
    switch (operator) {
        case 'start':
            result = rows.filter(row => {
                const rowValue = row.values[id];
                return !!rowValue ? String(rowValue).toLowerCase().startsWith(String(value).toLowerCase()) : false;
            });
            break;
        case 'end':
            result = rows.filter(row => {
                const rowValue = row.values[id];
                return !!rowValue ? String(rowValue).toLowerCase().endsWith(String(value).toLowerCase()) : false;
            });
            break;
        case 'eq':
            result = rows.filter(row => {
                const rowValue = row.values[id];
                return !!rowValue ? String(rowValue).toLowerCase() === String(value).toLowerCase() : false;
            });
            break;
        case 'not_eq':
            result = rows.filter(row => {
                const rowValue = row.values[id];
                return !!rowValue ? String(rowValue).toLowerCase() !== String(value).toLowerCase() : true;
            });
            break;
        case 'not_cont':
            result = rows.filter(row => {
                const rowValue = row.values[id];
                return !!rowValue ? !String(rowValue).toLowerCase().includes(String(value).toLowerCase()) : true;
            });
            break;
        default:
            result = rows.filter(row => {
                const rowValue = row.values[id];
                return !!rowValue ? String(rowValue).toLowerCase().includes(String(value).toLowerCase()) : false;
            });
            break;
    }
    return result;
};

stringFilterFn.autoRemove = val => !val;

export default {
    stringFilter: stringFilterFn
};