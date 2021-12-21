import {useEffect, useState} from 'react';
import get from 'lodash/get';
import {useFormik} from 'formik';
import {Button, Divider, Group, Title, Grid, Col, TextInput, NumberInput, ActionIcon} from '@mantine/core';
import {useModals} from '@mantine/modals';
import {useNotifications} from '@mantine/notifications';
import {
    MdOutlineAddBox as AddStopIcon,
    MdOutlineDelete as DeleteIcon,
    MdOutlineEdit as EditIcon,
    MdOutlineSave as SaveIcon
} from 'react-icons/md';

import {ContentArea, ReactTable} from 'Components';
import {useHttp} from 'Hooks';
import {Product, ProductRoute, Route} from 'Shared/Models';
import {getProduct, postProduct, putProduct} from 'Shared/Services';
import {errorMessage} from 'Shared/Utilities/common.util';
import {PRODUCT} from 'Shared/Utilities/validationSchema.util';
import ProductRouteForm from './ProductRouteForm';

const NewOrEditProduct = ({history, location, match, ...rest}) => {
    const action = location.state.action;
    const {requestHandler} = useHttp();
    const notifications = useNotifications();
    const modals = useModals();
    const [initialValue, setInitialValue] = useState({});

    const register = (fieldName) => ({
        id: fieldName,
        value: get(values, fieldName),
        onChange: handleChange,
        error: errorMessage(fieldName, touched, errors)
    });

    useEffect(() => {
        if (action === 'New') {
            const product = new Product();
            setInitialValue(product);
        } else {
            const {params: {id}} = match;
            const params = {include: 'product_routes,product_routes.route,product_routes.route_rate,product_routes.contractor'};
            requestHandler(getProduct(id, params), {loader: true}).then(res => {
                const product = new Product(res.data);
                setInitialValue(product);
            }).catch(e => {
                console.error(e);
                notifications.showNotification({
                    title: 'Error', color: 'red', message: 'Not able to fetch product details. Something went wrong!!'
                });
            });
        }
    }, []);

    const handleAddProductRoute = () => {
        const id = modals.openModal({
            size: 'lg', title: 'Add Product Route', children: (
                <ProductRouteForm
                    data={new ProductRoute()}
                    action="New"
                    onConfirm={(productRoute) => {
                        modals.closeModal(id);
                        const product = new Product(values);
                        product.addProductRoute(productRoute);
                        setValues(product);
                    }}
                />
            )
        });
    };

    const handleAEditProductRoute = (data, index) => {
        const id = modals.openModal({
            size: 'lg', title: 'Edit Product Route', children: (
                <ProductRouteForm
                    data={new ProductRoute(data)}
                    action="Edit"
                    onConfirm={(productRoute) => {
                        modals.closeModal(id);
                        const product = new Product(values);
                        product.updateProductRoute(productRoute, index);
                        setValues(product);
                    }}
                />
            )
        });
    };

    const handleADeleteProductRoute = (index) => {
        const product = new Product(values);
        product.removeProductRoute(index);
        setValues(product);
    };

    const onSubmit = (values) => {
        const payload = {product: values};
        const requestConfig = (action === 'New') ? postProduct(payload) : putProduct(values.id, payload);
        requestHandler(requestConfig, {loader: true}).then(res => {
            notifications.showNotification({
                title: 'Success', color: 'green', message: 'Product has been saved successfully.'
            });
            history.push('/Product');
        }).catch(e => {
            notifications.showNotification({
                title: 'Error', color: 'red', message: 'Not able to save product details. Something went wrong!!'
            });
        });
    };

    const {values, touched, errors, handleChange, handleSubmit, setValues, setFieldValue} = useFormik({
        enableReinitialize: true,
        initialValues: initialValue,
        validationSchema: PRODUCT,
        onSubmit
    });

    return (
        <ContentArea withPaper>
            <form onSubmit={handleSubmit}>
                <Group position="apart" mb="md">
                    <Title order={3}>Product</Title>
                    <Group position="apart">
                        <Button variant="default" onClick={() => history.push('/Product')}>
                            Cancel
                        </Button>
                        <Button leftIcon={<SaveIcon/>} type="submit">
                            {action === 'New' ? 'Save' : 'Update'}
                        </Button>
                    </Group>
                </Group>
                <Divider mb="md" variant="dotted"/>

                <Grid mb="md">
                    <Col span={4}>
                        <TextInput
                            {...register("name")}
                            label="Product name"
                            placeholder="Enter product name"
                            required mr="xl"
                        />
                    </Col>
                    <Col span={4}>
                        <NumberInput
                            {...register("volume")} mr="xl"
                            label="Product volume" placeholder="Enter volume"
                            min={0} onChange={val => setFieldValue("volume", val)}
                        />
                    </Col>
                </Grid>
                <Divider mb="md" variant="dotted"/>

                <Group mb="md" position="apart">
                    <Title order={4}>Product Routes</Title>
                    <Button variant="outline" leftIcon={<AddStopIcon/>} onClick={handleAddProductRoute}>
                        Add Route
                    </Button>
                </Group>

                <ReactTable
                    columns={[
                        {accessor: 'route.route_code', Header: 'Route'},
                        {accessor: 'contractor.name', Header: 'Contractor'},
                        {accessor: 'std_tonnage', Header: 'Tonnage'},
                        {accessor: 'avg_rate', Header: 'Avg. Rate'},
                        {accessor: 'avg_load_weight', Header: 'Avg. Load Weight'},
                        {accessor: 'max_load_weight', Header: 'Max Load Weight'},
                        {
                            accessor: 'id', Header: 'Actions', cellWidth: 100, Cell: ({row}) => <Group spacing="sm">
                                <ActionIcon onClick={() => handleAEditProductRoute(row.original, row.index)}>
                                    <EditIcon size={20}/>
                                </ActionIcon>
                                <ActionIcon color="red" onClick={() => handleADeleteProductRoute(row.index)}>
                                    <DeleteIcon size={20}/>
                                </ActionIcon>
                            </Group>
                        }
                    ]}
                    data={get(values, 'product_routes', []).filter(stop => !stop._destroy)}
                />
            </form>
        </ContentArea>
    );
};

export default NewOrEditProduct;