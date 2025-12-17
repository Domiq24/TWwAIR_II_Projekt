import { isExpired } from 'react-jwt';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { AppBar, Box, Toolbar, Typography, Button } from "@mui/material";
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import axios from "axios";

interface User {
    userId: string;
    name: string;
    role: string;
}

function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const user: User | null = (token != null ? jwtDecode(token) : null);

    const handleLogout = () => {
        const url = "http://localhost:3100/api/user/logout/"+user.userId;
        console.log(url);

        axios.delete(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
                "Content-Type": "application/json",
                'x-access-token': "Bearer "+token
            }
        }).then(
            localStorage.removeItem('token'),
            navigate('/log-in')
        );
    }

    return (
        <AppBar position="static">
            <Toolbar sx={{ flexGrow: 1, justifyContent: "center", alignItems: "center" }}>
                <Typography
                    variant='h5'
                    component='a'
                    noWrap
                    href='/'
                    sx={{
                        color: 'inherit',
                        display: {xs: 'none', md: 'flex'},
                        alignItems:'center',
                        textDecoration: 'none',
                        fontWeight: 'bold',
                    }}
                >
                    <DirectionsCarIcon sx={{display: {xs: 'none', md: 'flex'}, mr: 1}} />
                    Parking
                </Typography>
                {(token == null || isExpired(token)) &&
                    <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}, marginLeft: '20px'}}>
                        <Button
                            variant='text'
                            size='large'
                            sx={{color: 'white'}}
                            onClick={() => {
                                navigate('/log-in');
                            }}
                        >
                            Log in
                        </Button>
                        <Button
                            variant='text'
                            size='large'
                            sx={{color: 'white'}}
                            onClick={() => {
                                navigate('/sign-up');
                            }}
                        >
                            Sign up
                        </Button>
                    </Box>
                }
                {token != null && !isExpired(token) &&
                    <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}, marginLeft: '20px'}}>
                        <Button
                            variant='text'
                            size='large'
                            sx={{color: 'white'}}
                            onClick={() => {
                                navigate('/dashboard');
                            }}
                        >
                            Dashboard
                        </Button>
                        {user != null && user.role == 'admin' && <Button
                            variant='text'
                            size='large'
                            sx={{color: 'white'}}
                            onClick={() => {
                                navigate('/');
                            }}
                        >
                            Users
                        </Button>}
                    </Box>
                }
                {token != null && !isExpired(token) && <Button
                    variant='text'
                    size='large'
                    sx={{color: 'white'}}
                    onClick={() => handleLogout()}
                >
                    Log out
                </Button>}
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;