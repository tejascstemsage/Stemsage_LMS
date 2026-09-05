const express = require('express');
const router = express.Router();
const { loginSchool, getSchoolProfile, logoutSchool } = require('../controllers/schoolAuthController');
const { protectSchool } = require('../middleware/auth');

router.post('/login', loginSchool);
router.get('/me', protectSchool, getSchoolProfile);
router.post('/logout', protectSchool, logoutSchool);

module.exports = router;
