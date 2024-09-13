const express = require("express");
const router = express.Router();
const resController = require('../controller/resController'); 

router.get('/',resController.getRes);
router.post('/',resController.createRes);
router.put('/',resController.updateRes);
router.delete('/',resController.deleteRes);

module.exports = router