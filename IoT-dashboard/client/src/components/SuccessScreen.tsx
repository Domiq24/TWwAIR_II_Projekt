import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Paper, Typography, Button, Box } from '@mui/material';

const SuccessScreen = () => {
    const [searchParams] = useSearchParams();
    const spotName = searchParams.get('spotName');
    const navigate = useNavigate();
    const [status, setStatus] = useState("Weryfikacja płatności...");

    useEffect(() => {
        if (spotName) {
        
            fetch('http://localhost:3100/parking/payment-success', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ spotName: spotName })
            })
            .then(res => {
                if(res.ok) {
                    setStatus(`Płatność udana! Miejsce ${spotName} zostało zwolnione.`);
                } else {
                    setStatus("Płatność przyjęta, ale wystąpił błąd przy zwalnianiu miejsca.");
                }
            })
            .catch(err => {
                console.error(err);
                setStatus("Błąd połączenia z serwerem.");
            });
        }
    }, [spotName]);

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#222' }}>
            <Paper sx={{ padding: '40px', textAlign: 'center', backgroundColor: '#333', color: 'white' }}>
                <Typography variant="h4" gutterBottom>✅ Dziękujemy!</Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>{status}</Typography>
                <Button variant="contained" color="primary" onClick={() => navigate('/')}>
                    Wróć do parkingu
                </Button>
            </Paper>
        </Box>
    );
};

export default SuccessScreen;