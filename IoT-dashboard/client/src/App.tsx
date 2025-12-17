import './App.css'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { isExpired } from "react-jwt";
import Dashboard from "./components/Dashboard.tsx";
import LoginScreen from "./components/LoginScreen.tsx";
import SignUpScreen from "./components/SignUpScreen.tsx";
import Navbar from "./components/Navbar.tsx";

function App() {
    const token = localStorage.getItem('token');

    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={(token == null || isExpired(token)) ? <Navigate replace to={'log-in'} /> : <Navigate replace to={'/dashboard'} />} />
                <Route path="/log-in" element={<LoginScreen />} />
                <Route path="/sign-up" element={<SignUpScreen />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
