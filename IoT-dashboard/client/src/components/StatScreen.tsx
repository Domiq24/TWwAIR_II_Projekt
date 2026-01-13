import { useState, useEffect } from "react";
import { Paper, Tabs, Tab, Box, AppBar } from '@mui/material';
import ParkingUtilChart from "./ParkingUtilChart.tsx";
import SpaceUtilChart from "./SpaceUtilChart.tsx";

function StatScreen() {
    const [tab, setTab] = useState(0);

    const TabPanel = ({children, value, index}) => {
        return (
            <div
                role="tabpanel"
                hidden={value !== index}
            >
                {value === index && <Box
                    sx={{margin: '20px', color: 'white'}}
                >
                    {children}
                </Box>}
            </div>
        );
    }

    return (
        <Paper sx={{width: '80%', marginTop: '40px', backgroundColor: '#171717'}}>
            <AppBar position="static" sx={{backgroundColor: '#373737'}}>
                <Tabs
                    value={tab}
                    onChange={(e, v) => setTab(v)}
                    variant="standard"
                >
                    <Tab value={0} label="Parking utilization"  sx={{color: 'white'}} />
                    <Tab value={1} label="Space utilization" sx={{color: 'white'}} />
                </Tabs>
            </AppBar>
            <TabPanel value={tab} index={0} >
                <ParkingUtilChart />
            </TabPanel>
            <TabPanel value={tab} index={1} >
                <SpaceUtilChart />
            </TabPanel>
        </Paper>
    )
}

export default StatScreen;