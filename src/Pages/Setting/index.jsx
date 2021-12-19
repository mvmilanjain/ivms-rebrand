import {useState} from 'react';
import {Tabs} from '@mantine/core';
import {PersonIcon, MixerVerticalIcon as ConfigIcon} from '@modulz/radix-icons';

import {ContentArea} from 'Components';
import Profile from './Profile';
import Configuration from './Configuration';

const Setting = ({history}) => {
    const [tabIndex, setTabIndex] = useState(0);
    const [initialTabIndex] = useState(0);

    return (
        <ContentArea>
            <Tabs tabPadding="md" onTabChange={setTabIndex} tabIndex={tabIndex} initialTab={initialTabIndex}>
                <Tabs.Tab label="Profile" icon={<PersonIcon/>}>
                    {tabIndex === 0 && <Profile/>}
                </Tabs.Tab>
                <Tabs.Tab label="Configuration" icon={<ConfigIcon/>}>
                    {tabIndex === 1 && <Configuration/>}
                </Tabs.Tab>
            </Tabs>
        </ContentArea>
    );
};

export default Setting;