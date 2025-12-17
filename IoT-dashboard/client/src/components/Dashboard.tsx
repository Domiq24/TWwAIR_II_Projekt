import { useState, useEffect } from "react";
import { Paper, Typography } from "@mui/material";
import io from "socket.io-client";
import ParkingMap from "./ParkingMap.tsx";
import RememberedSpace from "./RememberedSpace.tsx";
import RememberDialog from "./RememberDialog.tsx";
import {jwtDecode} from "jwt-decode";
import SpaceStateDialog from "./SpaceStateDialog.tsx";
import EmergenciesDialog from "./EmergenciesDialog.tsx";

interface ParkingSpace {
    name: string,
    state: string
}

function Dashboard() {
    const [isLoading, setIsLoading] = useState(true);
    const [parkingState, setParkingState] = useState({});
    const [remembered, setRemembered] = useState('');
    const [name, setName] = useState('');
    const [emergencies, setEmergencies] = useState([]);
    const [openEmergencies, setOpenEmergencies] = useState(false);

    const user = jwtDecode(localStorage.getItem("token"));

    useEffect(() => {
        fetch("http://localhost:3000/parking", {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': ' application/json',
                'x-access-token': localStorage.getItem('token')
            }
        })
        .then((res) => res.json())
        .then((data: ParkingSpace[]) => {
            const dict: {[name: string]: string} = data.reduce((acc: {[name: string]: string}, item) => {
                acc[item.name] = item.state;
                return acc;
            }, {});
            setParkingState(dict);
        })
        .catch((error) => console.log(error))
        .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        setOpenEmergencies(emergencies.length > 0);
    }, [emergencies]);

    const socket = io("http://localhost:3000");
    socket.on("updateSpace", (data: ParkingSpace) => {
        setParkingState({...parkingState, [data.name]: data.state});

        if (data.state === "emergency")
            setEmergencies([...emergencies, data.name]);
        else {
            const remEmergency = emergencies.findIndex(data.name);
            if(remEmergency >= 0)
                setEmergencies(emergencies.splice(remEmergency, 1));
        }
    })

    return (
        <>
            <Paper  elevation={3} variant='elevation' sx={{width: '40%', margin: '40px', padding: '20px', backgroundColor: '#171717', color: 'white', borderRadius: '10px'}}>
                <Typography variant='h2'>Welcome to our parking!</Typography>
                <Typography variant='h3' sx={{marginTop: '30px'}}>Free spaces: {Object.entries(parkingState).filter(([, value]) => { return value === "free" }).length}/{Object.entries(parkingState).length}</Typography>
            </Paper>
            {(!isLoading && remembered === '') ?
                <ParkingMap spaces={parkingState} setName={setName} /> :
                <RememberedSpace remembered={remembered} setRemembered={setRemembered} />
            }
            {user.role != "user" ?
                <SpaceStateDialog name={name} setName={setName} state={parkingState[name]}  /> :
                <RememberDialog name={name} setName={setName} setRemembered={setRemembered} />
            }
            {user.role != "user" && <EmergenciesDialog open={openEmergencies} setOpen={setOpenEmergencies} emergencies={emergencies} />}
        </>
    )
}

export default Dashboard;