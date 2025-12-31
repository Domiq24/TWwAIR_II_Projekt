import {useState, useEffect, type ChangeEvent, type FormEvent} from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography, InputLabel, Select, MenuItem, FormControlLabel, Checkbox } from '@mui/material';
import axios from "axios";

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
}

function EditUserDialog({adminAction, setAdminAction, user, all, setAll}: {adminAction: string, setAdminAction: (action: string) => void, user: User | null, all: User[], setAll: (users: User[]) => void}) {
    const [password, setPassword] = useState("");
    const [updateUser, setUpdateUser] = useState<User>({
        _id: "",
        name: "",
        email: "",
        role: "",
        isActive: false,
    });

    const clear = () => {
        setPassword("");
        setAdminAction('');
    }

    const handleUpdateUser = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        axios.post("http://localhost:3100/user", updateUser, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "x-access-token": localStorage.getItem("token"),
            }
        })
        .then(() => clear())
        .catch(error => console.log(error));
    }

    const handleUpdatePassword = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        axios.post("http://localhost:3100/user/change-password/admin", {
            name: updateUser.name,
            newPassword: password,
        }, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "x-access-token": localStorage.getItem("token"),
            }
        })
        .then(() => clear())
        .catch(error => console.log(error));
    }

    const handleDelete = () => {
        axios.delete(`http://localhost:3100/user/${updateUser._id}`, {
            headers: {
                'x-access-token': localStorage.getItem("token")
            }
        })
        .then(() => {
            clear();
            setAll(all.filter((u: User) => u._id != updateUser._id));
        })
        .catch(error => console.log(error));
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setUpdateUser((prevState) => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleCheckbox = (event: ChangeEvent<HTMLInputElement>) => {
        setUpdateUser((prevState) => ({
            ...prevState,
            isActive: event.target.checked
        }));
    }

    const handlePassword = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value as string);
    }

    useEffect(() => {
        if(user != null)
            setUpdateUser(user);
    }, [user]);

    return (
        <>
            <Dialog
                open={adminAction === 'edit'}
                onClose={() => clear()}
            >
                <DialogTitle>Edit</DialogTitle>
                <form onSubmit={handleUpdateUser}>
                    <DialogContent>
                        <Typography>Id: {updateUser?._id}</Typography>
                        <TextField label='Name' value={updateUser?.name} name='name' onChange={handleChange} variant='standard' required fullWidth sx={{marginTop: '20px'}} />
                        <TextField label='E-mail' value={updateUser?.email} name='email' onChange={handleChange} variant='standard' required fullWidth sx={{marginTop: '20px'}} />
                        <InputLabel sx={{fontSize: 'small', marginTop: '20px'}} id='edit-user-role-select'>Role</InputLabel>
                        <Select
                            labelId='edit-user-role-select'
                            name='role'
                            variant='standard'
                            value={updateUser?.role}
                            onChange={handleChange}
                            fullWidth
                        >
                            <MenuItem value="user" >user</MenuItem>
                            <MenuItem value="service" >service</MenuItem>
                            <MenuItem value="admin" >admin</MenuItem>
                        </Select>
                        <FormControlLabel
                            label='Active'
                            sx={{marginTop: '20px'}}
                            control={
                            <Checkbox
                                name='isActive'
                                checked={updateUser?.isActive}
                                onChange={handleCheckbox}
                            />}
                        />
                    </DialogContent>
                    <DialogActions sx={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Button disabled={updateUser == user} type='submit' variant='contained'>Update</Button>
                        <Button variant='text' onClick={() => clear()}>Cancel</Button>
                    </DialogActions>
                </form>
            </Dialog>
            <Dialog
                open={adminAction === 'password'}
                onClose={() => clear()}
            >
                <DialogTitle>Change Password</DialogTitle>
                <form onSubmit={handleUpdatePassword}>
                    <DialogContent>
                        <TextField label='New password' value={password} onChange={handlePassword} variant='standard' required fullWidth />
                    </DialogContent>
                    <DialogActions>
                        <Button disabled={password === ''} type="submit" variant='contained'>Update</Button>
                        <Button variant='text' onClick={() => clear()}>Cancel</Button>
                    </DialogActions>
                </form>
            </Dialog>
            <Dialog
                open={adminAction === 'delete'}
                onClose={() => clear()}
            >
                <DialogTitle>Delete user?</DialogTitle>
                <DialogActions>
                    <Button variant='contained' color='error' onClick={handleDelete} >Delete</Button>
                    <Button variant='text' onClick={() => clear()} >Cancel</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default EditUserDialog;