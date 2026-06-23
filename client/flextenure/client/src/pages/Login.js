import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-split">
        <div className="auth-visual">
          <div className="auth-visual-content">
            <div className="av-logo"><div className="logo-icon">F</div><span>Flextenure</span></div>
            <h2>Welcome Back!</h2>
            <p>Log in to access your loan applications, track status, and manage your finances.</p>
            <div className="av-stats">
              <div className="av-stat"><strong>50L+</strong><span>Happy Customers</span></div>
              <div className="av-stat"><strong>4.8★</strong><span>App Rating</span></div>
            </div>
          </div>
        </div>
        <div className="auth-form-side">
          <div className="auth-form-wrap">
            <h2>Sign In</h2>
            <p className="auth-sub">New to Flextenure? <Link to="/register">Create account →</Link></p>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" className="form-control" placeholder="you@example.com"
                  value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" className="form-control" placeholder="Enter password"
                  value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              <div className="auth-options">
                <a href="#forgot" className="forgot-link">Forgot password?</a>
              </div>
              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                {loading ? <><div className="spinner"></div> Signing In...</> : 'Sign In'}
              </button>
            </form>
            <div className="auth-divider"><span>or continue with</span></div>
            <div className="social-btns">
              <button className="social-btn">📱 OTP Login</button>
              <button className="social-btn">🔵 Google</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;