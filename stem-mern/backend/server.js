require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const adminAuthRoutes = require('./routes/adminAuthRoutes');
const schoolAuthRoutes = require('./routes/schoolAuthRoutes');
const kitRoutes = require('./routes/kitRoutes');
const schoolRoutes = require('./routes/schoolRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const settingRoutes = require('./routes/settingRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

connectDB();

const app = express();

app.use(
  cors({
    origin: [process.env.FRONTEND_URL, process.env.ADMIN_URL].filter(Boolean),
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

// Serve uploaded kit images/pdfs and branding images (was assets/kits, assets/images in PHP)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (req, res) => res.json({ success: true, message: 'STEMSAGE API running' }));

app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/school/auth', schoolAuthRoutes);
app.use('/api/kits', kitRoutes);
app.use('/api/admin/schools', schoolRoutes);
app.use('/api/admin/assignments', assignmentRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/admin/dashboard', dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`STEMSAGE API running on port ${PORT}`));
