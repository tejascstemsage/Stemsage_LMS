/**
 * Seed script - creates the first admin user and default settings.
 * Run from the /database folder:  node seed.js
 * (make sure backend/.env has MONGO_URI set)
 */
const path = require('path');
require(path.join(__dirname, '..', 'backend', 'node_modules', 'dotenv')).config({ path: path.join(__dirname, '..', 'backend', '.env') });
const mongoose = require(path.join(__dirname, '..', 'backend', 'node_modules', 'mongoose'));
const bcrypt = require(path.join(__dirname, '..', 'backend', 'node_modules', 'bcryptjs'));

const Admin = require('../backend/models/Admin');
const Setting = require('../backend/models/Setting');

const DEFAULT_ADMIN = {
  username: 'admin',
  password: 'admin123'
};

const DEFAULT_SETTINGS = {
  login_overlay_color: 'rgba(15, 23, 42, 0.85)',
  login_primary_color: '#2563eb',
  login_secondary_color: '#7c3aed'
};

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    const existingAdmin = await Admin.findOne({ username: DEFAULT_ADMIN.username });
    if (!existingAdmin) {
      const hashed = await bcrypt.hash(DEFAULT_ADMIN.password, 10);
      await Admin.create({ username: DEFAULT_ADMIN.username, password: hashed });
      console.log(`Created default admin -> username: ${DEFAULT_ADMIN.username}, password: ${DEFAULT_ADMIN.password}`);
    } else {
      console.log('Admin user already exists, skipping.');
    }

    for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
      await Setting.findOneAndUpdate(
        { setting_key: key },
        { setting_value: value },
        { upsert: true }
      );
    }
    console.log('Default settings ensured.');

    console.log('Seeding complete!');
  } catch (err) {
    console.error('Seeding failed:', err.message);
  } finally {
    await mongoose.disconnect();
  }
};

run();