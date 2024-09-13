import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AvancementEmployee = () => {
    const [userTasks, setUserTasks] = useState([]);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

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
        navigate('/avancementEmployee');
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); // Supprimer le token
        navigate('/', { replace: true }); // Rediriger et empêcher le retour en arrière
    };

    const fetchTasks = async () => {
        if (!token) {
            console.error("No token found in localStorage");
            return;
        }
        try {
            const response = await fetch('http://localhost:8001/api/tasks/allUsers', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setUserTasks(data);
            } else {
                console.error('Failed to fetch tasks. Status:', response.status);
            }
        } catch (err) {
            console.error('Error:', err);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [token]);
    const handleOverdueTasks= ()=>{
        navigate("/overdueTasks")
    }
    const handleUpdateInfo =()=>{
        navigate('/updateUser');
    }
    const handleHome = () => {
        navigate('/admin-home');
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
                    <button className="btn btn-warning" onClick={handleUpdateInfo}>Modifier Ces Infos</button>
                    <button className="btn btn-warning" id="warning"onClick={handleOverdueTasks}>En retard</button>
                    <button className="btn btn-primary" onClick={handleLogout}>Déconnexion</button>
                </div>
            </nav>

            <div className="content">
                <h2>Liste des tâches des utilisateurs</h2>
                <table className="tasks-table">
                    <thead>
                        <tr>
                            <th>Nom d'Utilisateur</th>
                            <th>Tâches Complètes</th>
                            <th>Tâches en Cours</th>
                            <th>Tâches en Retard</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userTasks.length > 0 ? (
                            userTasks.map((user) => (
                                <tr key={user.email} className="task-row">
                                    <td>{user.name}</td>
                                    <td>{user.completed_tasks}</td>
                                    <td>{user.pending_tasks}</td>
                                    <td>{user.overdue_tasks}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">Aucune tâche trouvée</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AvancementEmployee;
