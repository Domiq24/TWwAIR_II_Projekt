import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Select, MenuItem } from '@mui/material'
import { useState, useEffect } from "react";
import axios from "axios";

function SpaceStateDialog({name, setName, state}: {name: string, setName: (name: string) => void, state: string}) {
    const [newState, setNewState] = useState('')

    const handleChangeState = () => {
        axios.post(`http://localhost:3100/parking/${name}`, {
            air: {
                name: name,
                state: newState
            }
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token')
            }
        })
        .catch(error => console.log(error));
        setName('');
    }

    useEffect(() => {
        setNewState(state);
    }, [state]);

    return (
        <Dialog open={name != ''} onClose={() => setName('')} sx={{'& .MuiPaper-root': {background: '#373737', color: 'white'}}}>
            <DialogTitle>Space {name}</DialogTitle>
            <DialogContent sx={{'& .MuiSelect-root': {flex: 1}}}>
                <Typography variant='h6' sx={{flex: 1}}>Space state:</Typography>
                <Select value={newState} sx={{flex: 1, color: 'white'}} onChange={(e) => setNewState(e.target.value)}>
                    <MenuItem value='free'>Free</MenuItem>
                    <MenuItem value='occupied'>Occupied</MenuItem>
                    <MenuItem value='emergency'>Emergency</MenuItem>
                </Select>
            </DialogContent>
            <DialogActions sx={{justifyContent: 'space-between'}}>
                <Button variant='contained' disabled={newState == state} onClick={() => handleChangeState()}>Set state</Button>
                <Button variant='contained' color='error' onClick={() => setName('')} >Close</Button>
            </DialogActions>
        </Dialog>
    )
}

export default SpaceStateDialog;