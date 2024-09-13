import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/login.css'; // Assurez-vous que le chemin est correct

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        console.log('Button clicked');
        try {
            const response = await fetch('http://localhost:8001/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            console.log('Response:', data);

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('role', data.role);

                if (data.role === 'Admin') {
                    navigate('/admin-home');
                } else if (data.role === 'User') {
                    navigate('/user-home');
                } else {
                    console.error('Unexpected role');
                }
            } else {
                console.error('Login failed with status:', response.status);
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    return (
        <div className="login-container">
            <div className="background">
                <h1>Welcome Back!</h1>
            </div>
            <div className="login-form">
                <h1>Login</h1>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mot de passe"
                />
                <button onClick={handleLogin}>Login</button>
            </div>
        </div>
    );
};

export default Login;
