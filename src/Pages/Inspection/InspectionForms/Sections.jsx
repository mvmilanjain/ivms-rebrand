import {useEffect} from 'react';
import {Button, Divider, Group, Spoiler, Text, Title} from '@mantine/core';
import {useSetState} from '@mantine/hooks';
import {useNotifications} from '@mantine/notifications';
import {MdArrowBack as BackIcon, MdOutlineAddBox as CreateIcon} from 'react-icons/md';

import {ContentArea} from 'Components';
import {useHttp} from 'Hooks';
import {getInspectionForm} from 'Shared/Services';
import {InspectionForm} from 'Shared/Models';

const Sections = ({history, match}) => {
    const {requestHandler} = useHttp();
    const notifications = useNotifications();
    const [state, setState] = useSetState({data: null})

    useEffect(() => {
        const {params: {id}} = match;
        const params = {include: 'inspection_form_sections,inspection_form_sections.form_section_fields'};
        requestHandler(getInspectionForm(id, params), {loader: true}).then(res => {
            setState({data: new InspectionForm(res.data)});
        }).catch(e => {
            notifications.showNotification({
                title: 'Error', color: 'red', message: 'Not able to fetch section details. Something went wrong!!'
            });
        });
    }, []);

    return (
        <>
            {state.data && <ContentArea withPaper>
                <Group position="apart" mb="md">
                    <Title order={3}>Manage Sections</Title>
                    <Group position="apart">
                        <Button leftIcon={<BackIcon/>} variant="default" onClick={() => history.push('/inspection/0')}>
                            Back
                        </Button>
                        <Button leftIcon={<CreateIcon/>} type="submit">Create Section</Button>
                    </Group>
                </Group>
                <Divider mb="md" variant="dotted"/>

                <Group mb="md" direction="column">
                    <Text size="lg" weight={600} mb={0}>
                        Form #: <Text color="blue" inherit component="span">{state.data.name}</Text>
                    </Text>
                    <Spoiler hideLabel="Hide" showLabel="Show more" maxHeight={80}>
                        {state.data.description}
                    </Spoiler>
                </Group>
                <Divider mb="md" variant="dotted"/>
            </ContentArea>}
        </>
    );
};

export default Sections;