const express = require("express");
const router = express.Router();
const servicesController = require('../controller/servicesController'); 

router.use(express.json());
router.get("/",servicesController.gettasks);
router.get("/day",servicesController.gettasksPerDay);
router.post("/",servicesController.createtask);
router.put("/:taskid",servicesController.updatetask);
router.delete("/:taskid",servicesController.deletetask)

module.exports=router;