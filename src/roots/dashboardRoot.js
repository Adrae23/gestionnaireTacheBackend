const express = require("express");
const router = express.Router();
const dashboardController = require('../controller/servicesController'); 

router.use(express.json());
router.get("/",dashboardController.getdashboard);
router.get("/preferences",dashboardController.getdashboardPreferences);

module.exports=router