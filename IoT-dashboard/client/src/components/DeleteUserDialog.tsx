import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import {type ChangeEvent, type FormEvent, useState} from "react";
import axios from "axios";

interface User {
    userId: string;
    name: string;
    role: string;
}

function DeleteUserDialog({user, userAction, setUserAction, logOut}: {user: User, userAction: string, setUserAction: (action: string) => void, logOut: () => void}) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const token = localStorage.getItem('token');

    const deleteUser = async () => {
        axios.delete(`http://localhost:3100/user/${user.userId}`, {
            headers: {
                'x-access-token': "Bearer "+token
            }
        }).then((res) => {
            if (res.status === 200)
            {
                setUserAction('');
                logOut();
            }
        })
        .catch((error) => {
            console.log(error);
            setError(error.response.data.error);
        })
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        axios.post('http://localhost:3100/user/auth', {
            name: user.name,
            password: password
        })
        .then((response) => {
            if (response?.status === 200)
                deleteUser();
        })
        .catch((error) => {
            console.log(error);
            setError(error.response.data.error);
        });
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
        setPassword(event.target.value);
        setError('');
    }

    return (
        <Dialog
            open={userAction === 'deleteUser'}
            onClose={() => setUserAction('')}
        >
            <DialogTitle>Delete this account?</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <TextField
                        type="password"
                        label="Password"
                        value={password}
                        error={Boolean(error)}
                        helperText={error}
                        onChange={(e) => handleChange(e)}
                        variant='standard'
                        fullWidth
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <Button type='submit' variant='contained' color='error'>Delete</Button>
                    <Button variant='text' onClick={() => setUserAction('')}>Cancel</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default DeleteUserDialog;