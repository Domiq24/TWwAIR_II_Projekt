import * as React from "react";
import { isExpired } from 'react-jwt';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { AppBar, Box, Toolbar, Typography, Button, Menu, MenuItem, Divider } from "@mui/material";
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ChangePasswordDialog from "./ChangePasswordDialog.tsx";
import DeleteUserDialog from "./DeleteUserDialog.tsx";
import axios from "axios";
import {useEffect} from "react";

interface User {
    userId: string;
    name: string;
    role: string;
}

function Navbar() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [userAction, setUserAction] = React.useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const user: User | null = (token != null ? jwtDecode(token) : null);

    const handleUserClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }

    const handleLogout = () => {
        axios.delete(`http://localhost:3100/user/logout/${user.userId}`, {
            headers: {
                'x-access-token': "Bearer "+token
            }
        }).then(
            localStorage.removeItem('token'),
            navigate('/log-in')
        )
        .catch(error => console.log(error))
        .finally(() => setAnchorEl(null));
    }

    useEffect(() => {
        if(userAction === '')
            setAnchorEl(null);
    }, [userAction]);

    return (
        <>
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
                                    navigate('/users');
                                }}
                            >
                                Users
                            </Button>}
                        </Box>
                    }
                    {token != null && !isExpired(token) && <div>
                        <Button
                            variant='text'
                            size='large'
                            sx={{color: 'white'}}
                            onClick={(e) => handleUserClick(e)}
                        >
                            {user.name}
                        </Button>
                        <Menu
                            open={anchorEl != null}
                            anchorEl={anchorEl}

                            onClose={() => setAnchorEl(null)}
                        >
                            <MenuItem onClick={() => handleLogout()}>Log out</MenuItem>
                            <Divider />
                            <MenuItem onClick={() => setUserAction('changePassword')}>Change Password</MenuItem>
                            <MenuItem sx={{color: 'red'}} onClick={() => setUserAction('deleteUser')}>Delete Account</MenuItem>
                        </Menu>
                    </div>}
                </Toolbar>
            </AppBar>
            <ChangePasswordDialog user={user} userAction={userAction} setUserAction={setUserAction} />
            <DeleteUserDialog user={user} userAction={userAction} setUserAction={setUserAction} logOut={handleLogout} />
        </>
    );
}

export default Navbar;