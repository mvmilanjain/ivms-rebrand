import {useState} from 'react';
import {ActionIcon, Anchor, Group, List, Radio, RadioGroup, SimpleGrid, Text} from '@mantine/core';
import {Dropzone} from '@mantine/dropzone';
import {
    MdCloudUpload as UploadIcon,
    MdOutlineDelete as DeleteIcon,
    MdOutlineLink as AttachmentIcon
} from 'react-icons/md';

import {deleteAttachment, postAttachment, s3Uploader} from 'Shared/Services';
import {Operation} from 'Shared/Models';

const slipTypeList = [
    {value: 'loading_slips', label: 'Loading Slips'},
    {value: 'offloading_slips', label: 'Off Loading Slips'},
    {value: 'fuel_slips', label: 'Fuel Slips'},
    {value: 'toll_slips', label: 'Toll Slips'},
    {value: 'truck_wash_slips', label: 'Truck Wash Slips'},
    {value: 'pod_slips', label: 'POD Slips'},
    {value: 'truck_stop_slips', label: 'Truck Stop Slips'}
];

const UploadOperationSlips = ({data, onChange}) => {
    const [slipType, setSlipType] = useState('loading_slips');

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
                const o = new Operation(data);
                o.route_order_actual_info[slipType] = [...o.route_order_actual_info[slipType], ...fileList];
                typeof onChange === 'function' && onChange(o);
            });
        }
    };

    const handleFileDelete = (type, id) => {
        deleteAttachment(id).then(res => {
            const o = new Operation(data);
            o.route_order_actual_info[type] = o.route_order_actual_info[type].filter(file => file.id !== id);
            typeof onChange === 'function' && onChange(o);
        }).catch(e => console.error(e));
    };

    return (
        <Group direction="column" grow spacing="sm" mb="md">
            <Text size="lg" weight={500}>Slip type</Text>
            <RadioGroup value={slipType} onChange={setSlipType}>
                {slipTypeList.map(slip => <Radio key={slip.value} value={slip.value}>{slip.label}</Radio>)}
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
            <SimpleGrid cols={2}>
                {slipTypeList.map(slip => {
                    const files = data.route_order_actual_info[slip.value];
                    if (files && files.length) {
                        return <Group key={slip.value} direction="column" spacing={4}>
                            <Text size="lg" weight={600}>{slip.label}</Text>
                            <List withPadding icon={<AttachmentIcon/>} center>
                                {files.map(file => <List.Item key={file.id}>
                                    <Group>
                                        <Anchor href={file.signed_url}>{file.name} - {file.file_size} bytes</Anchor>
                                        <ActionIcon color="red" onClick={() => handleFileDelete(slip.value, file.id)}>
                                            <DeleteIcon/>
                                        </ActionIcon>
                                    </Group>
                                </List.Item>)}
                            </List>
                        </Group>;
                    }
                })}
            </SimpleGrid>
        </Group>
    );
};

export default UploadOperationSlips;