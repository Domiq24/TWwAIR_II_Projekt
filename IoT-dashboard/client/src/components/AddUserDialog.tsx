import * as React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, InputLabel, Select, MenuItem, FormControlLabel, Checkbox, Button } from '@mui/material';
import axios from "axios";

interface User {
    name: string;
    email: string;
    password: string;
    repeatPassword: string;
    role: string;
    isActive: boolean;
}

interface Errors {
    name?: string;
    email?: string;
    password?: string;
    repeatPassword?: string;
}

function AddUserDialog({open, setOpen}: {open: boolean, setOpen: (open: boolean) => void}) {
    const [errors, setErrors] = React.useState<Errors>({});
    const [user, setUser] = React.useState<User>({
        name: "",
        email: "",
        password: "",
        repeatPassword: "",
        role: "user",
        isActive: true,
    });

    const validate = () => {
        const valErrors: Errors = {}

        if (!user.name) { valErrors.name = 'Login required'; }
        if (!user.email) { valErrors.email = 'Email is required'; }
        if (!user.password ) { valErrors.password = 'Password is required'; }
        if (!user.repeatPassword) { valErrors.repeatPassword = 'Repeat password'; }
        else if (user.repeatPassword !== user.password) { valErrors.repeatPassword = 'Must match Password'; }

        return Object.values(valErrors).length > 0 ? valErrors : null;
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const valErrors = validate();
        if(valErrors != null)
        {
            setErrors(valErrors);
            return;
        }

        axios.post('http://localhost:3100/user', {
            name: user.name,
            email: user.email,
            password: user.password
        })
        .then(() => handleClose())
        .catch((error) => console.log(error))
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setUser((prev) => ({ ...prev, [name]: value }));
    }

    const handleCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUser((prev) => ({ ...prev, isActive: event.target.checked }));
    }

    const handleClose = () => {
        setOpen(false);
        setUser({
            name: "",
            email: "",
            password: "",
            repeatPassword: "",
            role: "user",
            isActive: true,
        });
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
        >
            <DialogTitle>Add User</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <TextField label='Name' name='name' value={user.name} onChange={handleChange} error={Boolean(errors.name)} helperText={errors.name} sx={{marginTop: '20px'}} variant='standard' required fullWidth />
                    <TextField label='E-mail' name='email' type='email' value={user.email} onChange={handleChange} error={Boolean(errors.email)} helperText={errors.email} sx={{marginTop: '20px'}} variant='standard' required fullWidth />
                    <TextField label='Password' name='password' type='password' value={user.password} onChange={handleChange} error={Boolean(errors.password)} helperText={errors.password} sx={{marginTop: '20px'}} variant='standard' required fullWidth />
                    <TextField label='Repeat Password' name='repeatPassword' type='password' value={user.repeatPassword} onChange={handleChange} error={Boolean(errors.repeatPassword)} helperText={errors.repeatPassword} sx={{marginTop: '20px'}} variant='standard' required fullWidth />
                    <InputLabel id='add-user-role-select' sx={{fontSize: 'small', marginTop: '20px'}}>Role</InputLabel>
                    <Select
                        labelId='add-user-role-select'
                        name='role'
                        variant='standard'
                        value={user.role}
                        onChange={handleChange}
                        fullWidth
                    >
                        <MenuItem value='user'>user</MenuItem>
                        <MenuItem value='service'>service</MenuItem>
                        <MenuItem value='admin'>admin</MenuItem>
                    </Select>
                    <FormControlLabel
                        label='Active'
                        sx={{marginTop: '20px'}}
                        control={<Checkbox
                            name='isActive'
                            checked={user.isActive}
                            onChange={handleCheckbox}
                        />}
                    />
                </DialogContent>
                <DialogActions>
                    <Button type="submit" variant="contained">Add</Button>
                    <Button variant="text" onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default AddUserDialog;