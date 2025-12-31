import { Paper, Box, TextField, Button } from '@mui/material'
import {type ChangeEvent, type FormEvent, useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Account {
    login: string;
    email: string;
    password: string;
    repeatPassword: string;
}

interface Errors {
    login?: string;
    email?: string;
    password?: string;
    repeatPassword?: string;
}

function SignUpScreen() {
    const [account, setAccount] = useState<Account>({
        login: '',
        email: '',
        password: '',
        repeatPassword: ''
    });
    const [errors, setErrors] = useState<Errors>({});
    const navigate = useNavigate();

    const validate = () => {
        const valErrors: Errors = {}

        if (!account.login) { valErrors.login = 'Login required'; }
        if (!account.email) { valErrors.email = 'Email is required'; }
        if (!account.password ) { valErrors.password = 'Password is required'; }
        if (!account.repeatPassword) { valErrors.repeatPassword = 'Repeat password'; }
        else if (account.repeatPassword !== account.password) { valErrors.repeatPassword = 'Must match Password'; }

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

        axios.post('http://localhost:3100/user', {
            name: account.login,
            email: account.email,
            password: account.password
        })
        .then(() => navigate('/log-in'))
        .catch((error) => {
            console.log(error)
            setErrors({repeatPassword: error.response.data.error});
        });
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setAccount((prevAccount) => ({
            ...prevAccount,
            [name]: value
        }));
    }

    return (
        <Paper elevation={3} sx={{margin: '48px', padding: '24px', width: '20%', textAlign: 'left'}}>
            <form onSubmit={handleSubmit}>
                <Box sx={{width: '100%'}}>
                    <TextField label='Login' value={account.login} name='login' error={Boolean(errors.login)} helperText={errors.login} onChange={handleChange} variant='standard' required fullWidth sx={{marginBottom: '20px'}} />
                    <TextField label='E-mail' value={account.email} name='email' error={Boolean(errors.email)} helperText={errors.email} type='email' onChange={handleChange} variant='standard' required fullWidth sx={{marginBottom: '20px'}} />
                    <TextField label='Password' value={account.password} name='password' error={Boolean(errors.password)} helperText={errors.password} type='password' onChange={handleChange} variant='standard' required fullWidth sx={{marginBottom: '20px'}} />
                    <TextField label='Repeat Password' value={account.repeatPassword} name='repeatPassword' error={Boolean(errors.repeatPassword)} type='password' helperText={errors.repeatPassword} onChange={handleChange} variant='standard' required fullWidth sx={{marginBottom: '20px'}} />
                </Box>
                <Box>
                    <Button type='submit' variant="contained" size='large'>Sign up</Button>
                </Box>
            </form>
        </Paper>
    );
}

export default SignUpScreen;