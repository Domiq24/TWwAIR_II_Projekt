import { Card, CardContent, Typography, Button } from '@mui/material'

function RememberedSpace({remembered, setRemembered}: {remembered: string, setRemembered: (name: string) => void}) {
    return (
        <Card elevation={3} sx={{padding: '16px', backgroundColor: '#373737', color: 'white'}}>
            <CardContent>
                <Typography variant='h4'>
                    Your car is at:
                </Typography>
                <Typography variant='h1' sx={{padding: '16px'}}>
                    {remembered}
                </Typography>
            </CardContent>
            <Button
                variant="contained"
                fullWidth={true}
                onClick={() => setRemembered('')}
            >Forget</Button>
        </Card>
    );
}

export default RememberedSpace;