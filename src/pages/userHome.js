import React, { useState, useEffect, useCallback, useNavigate} from 'react';
import '../css/adminHome.css'; // Assurez-vous que le chemin est correct

const UserHome = () => {
    const [tasks, setAllTasks] = useState([]);
    const [tasksPerDay, setTasksPerDay] = useState([]); // Tâches du jour
    const [status, setStatus] = useState("");
    const [editingTaskId, setEditingTaskId] = useState(null);
    const token = localStorage.getItem('token');
    const [progress, setProgress] = useState(0); // État pour le pourcentage de progression

    const navigate = useNavigate();

    const handleCreateTask = () => {
        navigate('/createTask'); // Redirige vers la page de création de tâche
    };

    const handleCalendrier = () =>{
        navigate('/calendrier')
    }
    const handleOverdueTasks = () => {
        navigate('/overdueTasks');
    };

    // Fonction pour récupérer les tâches du jour
    const getlistPerDay = useCallback(async () => {
        console.log('Fetching tasks of the day...');
        if (!token) {
            console.error("No token found in localStorage");
            return;
        }

        try {
            const response = await fetch('http://localhost:8001/api/tasks/day', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setTasksPerDay(data); // Mettre à jour les tâches du jour
                console.log('Tasks fetched for the day:', data);
            } else {
                console.error('Failed to fetch tasks. Status:', response.status);
            }
        } catch (err) {
            console.error('Error:', err);
        }
    }, [token]);

    // Fonction pour récupérer toutes les tâches et calculer la progression
    const getlist = useCallback(async () => {
        console.log('Fetching all tasks...');
        if (!token) {
            console.error("No token found in localStorage");
            return;
        }

        try {
            const response = await fetch('http://localhost:8001/api/tasks/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setAllTasks(data); // Mettre à jour toutes les tâches
                calculateProgress(data); // Calculer l'avancement
                console.log('All tasks fetched:', data);
            } else {
                console.error('Failed to fetch tasks. Status:', response.status);
            }
        } catch (err) {
            console.error('Error:', err);
        }
    }, [token]);



    useEffect(() => {
        getlistPerDay(); // Récupérer les tâches du jour
        getlist(); // Récupérer toutes les tâches pour l'avancement
    }, [getlistPerDay, getlist]);


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
                getlistPerDay();
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
                getlistPerDay();
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
    // Fonction pour calculer l'avancement en fonction des tâches complétées
    const calculateProgress = (tasks) => {
        const completedTasks = tasks.filter(task => task.status === "completed").length;
        const totalTasks = tasks.length;
        const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        setProgress(progressPercentage.toFixed(0)); // Mettre à jour l'état de la progression
    };
    const handleLogout = () => {
        localStorage.removeItem('token'); // Supprimer le token
        navigate('/', { replace: true }); // Rediriger et empêcher le retour en arrière
    };

    return (
        <div className="container">
            <nav className="navbar">
                <h1>Mes Tasks</h1>
                <div className="nav-links">
                    <button className="btn btn-primary" onClick={handleCreateTask}>Nouvelle Tâche</button>
                    <button className="btn btn-primary" onClick={handleCalendrier}>Calendrier</button>
                    <button className="btn btn-warning" id="warning" onClick={handleOverdueTasks}>En retard</button>
                    <button className="btn btn-primary" onClick={handleLogout}>Déconnexion</button>
                </div>
            </nav>

            {/* Affichage des tâches du jour */}
            <div className="content">
                <h2>Liste des tâches du jour</h2>
                <table className="tasks-table">
                    <thead>
                        <tr>
                            <th>Tâche</th>
                            <th>Statut</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasksPerDay.length > 0 ? (
                            tasksPerDay.map((task) => (
                                <tr key={task.id} className="task-row">
                                    <td>{task.task_description}</td>
                                    <td>{task.status}</td>
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

            {/* Affichage de l'avancement global */}
            <h2>Mon Avancement Global</h2>
            <div className="progress-container">
                <div className="progress-bar" style={{ width: `${progress}%` }}>
                    {progress}% complété
                </div>
            </div>
        </div>
    );
};

export default UserHome;
