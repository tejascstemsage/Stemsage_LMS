const express = require('express');
const router = express.Router();
const { loginAdmin, getAdminProfile, logoutAdmin } = require('../controllers/adminAuthController');
const { protectAdmin } = require('../middleware/auth');

router.post('/login', loginAdmin);
router.get('/me', protectAdmin, getAdminProfile);
router.post('/logout', protectAdmin, logoutAdmin);

module.exports = router;
