const express = require("express");
const router = express.Router();
const notifController = require('../controller/notifController'); 

router.use(express.json());
router.post('/',notifController.createNotif)
router.get('/',notifController.getNotif);

module.exports=router;