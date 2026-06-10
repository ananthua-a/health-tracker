import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import './Navbar.css';

function Navbar({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    onLogout();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-title">AI Health Tracker</h1>
        <div className="navbar-right">
          {location.pathname === '/dashboard' && (
            <button className="btn-logout" onClick={handleLogout}>
              <LogOut size={18} />
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
