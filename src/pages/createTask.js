import React, { useState, useEffect, useCallback } from 'react';
import '../css/adminHome.css'; // Assurez-vous que le chemin est correct
import '../css/createTask.css';
import { useNavigate } from 'react-router-dom';

const CreateTask = () => {
    const navigate = useNavigate();
    const [task_description, setTaskDescription] = useState('');
    const [status, setStatus] = useState('');
    const [date, setDate] = useState('');
    const token = localStorage.getItem('token'); // Récupérer le token

    const handleHome = () => {
        navigate('/admin-home');
    };
    const handleCalendrier = () =>{
        navigate('/calendrier')
    }
   const handleCreateUser = () => {
        navigate('/createUser'); // Redirige vers la page de création de tâche
    };
    const handleAvcEmpl = () => {
        navigate('/avancementEmpl');
    };
    const handleOverdueTasks= ()=>{
        navigate("/overdueTasks")
    };
    const handleUpdateInfo =()=>{
        navigate('/updateUser');
    }
    const handleLogout = () => {
        localStorage.removeItem('token'); // Supprimer le token
        navigate('/', { replace: true }); // Rediriger et empêcher le retour en arrière
    };

    const handleCreateTask = useCallback(async () => {
        console.log('Creating task...');

        if (!token) {
            console.error('No token found in localStorage');
            return;
        }

        try {
            const response = await fetch('http://localhost:8001/api/tasks/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Inclure le token dans les headers
                },
                body: JSON.stringify({
                    task_description,
                    status,
                    date
                })
            });

            if (response.ok) {
                alert('Tâche créée avec succès!');
                navigate('/calendrier');
            } else {
                console.error('Échec de la création de la tâche. Status:', response.status);
            }
        } catch (err) {
            console.error('Erreur:', err);
        }
    }, [task_description, status, date, token, navigate]);

    useEffect(() => {
        // Utiliser useEffect pour d'autres effets secondaires si nécessaire
    }, []);

    return (
        <div className="container">
            <nav className="navbar">
            <h1 onClick={handleHome}>Mes Tâches</h1>
                <div className="nav-links">
                <button className="btn btn-primary" onClick={handleCreateTask}>Nouvelle Tâche</button>
                    <button className="btn btn-primary" onClick={handleCalendrier}>Calendrier</button>
                    <button className="btn btn-primary" onClick={handleCreateUser}>Nouveau Utilisateur</button>
                    <button className="btn btn-primary" onClick={handleAvcEmpl}>Avancement Empl</button>
                    <button className="btn btn-primary" onClick={handleUpdateInfo}>Modifier Ces Infos</button>
                    <button className="btn btn-warning" id="warning"onClick={handleOverdueTasks}>En retard</button>
                    <button className="btn btn-primary" onClick={handleLogout}>Déconnexion</button>
                </div>
            </nav>
            <div className="content">
                <div className="Task-form">
                    <h1>Créer une nouvelle tâche</h1>
                    <label htmlFor="task_description">Tache(description en detail)</label>
                    <input
                        type="text"
                        value={task_description}
                        onChange={(e) => setTaskDescription(e.target.value)}
                        placeholder="description de tache"
                    />
                    <label htmlFor="status">Status</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="status-select"
                    >
                        <option value="completed">Completée</option>
                        <option value="pending">En cours</option>
                    </select>
                    <label htmlFor="date">Date</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        placeholder="date de fin de tache"
                    />                   
                    <button onClick={handleCreateTask}>Enregistrer</button>
                </div>
            </div>
        </div>
    );
};

export default CreateTask;
