import {type ChangeEvent, type FormEvent, useState} from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material'
import axios from "axios";

interface User {
    userId: string;
    name: string;
    role: string;
}

interface PasswordChange {
    oldPassword: string;
    newPassword: string;
    repeatPassword: string;
}

interface Errors {
    oldPassword?: string;
    newPassword?: string;
    repeatPassword?: string;
}

function ChangePasswordDialog({user, userAction, setUserAction}: {user: User, userAction: string, setUserAction: (action: string) => void}) {
    const [passwordCh, setPasswordCh] = useState<PasswordChange>({
        oldPassword: "",
        newPassword: "",
        repeatPassword: "",
    });
    const [errors, setErrors] = useState<Errors>({});

    const validate = () => {
        const valErrors: Errors = {}

        if (!passwordCh.oldPassword) { valErrors.oldPassword = 'Old Password required'; }
        if (!passwordCh.newPassword) { valErrors.newPassword = 'New Password required'; }
        if (!passwordCh.repeatPassword) { valErrors.repeatPassword = 'Repeat New Password required'; }
        else if (passwordCh.newPassword != passwordCh.repeatPassword) { valErrors.repeatPassword = 'New Password must match'; }

        return Object.values(valErrors).length > 0 ? valErrors : null;
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const valErrors = validate();
        if(valErrors != null)
        {
            setErrors(valErrors);
            return;
        }

        axios.post(`http://localhost:3100/user/change-password/${user.userId}`, {
            name: user.name,
            oldPassword: passwordCh.oldPassword,
            newPassword: passwordCh.newPassword
        }, {
            headers: {
                Accept: "application/json",
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token')
            }
        })
        .then(() => setUserAction(''))
        .catch((error: Error) => console.log(error))
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setPasswordCh((prevPasswordCh) => ({
            ...prevPasswordCh,
            [name]: value
        }));
    }

    return (
        <Dialog
            open={userAction === 'changePassword'}
            onClose={() => setUserAction('')}
        >
            <DialogTitle>Change Password</DialogTitle>
            <form onSubmit={(e) => handleSubmit(e)}>
                <DialogContent>
                    <TextField
                        label="Old Password"
                        name="oldPassword"
                        value={passwordCh.oldPassword}
                        onChange={handleChange}
                        error={Boolean(errors.oldPassword)}
                        helperText={errors.oldPassword}
                        variant="standard"
                        type='password'
                        required
                        fullWidth
                    />
                    <TextField
                        label="New Password"
                        name="newPassword"
                        value={passwordCh.newPassword}
                        onChange={handleChange}
                        error={Boolean(errors.newPassword)}
                        helperText={errors.newPassword}
                        variant="standard"
                        required
                        fullWidth
                    />
                    <TextField
                        label="Repeat New Password"
                        name="repeatPassword"
                        value={passwordCh.repeatPassword}
                        onChange={handleChange}
                        error={Boolean(errors.repeatPassword)}
                        helperText={errors.repeatPassword}
                        variant="standard"
                        required
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant='contained' type="submit">Change</Button>
                    <Button variant='text' onClick={() => setUserAction('')}>Cancel</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default ChangePasswordDialog;