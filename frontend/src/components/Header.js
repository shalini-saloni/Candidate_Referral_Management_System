import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          Worko
        </Link>

        {isAuthenticated && (
          <>
            <nav className="nav">
              <Link to="/" className={`nav-link ${isActive('/')}`}>
                Dashboard
              </Link>
              <Link to="/refer" className={`nav-link ${isActive('/refer')}`}>
                Refer Candidate
              </Link>
            </nav>

            <div className="user-info">
              <div className="user-avatar">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span style={{color: 'var(--text)'}}>{user?.name}</span>
              <button
                onClick={logout}
                className="btn btn-secondary"
                style={{padding: '0.5rem 1rem', marginLeft: '0.5rem'}}
              >
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
