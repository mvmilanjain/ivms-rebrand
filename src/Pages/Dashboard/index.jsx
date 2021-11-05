import {Col, Grid, Paper, Title} from "@mantine/core";

const Dashboard = (props) => {

    return (
        <Paper padding="md" withBorder sx={() => ({height: '100%'})}>
            <Grid style={{height: '100%'}}>
                <Col span={12} sx={t => ({paddingBottom: t.spacing.lg})}>
                    <Title order={2} color="red">Dashboard</Title>
                </Col>

                <Col span={12} style={{height: 'calc(100% - 48px)'}}/>
            </Grid>

        </Paper>
    );
};

export default Dashboard;