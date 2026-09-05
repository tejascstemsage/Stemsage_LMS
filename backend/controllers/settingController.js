const fs = require('fs');
const path = require('path');
const Setting = require('../models/Setting');

const DEFAULTS = {
  login_background: '',
  school_logo: '',
  login_overlay_color: 'rgba(15, 23, 42, 0.85)',
  login_primary_color: '#2563eb',
  login_secondary_color: '#7c3aed'
};

const removeFile = (filename) => {
  if (!filename) return;
  const filePath = path.join(__dirname, '..', 'uploads', 'branding', filename);
  fs.unlink(filePath, () => {});
};

// GET /api/settings  (public - used to brand the login page, was getSetting() calls)
const getSettings = async (req, res) => {
  const rows = await Setting.find();
  const settings = { ...DEFAULTS };
  rows.forEach((row) => {
    settings[row.setting_key] = row.setting_value;
  });
  res.json({ success: true, settings });
};

// PUT /api/admin/settings  (admin only, multipart: logo_image, bg_image) - was admin/settings.php
const updateSettings = async (req, res) => {
  const { overlay_color, primary_color, secondary_color } = req.body;

  const updates = {};
  if (overlay_color) updates.login_overlay_color = overlay_color;
  if (primary_color) updates.login_primary_color = primary_color;
  if (secondary_color) updates.login_secondary_color = secondary_color;

  if (req.files?.logo_image?.[0]) {
    const current = await Setting.findOne({ setting_key: 'school_logo' });
    if (current?.setting_value) removeFile(current.setting_value);
    updates.school_logo = req.files.logo_image[0].filename;
  }
  if (req.files?.bg_image?.[0]) {
    const current = await Setting.findOne({ setting_key: 'login_background' });
    if (current?.setting_value) removeFile(current.setting_value);
    updates.login_background = req.files.bg_image[0].filename;
  }

  const keys = Object.keys(updates);
  await Promise.all(
    keys.map((key) =>
      Setting.findOneAndUpdate(
        { setting_key: key },
        { setting_value: updates[key] },
        { upsert: true, new: true }
      )
    )
  );

  const rows = await Setting.find();
  const settings = { ...DEFAULTS };
  rows.forEach((row) => {
    settings[row.setting_key] = row.setting_value;
  });

  res.json({ success: true, message: 'Settings updated successfully!', settings });
};

module.exports = { getSettings, updateSettings };
