import {useEffect, useState} from 'react';
import get from 'lodash/get';
import {useFormik} from 'formik';
import {
    ActionIcon,
    Anchor,
    Badge,
    Box,
    Button,
    Checkbox,
    Divider,
    Group,
    List,
    NumberInput,
    Radio,
    RadioGroup,
    ScrollArea,
    Select,
    SimpleGrid,
    Text,
    TextInput,
    Title,
    Tooltip
} from '@mantine/core';
import {useNotifications} from '@mantine/notifications';
import {Dropzone} from '@mantine/dropzone';
import {CalendarIcon} from '@modulz/radix-icons';
import {
    MdCloudUpload as UploadIcon,
    MdOutlineAddLocationAlt as AddStopIcon,
    MdOutlineDelete as DeleteIcon,
    MdOutlineLink as AttachmentIcon,
    MdOutlineSave as SaveIcon,
    MdPerson as DriverIcon
} from 'react-icons/md';
import {FaTruck as TruckIcon} from 'react-icons/fa';

import {AddressSelect, ContentArea, DateTimePicker, ReactTable, RouteMap} from 'Components';
import {useHttp} from 'Hooks';
import {deleteAttachment, getRouteOrder, postAttachment, putRouteOrder, s3Uploader} from 'Shared/Services';
import {Operation} from 'Shared/Models';
import {ROUTE_PLANNER} from 'Shared/Utilities/validationSchema.util';
import {
    errorMessage,
    formatDateTime,
    getAddressLabel,
    getFullName,
    getNumberRoundToOneDecimal,
    registerField
} from 'Shared/Utilities/common.util';
import {POD_STATUS, POD_STATUS_EMPTY_LEG} from 'Shared/Utilities/referenceData.util';
import {renderDateTime, renderDistance, renderTextWithTooltip} from 'Shared/Utilities/tableSchema';

const podStatusList = (isEmptyLeg) => isEmptyLeg ? POD_STATUS_EMPTY_LEG : POD_STATUS;

const slipTypeList = [
    {value: 'loading_slips', label: 'Loading Slips'},
    {value: 'offloading_slips', label: 'Off Loading Slips'},
    {value: 'fuel_slips', label: 'Fuel Slips'},
    {value: 'toll_slips', label: 'Toll Slips'},
    {value: 'truck_wash_slips', label: 'Truck Wash Slips'},
    {value: 'pod_slips', label: 'POD Slips'},
    {value: 'truck_stop_slips', label: 'Truck Stop Slips'}
];

