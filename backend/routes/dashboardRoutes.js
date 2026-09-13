const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/dashboardController');
const { protectAdmin } = require('../middleware/auth');

router.get('/stats', protectAdmin, getStats);

module.exports = router;
