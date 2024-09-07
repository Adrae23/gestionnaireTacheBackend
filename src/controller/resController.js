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
exports.createRes = (req, res) => {
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

    const {task_id, date, time, status} = req.body;
    const createReservationQuery = `INSERT INTO reservations(user_email, task_id, date, time, status) VALUES(?, ?, ?, ?, ?)`;
    connection.query(createReservationQuery, [email, task_id, date, time, status], (err, result) => {
        if (err) {
            console.error("Error while creating reservation:", err);
            res.status(500).send("Error while creating reservation");
        } else {
            res.status(200).json(result); // Renvoie la confirmation de la réservation
        }
    });
};
exports.updateRes = (req, res) => {
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

    const reservationId = req.params.reservationId;
    const {status} = req.body;
    const updateReservationQuery = `UPDATE reservations SET status = ? WHERE id = ? AND user_email = ?`;
    connection.query(updateReservationQuery, [status, reservationId, email], (err, result) => {
        if (err) {
            console.error("Error while updating reservation:", err);
            res.status(500).send("Error while updating reservation");
        } else if (result.affectedRows === 0) {
            res.status(404).send("Reservation not found or unauthorized");
        } else {
            res.status(200).json({ message: "Reservation updated successfully" });
        }
    });
};
exports.getRes = (req, res) => {
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

    const getReservationsQuery = `SELECT r.id, r.date, r.time, r.status, t.task_description
                                  FROM reservations r
                                  JOIN tasks t ON r.task_id = t.id
                                  WHERE r.user_email = ?`;
    connection.query(getReservationsQuery, [email], (err, results) => {
        if (err) {
            console.error("Error while retrieving reservations:", err);
            res.status(500).send("Error while retrieving reservations");
        } else {
            res.status(200).json(results); // Renvoie la liste des réservations
        }
    });
};
exports.deleteRes = (req, res) => {
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

    const reservationId = req.params.reservationId;
    const deleteReservationQuery = `DELETE FROM reservations WHERE id = ? AND user_email = ?`;
    connection.query(deleteReservationQuery, [reservationId, email], (err, result) => {
        if (err) {
            console.error("Error while deleting reservation:", err);
            res.status(500).send("Error while deleting reservation");
        } else if (result.affectedRows === 0) {
            res.status(404).send("Reservation not found or unauthorized");
        } else {
            res.status(200).json({ message: "Reservation deleted successfully" });
        }
    });
};
