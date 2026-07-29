import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="dash-shell">
      <header className="dash-header">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="dash-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <img src={`${import.meta.env.BASE_URL}logos/360.png`} style={{ height: '24px', width: 'auto', objectFit: 'contain' }} alt="360 Tour Logo" />
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>Virtual Tour Studio</span>
          </Link>
          <nav className="dash-nav">
            <Link to="/dashboard" className="dash-nav-link">Dashboard</Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{user?.name}</span>
          <button onClick={handleLogout} className="btn btn-secondary btn-sm">
            Logout
          </button>
        </div>
      </header>

      <main className="dash-body">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
