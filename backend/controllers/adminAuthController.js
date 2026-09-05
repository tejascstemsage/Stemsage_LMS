const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const signToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// POST /api/admin/auth/login   (was admin/login.php)
const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Please enter both username and password' });
  }

  const admin = await Admin.findOne({ username });
  if (!admin) {
    return res.status(401).json({ success: false, message: 'Invalid username' });
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid password' });
  }

  const token = signToken({ id: admin._id, username: admin.username, role: 'admin' });

  res.json({
    success: true,
    message: 'Login successful',
    token,
    admin: { id: admin._id, username: admin.username }
  });
};

// GET /api/admin/auth/me
const getAdminProfile = async (req, res) => {
  const admin = await Admin.findById(req.admin.id).select('-password');
  if (!admin) return res.status(404).json({ success: false, message: 'Admin not found' });
  res.json({ success: true, admin });
};

// POST /api/admin/auth/logout (client just deletes token, this endpoint kept for parity with logout.php)
const logoutAdmin = (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
};

module.exports = { loginAdmin, getAdminProfile, logoutAdmin };
