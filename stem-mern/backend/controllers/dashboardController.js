const School = require('../models/School');
const Kit = require('../models/Kit');
const Assignment = require('../models/Assignment');

// GET /api/admin/dashboard/stats  (was the counters at the top of admin/index.php)
const getStats = async (req, res) => {
  const [totalSchools, activeSchools, totalKits, totalAssignments] = await Promise.all([
    School.countDocuments(),
    School.countDocuments({ is_active: true }),
    Kit.countDocuments(),
    Assignment.countDocuments()
  ]);

  const bySubject = await Kit.aggregate([
    { $group: { _id: '$subject', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  const byGrade = await Kit.aggregate([
    { $group: { _id: '$grade', count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);

  res.json({
    success: true,
    stats: {
      total_schools: totalSchools,
      active_schools: activeSchools,
      total_kits: totalKits,
      total_assignments: totalAssignments,
      by_subject: bySubject.map((s) => ({ subject: s._id, count: s.count })),
      by_grade: byGrade.map((g) => ({ grade: g._id, count: g.count }))
    }
  });
};

module.exports = { getStats };
