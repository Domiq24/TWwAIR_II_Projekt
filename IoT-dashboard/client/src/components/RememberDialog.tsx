import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button } from '@mui/material';

function RememberDialog({name, setName, setRemembered}: {name: string, setName: (name: string) => void, setRemembered: (name: string) => void}) {
    return (
        <Dialog open={name != ''} onClose={() => setName('')} sx={{'& .MuiPaper-root': {background: '#373737', color: 'white'}}}>
            <DialogTitle>Remember this space?</DialogTitle>
            <DialogContent>
                <Typography variant='h2' sx={{textAlign: 'center'}}>{name}</Typography>
            </DialogContent>
            <DialogActions sx={{justifyContent: 'space-between', alignItems: 'center'}}>
                <Button variant='contained' onClick={() => { setRemembered(name); setName(''); }}>Remember</Button>
                <Button variant='contained' color='error' onClick={() => setName('')}>Cancel</Button>
            </DialogActions>
        </Dialog>
    )
}

export default RememberDialog;