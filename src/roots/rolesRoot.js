const express = require("express");
const router = express.Router();
const servicesController = require('../controller/servicesController'); 

router.use(express.json());
router.put('/:userid',servicesController.updateRole)
router.get('/',servicesController.getRoles);

module.exports=router;