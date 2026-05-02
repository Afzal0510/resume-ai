import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">⚡ ResumeAI</Link>
      <ul className="navbar-links">
        <li><NavLink to="/">Home</NavLink></li>
        <li><NavLink to="/jobs">Browse Jobs</NavLink></li>
        <li><NavLink to="/upload">Upload Resume</NavLink></li>
      </ul>
      <div className="navbar-auth">
        {isLoggedIn ? (
          <>
            <span className="navbar-user">👤 {user?.name || 'User'}</span>
            <button className="navbar-logout-btn" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="/login" className="navbar-cta">Login →</Link>
        )}
      </div>
    </nav>
  );
}

