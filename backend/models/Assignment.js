const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema(
  {
    school: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
    kit: { type: mongoose.Schema.Types.ObjectId, ref: 'Kit', required: true }
  },
  { timestamps: { createdAt: 'assigned_at', updatedAt: false } }
);

// Mirrors the PHP "INSERT IGNORE" behaviour - a kit can only be assigned once per school
assignmentSchema.index({ school: 1, kit: 1 }, { unique: true });

module.exports = mongoose.model('Assignment', assignmentSchema);
