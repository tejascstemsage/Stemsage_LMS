import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/', label: 'Dashboard', icon: '📊', end: true },
  { to: '/kits', label: 'Manage Kits', icon: '🧪' },
  { to: '/schools', label: 'Manage Schools', icon: '🏫' },
  { to: '/assignments', label: 'Assignments', icon: '🔗' },
  { to: '/settings', label: 'Settings', icon: '⚙️' }
];

const Sidebar = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">STEMSAGE</div>
      <div className="sidebar__label">Admin Panel</div>

      <nav className="sidebar__nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) => `sidebar__link${isActive ? ' sidebar__link--active' : ''}`}
          >
            <span>{link.icon}</span> {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        <div className="sidebar__admin">{admin?.username}</div>
        <button className="btn btn--ghost btn--sm" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
