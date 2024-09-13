const express = require('express');
const router = express.Router();
const userController = require('../controller/userController'); // Assurez-vous que ce chemin est correct

// Middleware pour parser le corps des requêtes en JSON
router.use(express.json());

// Routes pour les utilisateurs
router.get("/getAll", userController.getAll); // Assurez-vous que userController.getAll est défini
router.post("/register", userController.createUser); // Assurez-vous que userController.createUser est défini
router.post("/login", userController.login); // Assurez-vous que userController.login est défini
router.get("/me", userController.getUserConnected); // Assurez-vous que userController.getUserConnected est défini
router.put("/me", userController.updateUserConnected); // Assurez-vous que userController.updateUserConnected est défini
router.post("/logout", userController.logout); // Assurez-vous que userController.logout est défini

module.exports = router;
