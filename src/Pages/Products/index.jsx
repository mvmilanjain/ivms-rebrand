import {useCallback, useState} from 'react';
import {ActionIcon, Button, Group, Menu, Title} from '@mantine/core';
import {useSetState} from '@mantine/hooks';
import {useModals} from '@mantine/modals';
import {useNotifications} from '@mantine/notifications';
import {DotsVerticalIcon} from '@modulz/radix-icons';
import {MdOutlineAddBox as CreateIcon, MdOutlineDelete as DeleteIcon, MdOutlineEdit as EditIcon} from 'react-icons/md';

import {ContentArea, ReactTable} from 'Components';
import {useHttp} from 'Hooks';
import {deleteProduct, getProducts} from 'Shared/Services';
import {getFilterList, getSortText} from 'Shared/Utilities/common.util';
import {PRODUCT_SCHEMA} from 'Shared/Utilities/tableSchema';

const Products = ({history, ...rest}) => {
    const {requestHandler} = useHttp();
    const modals = useModals();
    const notifications = useNotifications();
    const [loading, toggleLoading] = useState(false);
    const [state, setState] = useSetState({
        reload: false, data: [],
        pagination: {total: 0, pageCount: 0, pageIndex: 0}
    });

    const fetchData = useCallback(({pageSize, pageIndex, sortBy, filters}) => {
        toggleLoading(l => !l);
        const params = {
            per_page: pageSize, page_no: pageIndex + 1,
            sort: getSortText(sortBy), filter: getFilterList(filters)
        };
        requestHandler(getProducts(params)).then(res => {
            const {data, meta: {pagination: {count, current_page, total_pages}}} = res;
            setState({
                reload: false, data,
                pagination: {total: count, pageCount: total_pages, pageIndex: current_page - 1}
            });
        }).catch(e => console.error(e)).finally(() => toggleLoading(l => !l));
    }, []);

    const renderActions = ({value}) => {
        return (
            <Menu withArrow size="sm" control={<ActionIcon variant="transparent"><DotsVerticalIcon/></ActionIcon>}>
                <Menu.Item icon={<EditIcon/>} onClick={() => handleEdit(value)}>Edit Product</Menu.Item>
                <Menu.Item icon={<DeleteIcon/>} color="red" onClick={() => handleDelete(value)}>
                    Delete Product
                </Menu.Item>
            </Menu>
        );
    };

    const handleCreate = () => history.push(`/products/product`);

    const handleEdit = (id) => history.push(`/products/product/${id}`);

    const handleDelete = (id) => {
        modals.openConfirmModal({
            title: "Are you sure you want to delete the product?",
            labels: {confirm: "Delete product", cancel: "No don't delete it"},
            confirmProps: {color: "red"},
            onConfirm: () => {
                toggleLoading(l => !l);
                requestHandler(deleteProduct(id)).then(() => {
                    notifications.showNotification({
                        title: "Success", color: "green",
                        message: "Products has been deleted successfully."
                    });
                    setState({reload: true});
                }).catch(e => {
                    notifications.showNotification({
                        title: "Error", color: 'red',
                        message: 'Not able to delete product. Something went wrong!!'
                    });
                }).finally(() => toggleLoading(l => !l));
            }
        });
    };

    return (
        <ContentArea withPaper limitToViewPort>
            <Group position="apart" mb="md">
                <Title order={2}>Product</Title>
                <Button leftIcon={<CreateIcon/>} onClick={handleCreate}>Create Product</Button>
            </Group>
            <div style={{height: 'calc(100% - 60px)'}}>
                <ReactTable
                    columns={[
                        {
                            accessor: 'id', Header: '', disableSortBy: true,
                            cellMinWidth: 40, cellWidth: 40, Cell: renderActions
                        },
                        ...PRODUCT_SCHEMA
                    ]}
                    data={state.data}
                    serverSideDataSource
                    fetchData={fetchData}
                    loading={loading}
                    reload={state.reload}
                    stickyHeader sorting
                    pagination initialPageSize={50}
                    {...state.pagination}
                />
            </div>
        </ContentArea>
    );
};

export default Products;