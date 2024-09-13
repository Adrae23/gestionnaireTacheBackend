import React, { useState, useEffect, useCallback } from 'react';
import '../css/adminHome.css'; // Assurez-vous que le chemin est correct
import '../css/createTask.css';
import { useNavigate } from 'react-router-dom';

const UpdateInfo = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const token = localStorage.getItem('token'); // Récupérer le token

    const handleHome = () => {
        navigate('/admin-home');
    };
    const handleCreateTask = () => {
        navigate('/createTask');
    };

    const handleUpdateUser = useCallback(async () => {
        console.log('Creating task...');

        if (!token) {
            console.error('No token found in localStorage');
            return;
        }

        try {
            const response = await fetch('http://localhost:8001/api/users/', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Inclure le token dans les headers
                },
                body: JSON.stringify({ name, email, password })
            });

            if (response.ok) {
                alert('User updated successfully!');
                navigate('./admin-home');
            } else {
                console.error('Failed to update user. Status:', response.status);
            }
        } catch (err) {
            console.error('Error:', err);
        }
    }, [name, email, password, token, navigate]);

    useEffect(() => {
        // Utiliser useEffect pour d'autres effets secondaires si nécessaire
    }, []);
    const handleLogout = () => {
        localStorage.removeItem('token'); // Supprimer le token
        navigate('/', { replace: true }); // Rediriger et empêcher le retour en arrière
    };
    const handleCreateUser = () => {
        navigate('/createUser'); // Redirige vers la page de création de tâche
    };
    const handleCalendrier = () =>{
        navigate('/calendrier')
    }
    const handleAvcEmpl = () => {
        navigate('/avancementEmpl');
    };
    const handleOverdueTasks= ()=>{
        navigate("/overdueTasks")
    }
    return (
        <div className="container">
            <nav className="navbar">
            <h1 onClick={handleHome}>Mes Tâches</h1>
                <div className="nav-links">
                <button className="btn btn-primary" onClick={handleCreateTask}>Nouvelle Tâche</button>
                    <button className="btn btn-primary" onClick={handleCalendrier}>Calendrier</button>
                    <button className="btn btn-primary" onClick={handleCreateUser}>Nouveau Utilisateur</button>
                    <button className="btn btn-primary" onClick={handleAvcEmpl}>Avancement Empl</button>
                    <button className="btn btn-primary" onClick={handleUpdateUser}>Modifier Ces Infos</button>
                    <button className="btn btn-warning" id="warning"onClick={handleOverdueTasks}>En retard</button>
                    <button className="btn btn-primary" onClick={handleLogout}>Déconnexion</button>
                </div>
            </nav>
            <div className="content">
                <div className="Task-form">
                    <h1>Créer une nouveau utilisateur</h1>
                    <label htmlFor="name">Nom</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nom"
                    />
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                    />
                    <label htmlFor="password">Mot de passe</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mot de passe"
                    />
                
                    <button onClick={handleUpdateUser}>Enregistrer</button>
                </div>
            </div>
        </div>
    );
};

export default UpdateInfo;
