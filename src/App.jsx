import { Link, Outlet } from 'react-router-dom';
import './App.css';
import { useAuth } from './AuthContext';

function AppLayout() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div>
      <header className="app-header">
        <h1>Event Management</h1>
        <nav className="nav">
          <Link to="/">Venues</Link>
          <Link to="/bookings">Bookings</Link>
          <Link to="/auth">Login / Register</Link>
        </nav>
        <div className="user-info">
          {isAuthenticated && (
            <>
              <span>{user?.name || user?.email}</span>
              <button type="button" onClick={logout}>
                Logout
              </button>
            </>
          )}
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
