import {Button, Group, Title} from "@mantine/core";
import {MdOutlineCloudDownload as ExportIcon} from "react-icons/md";

const Operation = (props) => {
    return (
        <>
            <Group position="apart" mb="md">
                <Title order={2} color="red">Operation</Title>
                <Button leftIcon={<ExportIcon/>} variant="default">Export</Button>
            </Group>
            <div style={{height: 'calc(100% - 60px)'}}/>
        </>
    );
};

export default Operation;