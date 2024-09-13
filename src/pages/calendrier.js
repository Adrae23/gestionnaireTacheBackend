import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const Calendrier = () => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [status, setStatus] = useState("");
    const token = localStorage.getItem('token');

    const handleHome = () => {
        navigate('/admin-home');
    };
    const handleAvcEmpl = () => {
        navigate('/avancementEmpl');
    };
    const handleUpdateInfo =()=>{
        navigate('/updateUser');
    }

    const handleCreateTask = () => {
        navigate('/createTask');
    };
   const handleCreateUser = () => {
        navigate('/createUser'); // Redirige vers la page de création de tâche
    };

    const handleCalendrier = useCallback(async () => {
        if (!token) {
            console.error("No token found in localStorage");
            return;
        }
        try {
            const response = await fetch('http://localhost:8001/api/tasks/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Inclure le token dans les headers
                }
            });
            if (response.ok) {
                const data = await response.json();
                setTasks(data);
                console.log('Tasks fetched:', data); // Debug
            } else {
                console.error('Failed to fetch tasks. Status:', response.status);
            }
        } catch (err) {
            console.error('Error:', err);
        }
    }, [token]);

    useEffect(() => {
        handleCalendrier();
    }, [handleCalendrier]);

    const handleDelete = async (taskId) => {
        console.log('Deleting task with ID:', taskId); // Debug
        if (!token) {
            console.error("No token found in localStorage");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8001/api/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                console.log('Task deleted successfully');
                handleCalendrier(); // Refresh the task list
            } else {
                console.error('Failed to delete task. Status:', response.status);
            }
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const handleUpdate = async () => {
        console.log('Updating task with ID:', editingTaskId, 'to status:', status); // Debug
        if (!editingTaskId || !status) {
            console.error("Task ID or status is missing");
            return;
        }
    
        if (!token) {
            console.error("No token found in localStorage");
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:8001/api/tasks/${editingTaskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });
            
            if (response.ok) {
                console.log('Task updated successfully');
                handleCalendrier(); // Refresh the task list
                setEditingTaskId(null);
                setStatus("");
            } else {
                console.error('Failed to update task. Status:', response.status);
            }
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const handleEditClick = (taskId, currentStatus) => {
        console.log('Edit clicked for task ID:', taskId); // Debug
        setEditingTaskId(taskId);
        setStatus(currentStatus);
    };
    const handleOverdueTasks= ()=>{
        navigate("/overdueTasks")
    }
    const handleLogout = () => {
        localStorage.removeItem('token'); // Supprimer le token
        navigate('/', { replace: true }); // Rediriger et empêcher le retour en arrière
    };
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
                    <button className="btn btn-warning" onClick={handleUpdateInfo}>Modifier Ces Infos</button>
                    <button className="btn btn-warning" id="warning"onClick={handleOverdueTasks}>En retard</button>
                    <button className="btn btn-primary" onClick={handleLogout}>Déconnexion</button>
                </div>
            </nav>
            <div className="content">
                <h2>Liste des tâches </h2>
                <table className="tasks-table">
                    <thead>
                        <tr>
                            <th>Tâche</th>
                            <th>Statut</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.length > 0 ? (
                            tasks.map((task) => (
                                <tr key={task.id} className="task-row">
                                    <td>{task.task_description}</td>
                                    <td>{task.status}</td>
                                    <td>{formatDate(task.date)}</td>
                                    <td>
                                        <button onClick={() => handleEditClick(task.id, task.status)} className="btn btn-primary">Modifier</button>
                                        <button onClick={() => handleDelete(task.id)} className="btn btn-danger">Supprimer</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3">Aucune tâche trouvée</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {editingTaskId && (
                    <div className="edit-task">
                        <h3>Modifier le statut</h3>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="status-select"
                        >
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                            <option value="rejected">Rejected</option>
                        </select>
                        <button onClick={handleUpdate} className="btn btn-success">Enregistrer</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Calendrier;
