const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const School = require('../models/School');

const signToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// POST /api/school/auth/login  (was login.php)
const loginSchool = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please enter both email and password' });
  }

  const school = await School.findOne({ email: email.toLowerCase(), is_active: true });
  if (!school) {
    return res.status(401).json({ success: false, message: 'School not found or account is inactive.' });
  }

  const isMatch = await bcrypt.compare(password, school.password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid password. Please try again.' });
  }

  const token = signToken({ id: school._id, role: 'school' });

  res.json({
    success: true,
    message: 'Login successful',
    token,
    school: {
      id: school._id,
      school_name: school.school_name,
      email: school.email,
      contact: school.contact
    }
  });
};

// GET /api/school/auth/me
const getSchoolProfile = async (req, res) => {
  const school = await School.findById(req.school.id).select('-password');
  if (!school) return res.status(404).json({ success: false, message: 'School not found' });
  res.json({ success: true, school });
};

// POST /api/school/auth/logout
const logoutSchool = (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
};

module.exports = { loginSchool, getSchoolProfile, logoutSchool };
