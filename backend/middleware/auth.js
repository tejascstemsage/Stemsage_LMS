const jwt = require('jsonwebtoken');

const getTokenFromReq = (req) => {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    return header.split(' ')[1];
  }
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }
  return null;
};

// Replaces PHP's isAdminLoggedIn()
const protectAdmin = (req, res, next) => {
  const token = getTokenFromReq(req);
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, please login as admin' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access only' });
    }
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Session expired, please login again' });
  }
};

// Replaces PHP's isSchoolLoggedIn()
const protectSchool = (req, res, next) => {
  const token = getTokenFromReq(req);
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, please login' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'school') {
      return res.status(403).json({ success: false, message: 'School access only' });
    }
    req.school = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Session expired, please login again' });
  }
};

module.exports = { protectAdmin, protectSchool };
