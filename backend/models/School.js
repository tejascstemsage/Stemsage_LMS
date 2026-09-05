const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema(
  {
    school_name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    contact: { type: String, default: '' },
    password: { type: String, required: true }, // hashed
    is_active: { type: Boolean, default: true }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

module.exports = mongoose.model('School', schoolSchema);
