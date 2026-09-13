const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema(
  {
    setting_key: { type: String, required: true, unique: true },
    setting_value: { type: String, default: '' }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

module.exports = mongoose.model('Setting', settingSchema);
