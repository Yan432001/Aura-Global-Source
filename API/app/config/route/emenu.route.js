const express = require('express');
const router = express.Router();
const EMenuController = require('../../controller/emenu.controller');

// Ensure EMenuController.getData is a valid function
router.get('/data', EMenuController.getData);

module.exports = router;