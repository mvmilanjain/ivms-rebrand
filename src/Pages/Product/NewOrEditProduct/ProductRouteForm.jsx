import get from 'lodash/get';
import {useFormik} from 'formik';
import {Button, Group, NumberInput, Grid, Col, SimpleGrid} from '@mantine/core';
import {NotificationsProvider} from '@mantine/notifications';

import {ContractorDropdown, RouteDropdown} from 'Components';
import {ProductRoute} from 'Shared/Models';
import {PRODUCT_ROUTE} from 'Shared/Utilities/validationSchema.util';
import {errorMessage} from 'Shared/Utilities/common.util';

const ProductRouteForm = ({data, action, onConfirm}) => {

    const register = (fieldName) => ({
        id: fieldName,
        value: get(values, fieldName),
        onChange: handleChange,
        error: errorMessage(fieldName, touched, errors)
    });

    const handleRouteChange = (route) => {
        const productRoute = new ProductRoute(values);
        productRoute.setRoute(route);
        setValues(productRoute);
    };

    const handleContractorChange = (contractor) => {
        const productRoute = new ProductRoute(values);
        productRoute.setContractor(contractor);
        setValues(productRoute);
    };

    const {values, touched, errors, handleChange, handleSubmit, setValues, setFieldValue} = useFormik({
        initialValues: data,
        validationSchema: PRODUCT_ROUTE,
        onSubmit: onConfirm
    });

    return (
        <NotificationsProvider position="top-center">
            <form onSubmit={handleSubmit}>
                <SimpleGrid cols={2} mb="md">
                    <RouteDropdown
                        {...register("route")} withIcon required
                        label="Route" onChange={handleRouteChange}
                        error={errorMessage("route_id", touched, errors)}
                    />
                    <ContractorDropdown
                        {...register("contractor")} withIcon required
                        label="Contractor" onChange={handleContractorChange}
                        error={errorMessage("contractor_id", touched, errors)}
                    />
                    <NumberInput
                        {...register("std_tonnage")} required
                        label="Tonnage" placeholder="Enter tonnage"
                        onChange={val => setFieldValue("std_tonnage", val)}
                        error={errorMessage("std_tonnage", touched, errors)}
                    />
                    <NumberInput
                        {...register("avg_rate")} required
                        label="Average rate" placeholder="Enter average rate"
                        onChange={val => setFieldValue("avg_rate", val)}
                        error={errorMessage("avg_rate", touched, errors)}
                    />
                    <NumberInput
                        {...register("avg_load_weight")} required
                        label="Average load weight" placeholder="Enter average load weight"
                        onChange={val => setFieldValue("avg_load_weight", val)}
                        error={errorMessage("avg_load_weight", touched, errors)}
                    />
                    <NumberInput
                        {...register("max_load_weight")} required
                        label="Max load weight" placeholder="Enter max load weight"
                        onChange={val => setFieldValue("max_load_weight", val)}
                        error={errorMessage("max_load_weight", touched, errors)}
                    />
                    <NumberInput
                        {...register("route_rate.count_in_hand")} required
                        label="Count in hand" placeholder="Enter count"
                        onChange={val => setFieldValue("route_rate.count_in_hand", val)}
                        error={errorMessage("route_rate.count_in_hand", touched, errors)}
                    />
                    <NumberInput
                        {...register("route_rate.rate_per_tone")} required
                        label="Rate per tone" placeholder="Enter rate"
                        onChange={val => setFieldValue("route_rate.rate_per_tone", val)}
                        error={errorMessage("route_rate.rate_per_tone", touched, errors)}
                    />
                    <NumberInput
                        {...register("route_rate.avg_tonnage")} required
                        label="Average tonnage" placeholder="Enter average tonnage"
                        onChange={val => setFieldValue("route_rate.avg_tonnage", val)}
                        error={errorMessage("route_rate.avg_tonnage", touched, errors)}
                    />
                </SimpleGrid>
                <Group position="right">
                    <Button type="submit">{action === 'New' ? 'Add Product Route' : 'Update Product Route'}</Button>
                </Group>
            </form>
        </NotificationsProvider>
    );
};

export default ProductRouteForm;