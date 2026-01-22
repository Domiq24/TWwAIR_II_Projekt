import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, CircularProgress } from '@mui/material';
import { useState } from 'react';


function RememberDialog({name, setName, setRemembered}: {name: string, setName: (name: string) => void, setRemembered: (name: string) => void}) {
    
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        setLoading(true);
        try {
            
            const response = await fetch('http://localhost:3100/parking/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    spotName: name, 
                    price: 5 
                }),
            });

            const data = await response.json();

            if (data.url) {
                
                window.location.href = data.url;
            } else {
                alert("Nie udało się wygenerować linku do płatności.");
            }
        } catch (error) {
            console.error("Błąd płatności:", error);
            alert("Błąd połączenia z serwerem.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog 
            open={name !== ''} 
            onClose={() => setName('')} 
            sx={{'& .MuiPaper-root': {background: '#373737', color: 'white', minWidth: '300px'}}}
        >
            <DialogTitle sx={{textAlign: 'center'}}>
                Opłata za miejsce
            </DialogTitle>
            
            <DialogContent>
                <Typography variant='h2' sx={{textAlign: 'center', fontWeight: 'bold', my: 2}}>
                    {name}
                </Typography>
                <Typography variant='body1' sx={{textAlign: 'center', color: '#ccc'}}>
                    Koszt postoju: 5.00 PLN
                </Typography>
            </DialogContent>

            <DialogActions sx={{justifyContent: 'space-between', padding: '20px'}}>
                <Button 
                    variant='contained' 
                    color='success' 
                    onClick={handlePayment}
                    disabled={loading}
                    sx={{fontWeight: 'bold'}}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "ZAPŁAĆ I WYJEDŹ"}
                </Button>

                <Button 
                    variant='outlined' 
                    color='error' 
                    onClick={() => setName('')}
                    disabled={loading}
                >
                    Anuluj
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default RememberDialog;