const OperationForm = ({history, match, ...rest}) => {
    const {requestHandler} = useHttp();
    const notifications = useNotifications();
    const [initialValue, setInitialValue] = useState(null);
    const [plannedStoppages, setPlannedStoppages] = useState([]);
    const [slipType, setSlipType] = useState('loading_slips');

    const register = (fieldName) => registerField(fieldName, {values, handleChange, touched, errors});

    useEffect(() => {
        const {params: {id}} = match;
        const params = {
            include: 'member,vehicle,estimated_fuel_location,route_order_stoppages,route_order_stoppages.address,' +
                'route_order_actual_info,route_order_actual_info.route_order_actual_stop_infos,' +
                'route_order_actual_info.route_order_actual_stop_infos.address,' +
                'route_order_actual_info.loading_slips,route_order_actual_info.offloading_slips,' +
                'route_order_actual_info.fuel_slips,route_order_actual_info.toll_slips,' +
                'route_order_actual_info.truck_wash_slips,route_order_actual_info.pod_slips,' +
                'route_order_actual_info.truck_stop_slips'
        };
        requestHandler(getRouteOrder(id, params), {loader: true}).then(res => {
            const initialData = new Operation(res.data);
            setInitialValue(initialData);
            renderPlannedStoppagesOnMap(res.data.route_order_stoppages);
        }).catch(e => {
            notifications.showNotification({
                title: 'Error', color: 'red', message: 'Not able to fetch route order details. Something went wrong!!'
            });
        });
    }, []);

    const renderPlannedStoppagesOnMap = (stoppages) => {
        const activeStoppages = stoppages.filter(stop => !stop._destroy);
        if (activeStoppages.length && activeStoppages.length > 1) {
            setPlannedStoppages(activeStoppages);
        }
    };

    const handleFuelPointChange = (fuelPoint) => {
        const operation = new Operation(values);
        operation.route_order_actual_info.setFuelPoint(fuelPoint);
        setValues(operation);
    };

    const handleTonnageLoadedChange = (tonnage) => {
        const operation = new Operation(values);
        operation.setTonnageLoaded(tonnage);
        setValues(operation);
    };

    const handleRatePerToneChange = (ratePerTone) => {
        const operation = new Operation(values);
        operation.setRatePerTone(ratePerTone);
        setValues(operation);
    };

    const renderUploadedFileList = () => <List listStyleType="none">
        {slipTypeList.map(slip => {
            const files = values.route_order_actual_info[slip.value];
            if (files && files.length) {
                return <List.Item key={slip.value}>
                    {slip.label}
                    <List withPadding icon={<AttachmentIcon/>} center>
                        {files.map(file => <List.Item key={file.id}>
                            <Group position="apart">
                                <Anchor href={file.signed_url}>{file.name} - {file.file_size} bytes</Anchor>
                                <ActionIcon
                                    color="red"
                                    onClick={() => handleFileDelete(slip.value, file.id)}
                                >
                                    <DeleteIcon/>
                                </ActionIcon>
                            </Group>
                        </List.Item>)}
                    </List>
                </List.Item>;
            }
        })}
    </List>;

    const handleDrop = (files) => {
        if (files && files.length) {
            const fileDataPromisesList = [];
            files.forEach(file => {
                const {name, size: file_size, type: content_type} = file;
                const payload = {attachment: {name, content_type, file_size}};
                fileDataPromisesList.push(new Promise((resolve, reject) => {
                    postAttachment(payload).then(res => {
                        const {post_fields} = res.data;
                        let formData = new FormData();
                        Object.keys(post_fields).forEach(key => formData.append(key, post_fields[key]));
                        formData.append('file', files[0]);
                        s3Uploader(formData);
                        resolve(res.data);
                    }).catch(e => reject(payload));
                }));
            });

            Promise.allSettled(fileDataPromisesList).then(results => {
                const fileList = [];
                results.forEach(result => result.status === 'fulfilled' && fileList.push(result.value));
                const o = new Operation(values);
                o.route_order_actual_info[slipType] = [...o.route_order_actual_info[slipType], ...fileList];
                setValues(o);
            });
        }
    };

    const handleFileDelete = (type, id) => {
        deleteAttachment(id).then(res => {
            const o = new Operation(values);
            o.route_order_actual_info[type] = o.route_order_actual_info[type].filter(file => file.id !== id);
            setValues(o);
        }).catch(e => console.error(e));
    };

    const onSubmit = () => {
        requestHandler(putRouteOrder(match.params.id, {route_order: values}), {loader: true}).then(res => {
            notifications.showNotification({
                title: 'Success', color: 'green', message: 'Operation has been saved successfully.'
            });
            history.goBack();
        }).catch(e => {
            notifications.showNotification({
                title: 'Error', color: 'red', message: 'Not able to save operation details. Something went wrong!!'
            });
        });
    };

    const {values, touched, errors, handleChange, handleSubmit, setFieldValue, setValues} = useFormik({
        enableReinitialize: true,
        initialValues: initialValue,
        validationSchema: ROUTE_PLANNER.OPERATION,
        onSubmit
    });

    return (
        <ContentArea withPaper>
            {values && <form onSubmit={handleSubmit}>
                <Group position="apart" mb="md">
                    <Title order={3}>Operation</Title>
                    <Group position="apart">
                        <Button variant="default" onClick={() => history.goBack()}>Cancel</Button>
                        <Button leftIcon={<SaveIcon/>} type="submit">Update</Button>
                    </Group>
                </Group>
                <Divider mb="md" variant="dotted"/>

                <Group mb="md" direction="column">
                    <Group>
                        <Text size="lg" weight={600} mb={0}>
                            Order #: <Text color="blue" inherit component="span">{values.order_number}</Text>
                        </Text>
                        <Tooltip label="Status" withArrow>
                            <Badge variant="filled" radius="lg" color="green">{values.status}</Badge>
                        </Tooltip>

                        <Tooltip label="Truck" withArrow>
                            <Badge variant="filled" radius="lg" color="orange" leftSection={<TruckIcon size={10}/>}>
                                {values.vehicle.name}
                            </Badge>
                        </Tooltip>
                        <Tooltip label="Driver" withArrow>
                            <Badge variant="filled" radius="lg" color="grape" leftSection={<DriverIcon size={10}/>}>
                                {getFullName(values.member.first_name, values.member.last_name)}
                            </Badge>
                        </Tooltip>
                    </Group>
                    <Group>
                        <Group>
                            <Text size="sm" weight={600}>Planned start time:</Text>
                            <Badge
                                radius="sm" color="cyan"
                                leftSection={<CalendarIcon style={{width: 10, height: 10}}/>}
                            >
                                {formatDateTime(values.planned_origin_departure_time)}
                            </Badge>
                        </Group>
                        <Group>
                            <Text size="sm" weight={600}>Planned end time:</Text>
                            <Badge
                                radius="sm" color="red"
                                leftSection={<CalendarIcon style={{width: 10, height: 10}}/>}
                            >
                                {formatDateTime(values.planned_eta_destination)}
                            </Badge>
                        </Group>
                    </Group>
                </Group>
                <Divider mb="md" variant="dotted"/>

                <Box mb="md">
                    <SimpleGrid cols={3} mb="xl">
                        <DateTimePicker
                            {...register("route_order_actual_info.start_time")}
                            icon={<CalendarIcon/>} required
                            label="Actual start time"
                            placeholder="Select actual start time"
                            value={
                                (values.route_order_actual_info && values.route_order_actual_info.start_time) ?
                                    new Date(values.route_order_actual_info?.start_time) : null
                            }
                            onChange={val => setFieldValue("route_order_actual_info.start_time", val)}
                        />
                        <DateTimePicker
                            {...register("route_order_actual_info.end_time")}
                            icon={<CalendarIcon/>} required
                            label="Actual end time"
                            placeholder="Select actual end time"
                            value={
                                (values.route_order_actual_info && values.route_order_actual_info.end_time) ?
                                    new Date(values.route_order_actual_info?.end_time) : null
                            }
                            onChange={val => setFieldValue("route_order_actual_info.end_time", val)}
                        />
                        <NumberInput
                            {...register("route_order_actual_info.distance")}
                            label="Actual distance in KM" min={0}
                            placeholder="Enter actual distance"
                            onChange={val => setFieldValue("route_order_actual_info.distance", val)}
                        />

                        <NumberInput
                            {...register("route_order_actual_info.cycle_time")}
                            label="Actual cycle time in Hours" min={0}
                            placeholder="Enter actual cycle time"
                            onChange={val => setFieldValue("route_order_actual_info.cycle_time", val)}
                        />
                        <NumberInput
                            {...register("route_order_actual_info.fuel_liters_filled")}
                            label="Actual fuel filled in Litres" min={0}
                            placeholder="Enter actual fuel filled"
                            onChange={val => setFieldValue("route_order_actual_info.fuel_liters_filled", val)}
                        />
                        <NumberInput
                            {...register("route_order_actual_info.tonnage_loaded")}
                            label="Actual tonnage loaded" min={0}
                            placeholder="Enter actual tonnage loaded"
                            onChange={handleTonnageLoadedChange}
                        />

                        <AddressSelect
                            {...register("route_order_actual_info.fuel_point_id")}
                            label="Actual fuel point" withIcon required
                            onChange={handleFuelPointChange}
                            error={errorMessage("route_order_actual_info.fuel_point_id", touched, errors)}
                        />
                        <NumberInput
                            {...register("loading_odo_km")}
                            label="Loading KM" min={0}
                            placeholder="Enter loading km"
                            onChange={val => setFieldValue("loading_odo_km", val)}
                        />
                        <NumberInput
                            {...register("offloading_odo_km")}
                            label="Off Loading KM" min={0}
                            placeholder="Enter off loading km"
                            onChange={val => setFieldValue("offloading_odo_km", val)}
                        />

                        <TextInput
                            {...register("route_order_actual_info.delivery_note_number")}
                            label="Delivery note #" placeholder="Enter delivery note #"
                        />
                        <TextInput
                            {...register("route_order_actual_info.pod_number")}
                            label="POD #" placeholder="Enter POD #"
                        />
                        <Select
                            {...register("pod_status")}
                            label="POD status"
                            placeholder="Select POD status"
                            data={podStatusList(values.is_empty_leg)}
                            onChange={val => setFieldValue("pod_status", val)}
                        />

                        <NumberInput
                            {...register("rate_per_tone")}
                            label="Rate" min={0}
                            placeholder="Enter rate"
                            onChange={handleRatePerToneChange}
                        />
                        <NumberInput
                            {...register("actual_amount")}
                            min={0} icon={"R"} disabled
                            label="Actual value" placeholder="Enter actual value"
                            onChange={val => setFieldValue("actual_amount", val)}
                        />
                    </SimpleGrid>
                    <Checkbox
                        label="Is documents received physically from driver?"
                        checked={values.route_order_actual_info.document_recieved}
                        onChange={() => {
                            setFieldValue(
                                'route_order_actual_info.document_recieved',
                                !values.route_order_actual_info.document_recieved
                            )
                        }}
                    />
                </Box>
                <Divider mb="md" variant="dotted"/>

                <Group direction="column" grow spacing="sm" mb="md">
                    <Text size="lg" weight={500}>Slip type</Text>
                    <RadioGroup value={slipType} onChange={setSlipType}>
                        {slipTypeList.map(slip => <Radio key={slip.value} value={slip.value}>
                            {slip.label}
                        </Radio>)}
                    </RadioGroup>
                    <Dropzone radius="md" onDrop={handleDrop}>
                        {(status) => (
                            <div style={{pointerEvents: 'none'}}>
                                <Group position="center"><UploadIcon size={50}/></Group>
                                <Text align="center" weight={700} size="lg">
                                    {status.accepted ? 'Drop slips here' : 'Upload slips'}
                                </Text>
                                <Text align="center" size="sm" mt="xs" color="dimmed">
                                    Drag&apos;n&apos;drop slips here to upload.
                                </Text>
                            </div>
                        )}
                    </Dropzone>
                    {renderUploadedFileList()}
                </Group>
                <Divider mb="md" variant="dotted"/>

                <Group direction="column" grow spacing="sm" mb="md">
                    <Text size="lg" weight={500}>Planned Stoppages</Text>
                    <ScrollArea scrollHideDelay={0} style={{maxHeight: 300}}>
                        <ReactTable
                            columns={[
                                {accessor: 'position', Header: '#', cellWidth: 40},
                                {
                                    accessor: 'address', Header: 'Address',
                                    Cell: ({value}) => renderTextWithTooltip(getAddressLabel(value))
                                },
                                {
                                    accessor: 'distance', Header: 'Distance', align: 'center',
                                    Cell: ({value}) => renderDistance(value)
                                },
                                {
                                    accessor: 'estimated_arrival_time', Header: 'Estimated Arrival',
                                    align: 'center', Cell: ({value}) => renderDateTime(value)
                                },
                                {
                                    accessor: 'estimated_departure_time', Header: 'Estimated Departure',
                                    align: 'center', cellMinWidth: 168, Cell: ({value}) => renderDateTime(value)
                                },
                                {accessor: 'stop_duration', Header: 'Stop duration', align: 'center', cellWidth: 128}
                            ]}
                            data={plannedStoppages}
                        />
                    </ScrollArea>
                </Group>
                <Divider mb="md" variant="dotted"/>

                <SimpleGrid cols={2} mb="md">
                    <Group direction="column" grow spacing="sm">
                        <Text size="lg" weight={500}>Planned Stoppage Map</Text>
                        <Box style={{height: 350}}>
                            <RouteMap id="planned-stoppage-map" activeStoppages={plannedStoppages}/>
                        </Box>
                    </Group>
                    <Group direction="column" grow spacing="sm">
                        <Text size="lg" weight={500}>Actual Stoppage Map</Text>
                        <Box style={{height: 350}}>
                            <RouteMap id="actual-stoppage-map" activeStoppages={plannedStoppages}/>
                        </Box>
                    </Group>
                </SimpleGrid>
                <Divider mb="md" variant="dotted"/>

                <Group direction="column" grow spacing="sm">
                    <Group position="apart">
                        <Text size="lg" weight={500}>Actual Stoppages</Text>
                        <Button variant="outline" leftIcon={<AddStopIcon/>}>
                            Add Stoppage
                        </Button>
                    </Group>
                    <ReactTable
                        columns={[
                            {accessor: 'position', Header: '#', cellWidth: 40},
                            {
                                accessor: 'address', Header: 'Address',
                                Cell: ({value}) => renderTextWithTooltip(getAddressLabel(value))
                            },
                            {
                                accessor: 'distance', Header: 'Distance', align: 'center',
                                Cell: ({value}) => renderDistance(getNumberRoundToOneDecimal(value))
                            },
                            {
                                accessor: 'estimated_arrival_time', Header: 'Estimated Arrival',
                                align: 'center', Cell: ({value}) => renderDateTime(value)
                            },
                            {
                                accessor: 'actual_arrival_time', Header: 'Actual Arrival',
                                align: 'center', Cell: ({value}) => renderDateTime(value)
                            },
                            {accessor: 'stop_duration', Header: 'Stop duration', align: 'center', cellWidth: 128},
                            {accessor: 'note', Header: 'Reason for late', align: 'center'}
                        ]}
                        data={
                            get(values, 'route_order_actual_info.route_order_actual_stop_infos', [])
                                .filter(stop => !stop._destroy)
                        }
                        pagination={get(values, 'route_order_actual_info.route_order_actual_stop_infos', []).length > 10}
                    />
                </Group>
            </form>}
        </ContentArea>
    );
};

export default OperationForm;