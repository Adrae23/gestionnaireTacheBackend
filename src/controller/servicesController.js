const jwt = require('jsonwebtoken');
const secretKey = 'votreCléSecrète'; // Utilisez une clé secrète pour signer les tokens.
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "0000",  // Assurez-vous que le mot de passe est correct
    database: "gestionTache"
});
connection.connect((err) => {
    if (err) {
        console.log("Erreur de connexion à MySQL:", err);
    } else {
        console.log("Connexion réussie à MySQL.");
    }
});
exports.getdashboard = (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]; // Récupération du token depuis les headers
    if (!token) {
        return res.status(401).send("No token provided");
    }

    // Décodage du token pour obtenir l'email
    let email;
    try {
        const decoded = jwt.verify(token, secretKey); // Utilisez la même clé secrète pour vérifier le token
        email = decoded.email;
    } catch (err) {
        return res.status(401).send("Invalid token");
    }

    const getDashboardInfoQuery = `
    SELECT 
        (SELECT COUNT(*) FROM tasks WHERE user_email = ? AND status = 'completed') AS completed_tasks,
        (SELECT COUNT(*) FROM tasks WHERE user_email = ? AND status = 'pending') AS pending_tasks
    FROM dual
`;
    connection.query(getDashboardInfoQuery, [email,email], (err, result) => {
        if (err) {
            console.error("Error while selecting dashboard info:", err);
            res.status(500).send("Error while selecting dashboard info");
        } else if (result.length === 0) {
            res.status(404).send("dashboard info not found");
        } else {
            res.status(200).json(result); // Renvoie l'utilisateur trouvé en JSON
        }
    });
};
exports.getdashboardPreferences = (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]; // Récupération du token depuis les headers
    if (!token) {
        return res.status(401).send("No token provided");
    }

    // Décodage du token pour obtenir l'email
    let email;
    try {
        const decoded = jwt.verify(token, secretKey); // Utilisez la même clé secrète pour vérifier le token
        email = decoded.email;
    } catch (err) {
        return res.status(401).send("Invalid token");
    }

    const getDashboardInfoQuery = `
    SELECT * FROM dashboard_preferences WHERE user_email = ?
`;
    connection.query(getDashboardInfoQuery, [email], (err, result) => {
        if (err) {
            console.error("Error while selecting dashboard preferences:", err);
            res.status(500).send("Error while selecting dashboard info");
        } else if (result.length === 0) {
            res.status(404).send("dashboard info not found");
        } else {
            res.status(200).json(result); // Renvoie l'utilisateur trouvé en JSON
        }
    });
};
exports.gettasks = (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]; // Récupération du token depuis les headers
    if (!token) {
        return res.status(401).send("No token provided");
    }

    // Décodage du token pour obtenir l'email
    let email;
    try {
        const decoded = jwt.verify(token, secretKey); // Utilisez la même clé secrète pour vérifier le token
        email = decoded.email;
    } catch (err) {
        return res.status(401).send("Invalid token");
    }

    const getDashboardInfoQuery = `
    SELECT * FROM tasks WHERE user_email = ?
`;
    connection.query(getDashboardInfoQuery, [email], (err, result) => {
        if (err) {
            console.error("Error while selecting tasks:", err);
            res.status(500).send("Error while selecting tasks");
        } else if (result.length === 0) {
            res.status(404).send("tasks info not found");
        } else {
            res.status(200).json(result); // Renvoie l'utilisateur trouvé en JSON
        }
    });
};
exports.getTasksAndUsers = (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]; // Récupération du token depuis les headers
    if (!token) {
        return res.status(401).send("No token provided");
    }

    // Décodage du token pour obtenir l'email
    let email;
    try {
        const decoded = jwt.verify(token, secretKey); // Utilisez la même clé secrète pour vérifier le token
        email = decoded.email;
    } catch (err) {
        return res.status(401).send("Invalid token");
    }

    const getDashboardInfoQuery = `
        SELECT 
            u.name, 
            u.email,
            COUNT(CASE WHEN t.status = 'completed' THEN 1 END) AS completed_tasks,
            COUNT(CASE WHEN t.status = 'pending' THEN 1 END) AS pending_tasks,
            COUNT(CASE WHEN t.date < NOW() THEN 1 END) AS overdue_tasks
        FROM user u
        LEFT JOIN tasks t ON u.email = t.user_email
        GROUP BY u.name, u.email
    `;
    
    connection.query(getDashboardInfoQuery, (err, result) => {
        if (err) {
            console.error("Error while selecting tasks:", err);
            return res.status(500).send("Error while selecting tasks");
        } else if (result.length === 0) {
            return res.status(404).send("Tasks info not found");
        } else {
            return res.status(200).json(result);
        }
    });
};
exports.overdueTasks = (req,res)=>{
    const token = req.headers.authorization?.split(" ")[1]; // Récupération du token depuis les headers
    if (!token) {
        return res.status(401).send("No token provided");
    }

    // Décodage du token pour obtenir l'email
    let email;
    try {
        const decoded = jwt.verify(token, secretKey); // Utilisez la même clé secrète pour vérifier le token
        email = decoded.email;
    } catch (err) {
        return res.status(401).send("Invalid token");
    }

    const getOverduerQuery = `
        SELECT 
            task_description,
            date
        FROM tasks t
        WHERE user_email=?
    `;
    
    connection.query(getOverduerQuery, [email], (err, result) => {
        if (err) {
            console.error("Error while selecting tasks:", err);
            return res.status(500).send("Error while selecting tasks");
        } else if (result.length === 0) {
            return res.status(404).send("Tasks info not found");
        } else {
            return res.status(200).json(result);
        }
    });
};

