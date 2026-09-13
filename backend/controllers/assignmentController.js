const Assignment = require('../models/Assignment');
const Kit = require('../models/Kit');
const School = require('../models/School');

// GET /api/admin/assignments/:schoolId  -> assigned kits + unassigned kits for a school
const getAssignmentsForSchool = async (req, res) => {
  const { schoolId } = req.params;

  const school = await School.findById(schoolId).select('-password');
  if (!school) return res.status(404).json({ success: false, message: 'School does not exist.' });

  const assignments = await Assignment.find({ school: schoolId })
    .populate('kit')
    .sort({ 'kit.grade': 1 });

  const assignedKitIds = assignments.map((a) => a.kit?._id).filter(Boolean);

  const unassignedKits = await Kit.find({ _id: { $nin: assignedKitIds } }).sort({ grade: 1, subject: 1 });

  res.json({ success: true, school, assignments, unassignedKits });
};

// POST /api/admin/assignments  { school_id, kit_ids: [] }  (was action=assign, INSERT IGNORE)
const assignKits = async (req, res) => {
  const { school_id, kit_ids } = req.body;

  if (!school_id || !Array.isArray(kit_ids) || kit_ids.length === 0) {
    return res.status(400).json({ success: false, message: 'Please select at least one kit to assign.' });
  }

  const school = await School.findById(school_id);
  if (!school) {
    return res.status(400).json({ success: false, message: 'School does not exist. Please add a school first.' });
  }

  let successCount = 0;
  for (const kitId of kit_ids) {
    try {
      // eslint-disable-next-line no-await-in-loop
      await Assignment.create({ school: school_id, kit: kitId });
      successCount++;
    } catch (err) {
      // duplicate key (already assigned) is ignored, mirrors INSERT IGNORE
      if (err.code !== 11000) throw err;
    }
  }

  res.json({ success: true, message: `${successCount} kits assigned successfully!` });
};

// DELETE /api/admin/assignments/:assignmentId  (was action=remove)
const removeAssignment = async (req, res) => {
  const assignment = await Assignment.findById(req.params.assignmentId);
  if (!assignment) return res.status(404).json({ success: false, message: 'Assignment not found' });

  await assignment.deleteOne();
  res.json({ success: true, message: 'Assignment removed successfully!', school_id: assignment.school });
};

module.exports = { getAssignmentsForSchool, assignKits, removeAssignment };
