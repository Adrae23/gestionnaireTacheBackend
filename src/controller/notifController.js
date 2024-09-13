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
exports.getNotif = (req, res) => {
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

    const getDashboardInfoQuery = ` SELECT * FROM notifications where user_email = ?`;
    connection.query(getDashboardInfoQuery, [email], (err, result) => {
        if (err) {
            console.error("Error while selecting notifications:", err);
            res.status(500).send("Error while selecting notifications");
        } else if (result.length === 0) {
            res.status(404).send("user info not found");
        } else {
            res.status(200).json(result); // Renvoie l'utilisateur trouvé en JSON
        }
    });
};
exports.createNotif = (req, res) => {
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
    INSERT INTO notifications(user_email,notification) VALUES(?,?)
`;
    const {user_email,notification}=req.body;
    connection.query(getDashboardInfoQuery, [user_email,notification], (err, result) => {
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