exports.gettasksPerDay = (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]; // Récupération du token depuis les headers
    if (!token) {
        return res.status(401).send("No token provided");
    }

    // Décodage du token pour obtenir l'email
    let email;
    try {
        const decoded = jwt.verify(token, secretKey); // Utilisez la même clé secrète pour vérifier le token
        email = decoded.email;
    } catch (err) {
        return res.status(401).send("Invalid token");
    }

    const getDashboardInfoQuery = `
    SELECT * FROM tasks WHERE user_email = ? AND date = ?
`;
    connection.query(getDashboardInfoQuery, [email,new Date().toISOString().slice(0, 10)], (err, result) => {
        if (err) {
            console.error("Error while selecting tasks:", err);
            res.status(500).send("Error while selecting tasks");
        } else if (result.length === 0) {
            res.status(404).send("tasks info not found");
        } else {
            res.status(200).json(result); // Renvoie l'utilisateur trouvé en JSON
        }
    });
};
exports.createtask = (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]; // Récupération du token depuis les headers
    if (!token) {
        return res.status(401).send("No token provided");
    }

    // Décodage du token pour obtenir l'email
    let email;
    try {
        const decoded = jwt.verify(token, secretKey); // Utilisez la même clé secrète pour vérifier le token
        email = decoded.email;
    } catch (err) {
        return res.status(401).send("Invalid token");
    }
    const {task_description, status,date} = req.body;
    const createTaskQuery = `INSERT INTO tasks(user_email,task_description , status,date) VALUES(?,?,?,?)`;
    connection.query(createTaskQuery, [email, task_description, status, date ], (err, result) => {
        if (err) {
            console.error("Error while creating tasks:", err);
            res.status(500).send("Error while creating tasks");
        } else if (result.length === 0) {
            res.status(404).send("Error while creating tasks");
        } else {
            res.status(200).json(result); // Renvoie l'utilisateur trouvé en JSON
        }
    });
};
exports.updatetask = (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]; // Récupération du token depuis les headers
    if (!token) {
        return res.status(401).send("No token provided");
    }

    // Décodage du token pour obtenir l'email
    let email;
    try {
        const decoded = jwt.verify(token, secretKey); // Utilisez la même clé secrète pour vérifier le token
        email = decoded.email;
    } catch (err) {
        return res.status(401).send("Invalid token");
    }
    const taskId = req.params.taskid;
    const {status} = req.body;
    const updateTaskQuery = `UPDATE tasks SET status = ? WHERE id = ?`;
    connection.query(updateTaskQuery, [status, taskId], (err, result) => {
        if (err) {
            console.error("Error while creating tasks:", err);
            res.status(500).send("Error while creating tasks");
        } else if (result.length === 0) {
            res.status(404).send("Error while creating tasks");
        } else {
            res.status(200).json(result); // Renvoie l'utilisateur trouvé en JSON
        }
    });
};
exports.deletetask = (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]; // Récupération du token depuis les headers
    if (!token) {
        return res.status(401).send("No token provided");
    }

    // Décodage du token pour obtenir l'email
    let email;
    try {
        const decoded = jwt.verify(token, secretKey); // Utilisez la même clé secrète pour vérifier le token
        email = decoded.email;
    } catch (err) {
        return res.status(401).send("Invalid token");
    }
    const taskId = req.params.taskid;
    const deleteTaskQuery = `DELETE FROM tasks WHERE id = ?`;
    connection.query(deleteTaskQuery, [taskId], (err, result) => {
        if (err) {
            console.error("Error while deleting tasks:", err);
            res.status(500).send("Error while deleting tasks");
        } else if (result.length === 0) {
            res.status(404).send("Error while deleting tasks");
        } else {
            res.status(200).json(result); // Renvoie l'utilisateur trouvé en JSON
        }
    });
};


exports.updateRole = (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]; // Récupération du token depuis les headers
    if (!token) {
        return res.status(401).send("No token provided");
    }

    // Décodage du token pour obtenir l'email
    let email;
    try {
        const decoded = jwt.verify(token, secretKey); // Utilisez la même clé secrète pour vérifier le token
        email = decoded.email;
    } catch (err) {
        return res.status(401).send("Invalid token");
    }
    const userid = req.params.userid;
    const {roleid} = req.body;
    const updateTaskQuery = `UPDATE user SET role_id = ? WHERE id = ?`;
    connection.query(updateTaskQuery, [roleid, userid], (err, result) => {
        if (err) {
            console.error("Error while updating role:", err);
            res.status(500).send("Error while updating role");
        } else if (result.length === 0) {
            res.status(404).send("Error while updating role");
        } else {
            res.status(200).json(result); // Renvoie l'utilisateur trouvé en JSON
        }
    });
};
exports.getRoles = (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]; // Récupération du token depuis les headers
    if (!token) {
        return res.status(401).send("No token provided");
    }

    // Décodage du token pour obtenir l'email
    let email;
    try {
        const decoded = jwt.verify(token, secretKey); // Utilisez la même clé secrète pour vérifier le token
        email = decoded.email;
    } catch (err) {
        return res.status(401).send("Invalid token");
    }
    const getrolesquery = "SELECT * FROM role";
    connection.query(getrolesquery,  (err, result) => {
        if (err) {
            console.error("Error while updating role:", err);
            res.status(500).send("Error while updating role");
        } else if (result.length === 0) {
            res.status(404).send("Error while updating role");
        } else {
            res.status(200).json(result); // Renvoie l'utilisateur trouvé en JSON
        }
    });
};