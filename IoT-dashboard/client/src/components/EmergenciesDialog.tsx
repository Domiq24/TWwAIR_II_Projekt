import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'

function EmergenciesDialog({open, setOpen, emergencies}: {open: boolean, setOpen: (open: boolean) => void, emergencies: string[]}) {
    return(
        <Dialog open={open} onClose={() => setOpen(false)} >
            <DialogTitle>Emergencies</DialogTitle>
            <DialogContent>
                {emergencies.map((emergency) => {
                    return <Typography variant='h6' sx={{textAlign: 'center'}}>{emergency}</Typography>
                })}
            </DialogContent>
            <DialogActions sx={{justifyContent: 'center'}}>
                <Button variant='contained' color='error' onClick={() => setOpen(false)} >Close</Button>
            </DialogActions>
        </Dialog>
    );
}

export default EmergenciesDialog;