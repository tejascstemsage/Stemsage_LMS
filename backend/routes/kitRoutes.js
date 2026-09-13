const express = require('express');
const router = express.Router();
const {
  getAllKitsAdmin,
  getKitByIdAdmin,
  createKit,
  updateKit,
  deleteKitImage,
  deleteKit,
  getMyKits
} = require('../controllers/kitController');
const { protectAdmin, protectSchool } = require('../middleware/auth');
const { uploadKitFiles } = require('../middleware/upload');

// School-facing (was index.php)
router.get('/school', protectSchool, getMyKits);

// Admin-facing (was admin/manage_kits.php)
router.get('/admin', protectAdmin, getAllKitsAdmin);
router.get('/admin/:id', protectAdmin, getKitByIdAdmin);
router.post('/admin', protectAdmin, uploadKitFiles, createKit);
router.put('/admin/:id', protectAdmin, uploadKitFiles, updateKit);
router.delete('/admin/:id/image', protectAdmin, deleteKitImage);
router.delete('/admin/:id', protectAdmin, deleteKit);

module.exports = router;
