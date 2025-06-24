const express = require('express');
const router = express.Router();
const vibeController = require('../controllers/vibeController');

router.post('/vibes', vibeController.generateVibes);

module.exports = router;
