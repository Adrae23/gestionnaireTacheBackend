import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OverdueTasks = () => {
    const [tasks, setTasks] = useState([]);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const handleHome = () => {
        navigate('/admin-home');
    };
    const handleUpdateInfo =()=>{
        navigate('/updateUser');
    }
    const handleCreateTask = () => {
        navigate('/createTask');
    };

    const handleCreateUser = () => {
        navigate('/createUser');
    };

    const handleCalendrier = () => {
        navigate('/calendrier');
    };

    const handleAvcEmpl = () => {
        navigate('/avancementEmpl');
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); // Supprimer le token
        navigate('/', { replace: true }); // Rediriger et empêcher le retour en arrière
    };

    const handleOverdueTasks = async () => {
        if (!token) {
            console.error("No token found in localStorage");
            return;
        }
        try {
            const response = await fetch('http://localhost:8001/api/tasks/overdueTasks', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setTasks(data);
                console.log('Tasks fetched:', data);
            } else {
                console.error('Failed to fetch tasks. Status:', response.status);
            }
        } catch (err) {
            console.error('Error:', err);
        }
    };

    useEffect(() => {
        handleOverdueTasks();
    }, [token]);

    // Fonction pour formater la date
    const formatDate = (dateStr) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateStr).toLocaleDateString(undefined, options);
    };

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
                    <button className="btn btn-warning" id="warning" onClick={handleOverdueTasks}>En retard</button>
                    <button className="btn btn-primary" onClick={handleLogout}>Déconnexion</button>
                </div>
            </nav>

            <div className="content">
                <h2>Liste des tâches des utilisateurs</h2>
                <table className="tasks-table">
                    <thead>
                        <tr>
                            <th>Tâches</th>
                            <th>Date Prévu</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.length > 0 ? (
                            tasks.map((task, index) => (
                                <tr key={index} className="task-row">
                                    <td>{task.task_description}</td>
                                    <td>{formatDate(task.date)}</td> {/* Affichage de la date formatée */}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">Aucune tâche trouvée</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OverdueTasks;
