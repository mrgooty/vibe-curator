const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/preferences', userController.savePreferences);
router.get('/preferences', userController.getPreferences);

module.exports = router;
