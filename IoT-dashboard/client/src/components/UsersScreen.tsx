import * as React from 'react';
import {
    Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Button, Menu, MenuItem, Divider,
    getListItemSecondaryActionClassesUtilityClass
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import io from 'socket.io-client';
import axios from 'axios';
import EditUserDialog from "./EditUserDialog.tsx";
import AddUserDialog from "./AddUserDialog.tsx";

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
}

function UsersScreen() {
    const [users, setUsers] = React.useState<User[]>([]);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [adminAction, setAdminAction] = React.useState('');
    const [updateUser, setUpdateUser] = React.useState<User | null>(null);
    const [addUser, setAddUser] = React.useState(false);

    const socket = io("http://localhost:3000");
    socket.on('updateUser', (user: User) => {
        let isNew = true;
        const newUsers = users.map((u: User) => {
            if (u._id === user._id)
            {
                isNew = false;
                return user;
            } else
                return u;
        });
        setUsers(isNew ? [...users, user] : newUsers);
    });

    React.useEffect(() => {
        axios.get('http://localhost:3100/user/', {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then((res) => {
            setUsers(res.data);
        })
        .catch(error => console.log(error));
    }, []);

    React.useEffect(() => {
        if(adminAction === '')
            setAnchorEl(null);
    }, [adminAction]);

    const handleMenu = (e: React.MouseEvent<HTMLButtonElement>, user: User) =>
    {
        setAnchorEl(e.currentTarget);
        setUpdateUser(user);
    }

    return(
        <>
            <Paper sx={{width: '80%', marginTop: '40px', padding: '20px', paddingTop: 0, backgroundColor: '#171717'}}>
                <TableContainer sx={{margin: 'auto'}}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align='left' sx={{color: 'white'}}>Id:</TableCell>
                                <TableCell align='left' sx={{color: 'white'}}>Name:</TableCell>
                                <TableCell align='left' sx={{color: 'white'}}>E-mail:</TableCell>
                                <TableCell align='left' sx={{color: 'white'}}>Role:</TableCell>
                                <TableCell align='left' sx={{color: 'white'}}>State:</TableCell>
                                <TableCell align='right'></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => {
                                return(
                                    <TableRow>
                                        <TableCell align='left' sx={{color: 'white'}}>{user._id}</TableCell>
                                        <TableCell align='left' sx={{color: 'white'}}>{user.name}</TableCell>
                                        <TableCell align='left' sx={{color: 'white'}}>{user.email}</TableCell>
                                        <TableCell align='left' sx={{color: 'white'}}>{user.role}</TableCell>
                                        <TableCell align='left' sx={{color: 'white'}}>{user.isActive ? "Active" : "Disabled"}</TableCell>
                                        <TableCell align='right' sx={{color: 'white'}}>
                                            <Button onClick={(e) => handleMenu(e, user)}>
                                                <MoreVertIcon fontSize='small' sx={{color: 'white'}} />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Button sx={{color: 'white', marginTop: '20px'}} onClick={() => setAddUser(true)} startIcon={<AddIcon/>}>Add</Button>
            </Paper>
            <Menu
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
            >
                <MenuItem onClick={() => setAdminAction('edit')} >Edit User</MenuItem>
                <MenuItem onClick={() => setAdminAction('password')} >Reset Password</MenuItem>
                <Divider />
                <MenuItem sx={{color: 'red'}} onClick={() => setAdminAction('delete')} >Delete User</MenuItem>
            </Menu>
            <EditUserDialog adminAction={adminAction} setAdminAction={setAdminAction} user={updateUser} all={users} setAll={setUsers} />
            <AddUserDialog open={addUser} setOpen={setAddUser} />
        </>
    )
}

export default UsersScreen;