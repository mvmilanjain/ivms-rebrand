import {Modal, Text, Group, Button} from '@mantine/core';

export const ConfirmModal = (
    {
        id = 'confirm_modal',
        title = 'Please confirm your action',
        opened = false,
        onCancel,
        onConfirm
    }
) => {

    const handleCancel = (e) => {
        onCancel();
    };

    const handleConfirm = (e) => {
        onConfirm();
    };

    return (
        <Modal
            id={id}
            opened={opened}
            hideCloseButton
            onClose={handleCancel}
            styles={{inner: {alignItems: 'center'}
        }}>
            <Text size="lg" weight="bold">{title}</Text>

            <Group position="right" mt="xl">
                <Button onClick={handleCancel} color="red">Cancel</Button>
                <Button onClick={handleConfirm}>Confirm</Button>
            </Group>
        </Modal>
    );
};