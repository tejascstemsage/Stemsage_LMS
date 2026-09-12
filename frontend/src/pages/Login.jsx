import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api, { resolveFileUrl } from '../api/axios';
import defaultLogo from '../assets/logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [branding, setBranding] = useState({
    login_background: '',
    school_logo: '',
    login_overlay_color: 'rgba(15, 23, 42, 0.85)',
    login_primary_color: '#2563eb',
    login_secondary_color: '#7c3aed'
  });
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/settings').then(({ data }) => {
      if (data.success) setBranding((prev) => ({ ...prev, ...data.settings }));
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const bgStyle = branding.login_background
    ? {
        backgroundImage: `linear-gradient(${branding.login_overlay_color}, ${branding.login_overlay_color}), url(${resolveFileUrl(branding.login_background, 'branding')})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }
    : { background: 'linear-gradient(135deg, #0f172a, #1e293b)' };

  return (
    <div className="login-page" style={bgStyle}>
      <div className="login-card">
        <img
          className="login-card__logo"
          src={branding.school_logo ? resolveFileUrl(branding.school_logo, 'branding') : defaultLogo}
          alt="Logo"
        />

        <h1 className="login-card__title">School Login</h1>
        <p className="login-card__subtitle">Access your assigned STEM kits</p>

        {error && <div className="alert alert--danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label className="field-label">Email</label>
          <input
            type="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="school@example.com"
            autoFocus
          />

          <label className="field-label">Password</label>
          <input
            type="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />

          <button
            type="submit"
            className="btn btn--primary btn--block"
            disabled={loading}
            style={{
              background: `linear-gradient(135deg, ${branding.login_primary_color}, ${branding.login_secondary_color})`
            }}
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;