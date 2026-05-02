import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, pendingResumeFile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Optional: Pre-fill generic user data for demo purposes
    setEmail('demo@example.com');
    setPassword('password123');
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate an API call for login
    setTimeout(() => {
      login({ email, name: 'Demo User' });
      setLoading(false);

      if (pendingResumeFile) {
        // If there is a pending file to analyze, redirect to upload page and trigger auto-submit
        navigate('/upload', { state: { autoSubmit: true } });
      } else {
        // Default redirect to home or previous page
        const from = location.state?.from?.pathname || '/';
        navigate(from);
      }
    }, 800);
  };

  return (
    <div className="login-page">
      <div className="login-container animate-in">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Login to continue your resume analysis</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="Enter your email"
              className="form-control"
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="Enter your password"
              className="form-control"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg login-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="login-footer">
          <p>Don't have an account? <span className="link-text">Sign up</span></p>
        </div>
      </div>
    </div>
  );
}
