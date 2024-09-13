const express = require('express');
const cors = require('cors'); // Importer le middleware CORS
const app = express();
const port = 8001;

// Importer les routes
const userRoutes = require('./roots/userRoot');
const dashboardRoutes = require('./roots/dashboardRoot');
const tasksRoutes = require('./roots/tasksRoot');
const roleRoutes = require('./roots/rolesRoot');
const notifRoutes = require('./roots/notifRoot');
const resRoutes = require('./roots/resRoot');

// Utiliser le middleware CORS
app.use(cors({ origin: 'http://localhost:3000' })); // Autorise seulement les requêtes venant de React

// Middleware pour parser le corps des requêtes en JSON
app.use(express.json());

// Utiliser les routes
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/notifications', notifRoutes);
app.use('/api/reservations', resRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
