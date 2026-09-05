import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api, { UPLOADS_URL } from '../api/axios';

const Settings = () => {
  const [settings, setSettings] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [bgFile, setBgFile] = useState(null);
  const [colors, setColors] = useState({
    overlay_color: '',
    primary_color: '',
    secondary_color: ''
  });
  const [message, setMessage] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    const { data } = await api.get('/settings');
    if (data.success) {
      setSettings(data.settings);
      setColors({
        overlay_color: data.settings.login_overlay_color,
        primary_color: data.settings.login_primary_color,
        secondary_color: data.settings.login_secondary_color
      });
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const fd = new FormData();
    fd.append('overlay_color', colors.overlay_color);
    fd.append('primary_color', colors.primary_color);
    fd.append('secondary_color', colors.secondary_color);
    if (logoFile) fd.append('logo_image', logoFile);
    if (bgFile) fd.append('bg_image', bgFile);

    try {
      const { data } = await api.put('/settings', fd);
      setMessage({ type: 'success', text: data.message });
      setSettings(data.settings);
      setLogoFile(null);
      setBgFile(null);
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Something went wrong' });
    } finally {
      setSaving(false);
    }
  };

  if (!settings) {
    return (
      <Layout>
        <p>Loading settings...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="page-title">Settings</h1>
      <p className="page-subtitle">Customize the school login page branding</p>

      {message && <div className={`alert alert--${message.type}`}>{message.text}</div>}

      <form onSubmit={handleSubmit} className="panel form-grid">
        <div>
          <label className="field-label">School / Site Logo</label>
          {settings.school_logo && (
            <img
              src={`${UPLOADS_URL}/branding/${settings.school_logo}`}
              alt="Current logo"
              style={{ height: 60, marginBottom: 8, display: 'block' }}
            />
          )}
          <input className="input" type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files[0])} />
        </div>

        <div>
          <label className="field-label">Login Background Image</label>
          {settings.login_background && (
            <img
              src={`${UPLOADS_URL}/branding/${settings.login_background}`}
              alt="Current background"
              style={{ height: 60, marginBottom: 8, display: 'block' }}
            />
          )}
          <input className="input" type="file" accept="image/*" onChange={(e) => setBgFile(e.target.files[0])} />
        </div>

        <div>
          <label className="field-label">Overlay Color</label>
          <input
            className="input"
            value={colors.overlay_color}
            onChange={(e) => setColors({ ...colors, overlay_color: e.target.value })}
            placeholder="rgba(15, 23, 42, 0.85)"
          />
        </div>

        <div>
          <label className="field-label">Primary Color</label>
          <input
            className="input"
            type="color"
            value={/^#/.test(colors.primary_color) ? colors.primary_color : '#2563eb'}
            onChange={(e) => setColors({ ...colors, primary_color: e.target.value })}
          />
        </div>

        <div>
          <label className="field-label">Secondary Color</label>
          <input
            className="input"
            type="color"
            value={/^#/.test(colors.secondary_color) ? colors.secondary_color : '#7c3aed'}
            onChange={(e) => setColors({ ...colors, secondary_color: e.target.value })}
          />
        </div>

        <div className="form-grid__full">
          <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </Layout>
  );
};

export default Settings;
