import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const statusColors = {
  submitted: '#F59E0B', under_review: '#3B82F6', approved: '#10B981',
  rejected: '#EF4444', disbursed: '#8B5CF6', closed: '#6B7280', draft: '#9CA3AF'
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    axios.get('/api/applications')
      .then(r => { setApplications(r.data.data); setLoading(false); })
      .catch(() => {
        // Mock data for demo
        setApplications([
          { _id: '1', applicationId: 'FLX12345678', loanType: 'personal', amount: 300000, tenure: 36, interestRate: 12.5, status: 'approved', appliedAt: new Date(Date.now() - 86400000 * 3) },
          { _id: '2', applicationId: 'FLX87654321', loanType: 'home', amount: 5000000, tenure: 180, interestRate: 8.5, status: 'under_review', appliedAt: new Date(Date.now() - 86400000 * 1) },
        ]);
        setLoading(false);
      });
  }, [user, navigate]);

  const fmt = (n) => '₹' + n.toLocaleString('en-IN');
  const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const loanIcons = { personal: '💳', home: '🏠', car: '🚗', education: '🎓', business: '🏢', gold: '🥇' };

  const totalApplied = applications.reduce((s, a) => s + a.amount, 0);
  const approvedCount = applications.filter(a => a.status === 'approved' || a.status === 'disbursed').length;

  return (
    <div className="dashboard-page">
      <div className="dashboard-sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">F</div>
          <span>Flextenure</span>
        </div>
        <nav className="sidebar-nav">
          {[
            { id: 'overview', icon: '📊', label: 'Overview' },
            { id: 'applications', icon: '📋', label: 'My Applications' },
            { id: 'profile', icon: '👤', label: 'Profile' },
            { id: 'documents', icon: '📁', label: 'Documents' },
          ].map(item => (
            <button key={item.id} className={`sidebar-link ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}>
              <span>{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <Link to="/eligibility" className="sidebar-link">
            <span>✨</span>New Application
          </Link>
          <button className="sidebar-link logout" onClick={() => { logout(); navigate('/'); }}>
            <span>🚪</span>Logout
          </button>
        </div>
      </div>

      <div className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h2>Welcome back, {user?.name?.split(' ')[0]}! 👋</h2>
            <p className="dash-sub">Here's what's happening with your loans.</p>
          </div>
          <Link to="/eligibility" className="btn btn-primary">+ New Application</Link>
        </div>

        {activeTab === 'overview' && (
          <div className="dash-content">
            {/* Stats */}
            <div className="dash-stats-grid">
              {[
                { icon: '📋', label: 'Total Applications', value: applications.length, color: '#2563EB' },
                { icon: '✅', label: 'Approved', value: approvedCount, color: '#10B981' },
                { icon: '💰', label: 'Total Applied For', value: fmt(totalApplied), color: '#8B5CF6' },
                { icon: '⭐', label: 'Credit Score', value: '742', sub: 'Good', color: '#F59E0B' },
              ].map((s, i) => (
                <div className="dash-stat-card card" key={i}>
                  <div className="dsc-icon" style={{ background: s.color + '15' }}>{s.icon}</div>
                  <div className="dsc-body">
                    <div className="dsc-label">{s.label}</div>
                    <div className="dsc-value">{s.value}</div>
                    {s.sub && <div className="dsc-sub" style={{ color: s.color }}>{s.sub}</div>}
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Applications */}
            <div className="card dash-section">
              <div className="dash-section-header">
                <h3>Recent Applications</h3>
                <button className="btn btn-outline btn-sm" onClick={() => setActiveTab('applications')}>View All</button>
              </div>
              {loading ? <div className="dash-loading">Loading...</div> :
                applications.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📋</div>
                    <h4>No applications yet</h4>
                    <p>Start your loan journey today</p>
                    <Link to="/eligibility" className="btn btn-primary">Check Eligibility</Link>
                  </div>
                ) : (
                  <div className="apps-list">
                    {applications.slice(0, 3).map(app => (
                      <div className="app-item" key={app._id}>
                        <div className="app-icon">{loanIcons[app.loanType] || '💳'}</div>
                        <div className="app-info">
                          <div className="app-type">{app.loanType?.charAt(0).toUpperCase() + app.loanType?.slice(1)} Loan</div>
                          <div className="app-id">{app.applicationId}</div>
                        </div>
                        <div className="app-amount">{fmt(app.amount)}</div>
                        <div className="app-status" style={{ background: statusColors[app.status] + '20', color: statusColors[app.status] }}>
                          {app.status?.replace('_', ' ').toUpperCase()}
                        </div>
                        <div className="app-date">{fmtDate(app.appliedAt || app.createdAt)}</div>
                      </div>
                    ))}
                  </div>
                )
              }
            </div>

            {/* Quick Actions */}
            <div className="card dash-section">
              <h3>Quick Actions</h3>
              <div className="quick-actions">
                {[
                  { icon: '🔍', label: 'Check Eligibility', path: '/eligibility' },
                  { icon: '🧮', label: 'EMI Calculator', path: '/emi-calculator' },
                  { icon: '⭐', label: 'Check Credit Score', path: '/credit-score' },
                  { icon: '💳', label: 'Apply Personal Loan', path: '/loans/personal' },
                ].map((a, i) => (
                  <Link to={a.path} key={i} className="quick-action-btn">
                    <span className="qa-icon">{a.icon}</span>
                    <span>{a.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="dash-content">
            <div className="card">
              <div className="dash-section-header" style={{ marginBottom: 24 }}>
                <h3>All Applications ({applications.length})</h3>
              </div>
              {loading ? <div className="dash-loading">Loading...</div> :
                applications.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📋</div>
                    <h4>No applications yet</h4>
                    <Link to="/eligibility" className="btn btn-primary" style={{ marginTop: 16 }}>Apply Now</Link>
                  </div>
                ) : (
                  <div className="apps-table-wrap">
                    <table className="apps-table">
                      <thead>
                        <tr><th>Loan Type</th><th>App ID</th><th>Amount</th><th>Tenure</th><th>Rate</th><th>Status</th><th>Applied</th></tr>
                      </thead>
                      <tbody>
                        {applications.map(app => (
                          <tr key={app._id}>
                            <td><span className="app-type-cell">{loanIcons[app.loanType]} {app.loanType?.charAt(0).toUpperCase() + app.loanType?.slice(1)}</span></td>
                            <td className="app-id-cell">{app.applicationId}</td>
                            <td className="app-amt-cell">{fmt(app.amount)}</td>
                            <td>{app.tenure} mo</td>
                            <td>{app.interestRate}%</td>
                            <td><span className="status-pill" style={{ background: statusColors[app.status] + '20', color: statusColors[app.status] }}>{app.status?.replace('_', ' ')}</span></td>
                            <td>{fmtDate(app.appliedAt || app.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              }
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="dash-content">
            <div className="card">
              <h3 style={{ marginBottom: 24 }}>My Profile</h3>
              <div className="profile-avatar-row">
                <div className="profile-avatar">{user?.name?.[0] || 'U'}</div>
                <div>
                  <div className="profile-name">{user?.name}</div>
                  <div className="profile-email">{user?.email}</div>
                </div>
              </div>
              <div className="profile-fields">
                <div className="form-group"><label>Full Name</label><input className="form-control" defaultValue={user?.name} readOnly /></div>
                <div className="form-group"><label>Email</label><input className="form-control" defaultValue={user?.email} readOnly /></div>
                <div className="form-group"><label>Mobile</label><input className="form-control" defaultValue={user?.phone} readOnly /></div>
              </div>
              <div className="profile-completion">
                <div className="pc-header"><span>Profile Completion</span><span className="pc-pct">35%</span></div>
                <div className="pc-bar"><div className="pc-fill" style={{ width: '35%' }}></div></div>
                <p className="pc-tip">Complete your profile to get pre-approved loan offers</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="dash-content">
            <div className="card">
              <h3 style={{ marginBottom: 8 }}>My Documents</h3>
              <p style={{ color: 'var(--gray-500)', marginBottom: 24, fontSize: '0.9rem' }}>Upload your KYC and income documents for faster loan processing.</p>
              <div className="doc-upload-grid">
                {['PAN Card', 'Aadhaar Card', 'Salary Slips (3 months)', 'Bank Statements', 'ITR / Form 16', 'Address Proof'].map((doc, i) => (
                  <div className="doc-upload-item" key={i}>
                    <div className="dui-icon">📄</div>
                    <div className="dui-name">{doc}</div>
                    <button className="btn btn-outline btn-sm">Upload</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;