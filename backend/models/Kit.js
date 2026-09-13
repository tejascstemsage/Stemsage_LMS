const mongoose = require('mongoose');

const kitSchema = new mongoose.Schema(
  {
    kit_name: { type: String, required: true, trim: true },
    grade: { type: String, required: true },
    subject: { type: String, required: true },
    topic: { type: String, default: '' },
    description: { type: String, default: '' },
    video_url: { type: String, default: '' },
    manual_pdf: { type: String, default: '' }, // stored filename
    kit_image: { type: String, default: '' }, // stored filename
    learning_outcomes: { type: String, default: '' }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

module.exports = mongoose.model('Kit', kitSchema);
