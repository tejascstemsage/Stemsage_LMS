const bcrypt = require('bcryptjs');
const School = require('../models/School');
const Assignment = require('../models/Assignment');

// GET /api/admin/schools
const getAllSchools = async (req, res) => {
  const schools = await School.find().sort({ created_at: -1 }).select('-password');
  res.json({ success: true, schools });
};

// GET /api/admin/schools/:id
const getSchoolById = async (req, res) => {
  const school = await School.findById(req.params.id).select('-password');
  if (!school) return res.status(404).json({ success: false, message: 'School not found' });
  res.json({ success: true, school });
};

// POST /api/admin/schools
const createSchool = async (req, res) => {
  const { school_name, email, contact, password, is_active } = req.body;

  if (!school_name || !email || !password) {
    return res.status(400).json({ success: false, message: 'School name, email and password are required' });
  }

  const exists = await School.findOne({ email: email.toLowerCase() });
  if (exists) {
    return res.status(400).json({ success: false, message: 'A school with this email already exists' });
  }

  const hashed = await bcrypt.hash(password, 10);

  const school = await School.create({
    school_name,
    email: email.toLowerCase(),
    contact,
    password: hashed,
    is_active: is_active === undefined ? true : !!is_active
  });

  const { password: _pw, ...schoolData } = school.toObject();
  res.status(201).json({ success: true, message: 'School added successfully!', school: schoolData });
};

// PUT /api/admin/schools/:id
const updateSchool = async (req, res) => {
  const school = await School.findById(req.params.id);
  if (!school) return res.status(404).json({ success: false, message: 'School not found' });

  const { school_name, email, contact, password, is_active } = req.body;

  school.school_name = school_name ?? school.school_name;
  school.email = email ? email.toLowerCase() : school.email;
  school.contact = contact ?? school.contact;
  school.is_active = is_active === undefined ? school.is_active : !!is_active;

  if (password) {
    school.password = await bcrypt.hash(password, 10);
  }

  await school.save();
  const { password: _pw, ...schoolData } = school.toObject();
  res.json({ success: true, message: 'School updated successfully!', school: schoolData });
};

// DELETE /api/admin/schools/:id
const deleteSchool = async (req, res) => {
  const school = await School.findById(req.params.id);
  if (!school) return res.status(404).json({ success: false, message: 'School not found' });

  await Assignment.deleteMany({ school: school._id });
  await school.deleteOne();

  res.json({ success: true, message: 'School deleted successfully!' });
};

module.exports = { getAllSchools, getSchoolById, createSchool, updateSchool, deleteSchool };
