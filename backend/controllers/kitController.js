const fs = require('fs');
const path = require('path');
const Kit = require('../models/Kit');
const Assignment = require('../models/Assignment');

const removeFile = (folder, filename) => {
  if (!filename) return;
  const filePath = path.join(__dirname, '..', 'uploads', folder, filename);
  fs.unlink(filePath, () => {});
};

/* ---------------- ADMIN: was admin/manage_kits.php ---------------- */

// GET /api/admin/kits
const getAllKitsAdmin = async (req, res) => {
  const kits = await Kit.find().sort({ created_at: -1 });
  res.json({ success: true, kits });
};

// GET /api/admin/kits/:id
const getKitByIdAdmin = async (req, res) => {
  const kit = await Kit.findById(req.params.id);
  if (!kit) return res.status(404).json({ success: false, message: 'Kit not found' });
  res.json({ success: true, kit });
};

// POST /api/admin/kits  (multipart: kit_image, manual_pdf)
const createKit = async (req, res) => {
  const { kit_name, grade, subject, topic, description, video_url, learning_outcomes } = req.body;

  if (!kit_name || !grade || !subject) {
    return res.status(400).json({ success: false, message: 'Kit name, grade and subject are required' });
  }

  const kit = await Kit.create({
    kit_name,
    grade,
    subject,
    topic,
    description,
    video_url,
    learning_outcomes,
    kit_image: req.files?.kit_image?.[0]?.filename || '',
    manual_pdf: req.files?.manual_pdf?.[0]?.filename || ''
  });

  res.status(201).json({ success: true, message: 'Kit added successfully!', kit });
};

// PUT /api/admin/kits/:id  (multipart: kit_image, manual_pdf - optional)
const updateKit = async (req, res) => {
  const kit = await Kit.findById(req.params.id);
  if (!kit) return res.status(404).json({ success: false, message: 'Kit not found' });

  const { kit_name, grade, subject, topic, description, video_url, learning_outcomes } = req.body;

  kit.kit_name = kit_name ?? kit.kit_name;
  kit.grade = grade ?? kit.grade;
  kit.subject = subject ?? kit.subject;
  kit.topic = topic ?? kit.topic;
  kit.description = description ?? kit.description;
  kit.video_url = video_url ?? kit.video_url;
  kit.learning_outcomes = learning_outcomes ?? kit.learning_outcomes;

  if (req.files?.kit_image?.[0]) {
    removeFile('kits', kit.kit_image);
    kit.kit_image = req.files.kit_image[0].filename;
  }
  if (req.files?.manual_pdf?.[0]) {
    removeFile('kits', kit.manual_pdf);
    kit.manual_pdf = req.files.manual_pdf[0].filename;
  }

  await kit.save();
  res.json({ success: true, message: 'Kit updated successfully!', kit });
};

// DELETE /api/admin/kits/:id/image  (was the "delete image" action)
const deleteKitImage = async (req, res) => {
  const kit = await Kit.findById(req.params.id);
  if (!kit) return res.status(404).json({ success: false, message: 'Kit not found' });
  removeFile('kits', kit.kit_image);
  kit.kit_image = '';
  await kit.save();
  res.json({ success: true, message: 'Image deleted successfully!', kit });
};

// DELETE /api/admin/kits/:id
const deleteKit = async (req, res) => {
  const kit = await Kit.findById(req.params.id);
  if (!kit) return res.status(404).json({ success: false, message: 'Kit not found' });

  removeFile('kits', kit.kit_image);
  removeFile('kits', kit.manual_pdf);
  await Assignment.deleteMany({ kit: kit._id });
  await kit.deleteOne();

  res.json({ success: true, message: 'Kit deleted successfully!' });
};

/* ---------------- SCHOOL: was index.php (browse/search/filter/paginate) ---------------- */

// GET /api/school/kits?search=&grade=all&subject=all&page=1
const getMyKits = async (req, res) => {
  const schoolId = req.school.id;
  const itemsPerPage = 9;
  const page = parseInt(req.query.page) || 1;
  const search = (req.query.search || '').trim();
  const gradeFilter = req.query.grade || 'all';
  const subjectFilter = req.query.subject || 'all';

  const assignedKitIds = await Assignment.find({ school: schoolId }).distinct('kit');

  const match = { _id: { $in: assignedKitIds } };
  if (search) {
    const re = new RegExp(search, 'i');
    match.$or = [{ kit_name: re }, { topic: re }, { subject: re }];
  }
  if (gradeFilter !== 'all') match.grade = gradeFilter;
  if (subjectFilter !== 'all') match.subject = subjectFilter;

  const totalFiltered = await Kit.countDocuments(match);
  const totalPages = Math.max(1, Math.ceil(totalFiltered / itemsPerPage));

  const kits = await Kit.find(match)
    .sort({ grade: 1, subject: 1 })
    .skip((page - 1) * itemsPerPage)
    .limit(itemsPerPage);

  const grades = await Kit.find({ _id: { $in: assignedKitIds } }).distinct('grade');
  const subjects = await Kit.find({ _id: { $in: assignedKitIds } }).distinct('subject');

  res.json({
    success: true,
    kits,
    total_kits: assignedKitIds.length,
    total_filtered: totalFiltered,
    total_pages: totalPages,
    current_page: page,
    grades: grades.sort((a, b) => parseInt(a.replace(/\D/g, '')) - parseInt(b.replace(/\D/g, ''))),
    subjects: subjects.sort()
  });
};

module.exports = {
  getAllKitsAdmin,
  getKitByIdAdmin,
  createKit,
  updateKit,
  deleteKitImage,
  deleteKit,
  getMyKits
};
