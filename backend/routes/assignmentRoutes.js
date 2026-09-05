const express = require('express');
const router = express.Router();
const {
  getAssignmentsForSchool,
  assignKits,
  removeAssignment
} = require('../controllers/assignmentController');
const { protectAdmin } = require('../middleware/auth');

router.use(protectAdmin);

router.get('/:schoolId', getAssignmentsForSchool);
router.post('/', assignKits);
router.delete('/:assignmentId', removeAssignment);

module.exports = router;
