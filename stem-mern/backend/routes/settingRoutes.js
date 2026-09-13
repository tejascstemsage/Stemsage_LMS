const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingController');
const { protectAdmin } = require('../middleware/auth');
const { uploadBrandingFiles } = require('../middleware/upload');

router.get('/', getSettings); // public - login page branding
router.put('/', protectAdmin, uploadBrandingFiles, updateSettings);

module.exports = router;
