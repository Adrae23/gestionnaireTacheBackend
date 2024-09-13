const jwt = require('jsonwebtoken');
const secretKey = 'votreCléSecrète'; // Utilisez une clé secrète pour signer les tokens.
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "0000",
    database: "gestionTache"
});

connection.connect((err) => {
    if (err) {
        console.log("Erreur de connexion à MySQL:", err);
    } else {
        console.log("Connexion réussie à MySQL.");
    }
});

// Créer un utilisateur
exports.createUser = (req, res) => {
    const { name, email, password, role } = req.body;

    const createUserQuery = "INSERT INTO user (name, email, password,role) VALUES (?, ?, ?,?)";

    connection.query(createUserQuery, [name, email, password, role], (err, result) => {
        if (err) {
            console.error("Error creating user:", err);
            res.status(500).send("Error creating user");
        } else {
            res.status(201).send("User Created!");
        }
    });
};

// Connexion utilisateur
exports.login = (req, res) => {
    const { email, password } = req.body;

    const loginUserQuery = "SELECT * FROM user WHERE email = ? AND password = ?";

    connection.query(loginUserQuery, [email, password], (err, result) => {
        if (err) {
            console.error("Error finding user:", err);
            res.status(500).send("Error finding user");
        } else if (result.length > 0) {
            const user = result[0];
            console.log("User:", user); // Ajout du console.log pour afficher les détails de l'utilisateur
            const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, secretKey);
            res.status(200).json({ message: "Logged in successfully", token: token, role: user.role });
        } else {
            res.status(401).send("Invalid email or password");
        }
    });
};

// Obtenir l'utilisateur connecté
exports.getUserConnected = (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).send("No token provided");
    }

    let email;
    try {
        const decoded = jwt.verify(token, secretKey);
        email = decoded.email;
    } catch (err) {
        return res.status(401).send("Invalid token");
    }

    const getUserQuery = "SELECT * FROM user WHERE email = ?";
    connection.query(getUserQuery, [email], (err, result) => {
        if (err) {
            console.error("Error while selecting user:", err);
            res.status(500).send("Error while selecting user");
        } else if (result.length === 0) {
            res.status(404).send("User not found");
        } else {
            res.status(200).json(result[0]);
        }
    });
};

// Mettre à jour l'utilisateur connecté
exports.updateUserConnected = (req, res) => {
    const { name, email, password } = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).send("No token provided");
    }

    let emailFromToken;
    try {
        const decoded = jwt.verify(token, secretKey);
        emailFromToken = decoded.email;
    } catch (err) {
        return res.status(401).send("Invalid token");
    }

    const updateUserQuery = "UPDATE user SET name = ?, email = ?, password = ? WHERE email = ?";
    connection.query(updateUserQuery, [name, email, password, emailFromToken], (err, result) => {
        if (err) {
            console.error("Error while updating user:", err);
            res.status(500).send("Error while updating user");
        } else if (result.affectedRows === 0) {
            res.status(404).send("User not found");
        } else {
            res.status(200).send("User updated successfully");
        }
    });
};

// Obtenir tous les utilisateurs
exports.getAll = (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).send("No token provided");
    }

    let email;
    try {
        const decoded = jwt.verify(token, secretKey);
        email = decoded.email;
    } catch (err) {
        return res.status(401).send("Invalid token");
    }

    const getAllUsersQuery = "SELECT * FROM user";
    connection.query(getAllUsersQuery, (err, result) => {
        if (err) {
            console.error("Error while selecting users:", err);
            res.status(500).send("Error while selecting users");
        } else {
            res.status(200).json(result);
        }
    });
};

// Déconnexion
exports.logout = (req, res) => {
    // Simuler la déconnexion, aucune action spécifique nécessaire
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).send("No token provided");
    }

    res.status(200).json({ message: "Logged out successfully" });
};
