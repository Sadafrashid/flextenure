import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const update = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await register(form.name, form.email, form.phone, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Registration failed.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-split">
        <div className="auth-visual">
          <div className="auth-visual-content">
            <div className="av-logo"><div className="logo-icon">F</div><span>Flextenure</span></div>
            <h2>Start Your Journey</h2>
            <p>Join millions of Indians who trust Flextenure for smarter borrowing.</p>
            <div className="av-perks">
              {['Free eligibility check', 'Compare 30+ lenders', 'Instant online approval', 'Zero hidden charges'].map((p, i) => (
                <div key={i} className="av-perk"><span>✓</span>{p}</div>
              ))}
            </div>
          </div>
        </div>
        <div className="auth-form-side">
          <div className="auth-form-wrap">
            <h2>Create Account</h2>
            <p className="auth-sub">Already have an account? <Link to="/login">Sign in →</Link></p>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" className="form-control" placeholder="Rahul Sharma"
                  value={form.name} onChange={e => update('name', e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" className="form-control" placeholder="you@example.com"
                  value={form.email} onChange={e => update('email', e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Mobile Number</label>
                <div className="input-group">
                  <span className="input-prefix-text">+91</span>
                  <input type="tel" className="form-control" placeholder="10-digit number"
                    value={form.phone} onChange={e => update('phone', e.target.value)} required />
                </div>
              </div>
              <div className="form-group">
                <label>Create Password</label>
                <input type="password" className="form-control" placeholder="Min 6 characters"
                  value={form.password} onChange={e => update('password', e.target.value)} required minLength={6} />
              </div>
              <p className="auth-terms">By registering, you agree to our <a href="#terms">Terms & Conditions</a> and <a href="#privacy">Privacy Policy</a>.</p>
              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                {loading ? <><div className="spinner"></div> Creating Account...</> : 'Create Free Account'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;