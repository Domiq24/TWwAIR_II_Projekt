import { Paper, Box, TextField, Button } from '@mui/material'
import {useNavigate} from 'react-router-dom'
import {type ChangeEvent, type FormEvent, useState} from "react";
import axios from "axios";

interface Account {
    login: string;
    password: string;
}

interface Errors {
    login?: string;
    password?: string;
}

function LoginScreen() {
    const [account, setAccount] = useState<Account>({
        login: '',
        password: ''
    });
    const [errors, setErrors] = useState<Errors>({});
    const navigate = useNavigate();

    const validate = () => {
        const valErrors: Errors = {}

        if (!account.login) { valErrors.login = 'Login required'; }
        if (!account.password) { valErrors.password = 'Password is required'; }

        return Object.values(valErrors).length > 0 ? valErrors : null;
    }

    const handleChangeRoute = (token: string) => {
        localStorage.setItem('token', token);
        navigate('/dashboard', {replace: true});
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const valErrors = validate();
        if(valErrors != null)
        {
            setErrors(valErrors);
            return;
        }

        axios.post('http://localhost:3100/user/auth', {
            name: account.login,
            password: account.password
        })
        .then((response) => handleChangeRoute(response.data.token))
        .catch((error) => {
            console.log(error);
            setErrors({password: error.response.data.error});
        } )
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
                    <TextField label='Password' value={account.password} name='password' error={Boolean(errors.password)} helperText={errors.password} type='password' onChange={handleChange} variant='standard' required fullWidth sx={{marginBottom: '20px'}} />
                </Box>
                <Box>
                    <Button type='submit' variant="contained" size='large'>Log in</Button>
                    <Button variant="text" size='large' onClick={() => navigate('/sign-up')}>Sign up</Button>
                </Box>
            </form>

        </Paper>
    );
}

export default LoginScreen;