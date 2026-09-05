import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { school, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar__brand">STEMSAGE</div>
      <div className="navbar__right">
        <div className="navbar__school">
          <span className="navbar__school-name">{school?.school_name}</span>
          <span className="navbar__school-email">{school?.email}</span>
        </div>
        <button className="btn btn--ghost" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
