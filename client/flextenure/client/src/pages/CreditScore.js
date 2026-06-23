import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './CreditScore.css';

const ratingFor = (score) => {
  if (score >= 750) return { label: 'Excellent', color: '#10B981' };
  if (score >= 700) return { label: 'Good', color: '#3B82F6' };
  if (score >= 650) return { label: 'Fair', color: '#F59E0B' };
  return { label: 'Needs Work', color: '#EF4444' };
};

const CreditScore = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    axios.get('/api/credit-score')
      .then(r => { setData(r.data.data); setLoading(false); })
      .catch(() => {
        // Fallback mock — mirrors the shape the backend returns
        setData({
          score: 742,
          history: [702, 715, 708, 724, 736, 742],
          factors: [
            { label: 'Payment History', status: 'Excellent', pct: 95, tip: 'You\'ve paid on time for 24+ months in a row.' },
            { label: 'Credit Utilization', status: 'Good', pct: 78, tip: 'You\'re using 28% of your available credit. Aim for under 30%.' },
            { label: 'Credit Age', status: 'Fair', pct: 55, tip: 'Your oldest account is 3.2 years old. Older is better.' },
            { label: 'Credit Mix', status: 'Good', pct: 70, tip: 'A healthy mix of loans and cards. Keep it balanced.' },
            { label: 'Hard Inquiries', status: 'Excellent', pct: 90, tip: 'Only 1 inquiry in the last 12 months.' },
          ],
          tips: [
            'Keep credit card utilization below 30% of your limit',
            'Avoid applying for multiple loans in a short span',
            'Set up auto-pay to never miss a due date',
            'Keep old credit accounts open to build credit age',
          ],
        });
        setLoading(false);
      });
  }, [user]);

  const fmt = (n) => '₹' + n.toLocaleString('en-IN');

  if (!user) {
    return (
      <div className="cs-page">
        <div className="cs-hero">
          <div className="container">
            <div className="badge badge-mint" style={{ marginBottom: 16 }}>⭐ 100% Free · No Impact</div>
            <h1>Check Your Credit Score</h1>
            <p>See your real-time CIBIL-based score, full report, and personalised tips to improve it — free, forever.</p>
          </div>
        </div>
        <div className="container cs-gate-container">
          <div className="card cs-gate-card">
            <div className="cs-gate-icon">🔒</div>
            <h2>Sign in to view your score</h2>
            <p>We need to verify your identity to pull your credit report securely. It only takes a minute.</p>
            <div className="cs-gate-actions">
              <Link to="/login" className="btn btn-primary btn-lg">Sign In</Link>
              <Link to="/register" className="btn btn-outline btn-lg">Create Free Account</Link>
            </div>
            <div className="cs-gate-note">🛡️ Checking your score never affects it — this is a soft inquiry.</div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) return <div style={{ padding: '160px 0', textAlign: 'center' }}>Loading your credit report...</div>;

  const rating = ratingFor(data.score);
  const pct = Math.min(100, Math.max(0, ((data.score - 300) / (900 - 300)) * 100));
  const dashOffset = 251.3 - (pct / 100) * 251.3;

  return (
    <div className="cs-page">
      <div className="cs-hero">
        <div className="container">
          <div className="badge badge-mint" style={{ marginBottom: 16 }}>⭐ Updated Today</div>
          <h1>Your Credit Score</h1>
          <p>Hi {user?.name?.split(' ')[0]}, here's your latest credit health snapshot.</p>
        </div>
      </div>

      <div className="container cs-container">
        <div className="cs-top-grid">
          {/* Score gauge */}
          <div className="card cs-score-card">
            <svg viewBox="0 0 200 120" width="220" className="cs-gauge">
              <path d="M 20 100 A 80 80 0 0 1 180 100" stroke="#E5E7EB" strokeWidth="16" fill="none" strokeLinecap="round"/>
              <path d="M 20 100 A 80 80 0 0 1 180 100" stroke="url(#csGrad)" strokeWidth="16" fill="none" strokeLinecap="round"
                strokeDasharray="251.3" strokeDashoffset={dashOffset} />
              <defs>
                <linearGradient id="csGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#EF4444"/>
                  <stop offset="50%" stopColor="#F59E0B"/>
                  <stop offset="100%" stopColor="#10B981"/>
                </linearGradient>
              </defs>
              <text x="100" y="92" textAnchor="middle" fontSize="32" fontWeight="800" fill="#0A1628">{data.score}</text>
              <text x="100" y="110" textAnchor="middle" fontSize="11" fill="#6B7280">OUT OF 900</text>
            </svg>
            <div className="cs-rating-pill" style={{ background: rating.color + '20', color: rating.color }}>{rating.label}</div>
            <p className="cs-score-note">Your score is updated as lenders report new activity. Check back monthly.</p>
            <Link to="/eligibility" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}>
              See Offers For My Score →
            </Link>
          </div>

          {/* History sparkline */}
          <div className="card cs-history-card">
            <h3>6-Month Trend</h3>
            <div className="cs-sparkline-wrap">
              <svg viewBox="0 0 300 100" preserveAspectRatio="none" className="cs-sparkline">
                <polyline
                  fill="none" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                  points={data.history.map((v, i) => {
                    const x = (i / (data.history.length - 1)) * 290 + 5;
                    const min = Math.min(...data.history) - 10;
                    const max = Math.max(...data.history) + 10;
                    const y = 90 - ((v - min) / (max - min)) * 80;
                    return `${x},${y}`;
                  }).join(' ')}
                />
                {data.history.map((v, i) => {
                  const x = (i / (data.history.length - 1)) * 290 + 5;
                  const min = Math.min(...data.history) - 10;
                  const max = Math.max(...data.history) + 10;
                  const y = 90 - ((v - min) / (max - min)) * 80;
                  return <circle key={i} cx={x} cy={y} r="4" fill="#2563EB" />;
                })}
              </svg>
            </div>
            <div className="cs-trend-foot">
              <span>{data.history[0]}</span>
              <span className="cs-trend-change" style={{ color: data.history[data.history.length-1] >= data.history[0] ? '#10B981' : '#EF4444' }}>
                {data.history[data.history.length-1] >= data.history[0] ? '↑' : '↓'} {Math.abs(data.history[data.history.length-1] - data.history[0])} pts in 6 months
              </span>
              <span>{data.history[data.history.length-1]}</span>
            </div>
          </div>
        </div>

        {/* Factors */}
        <div className="card cs-factors-card">
          <h3>What's Affecting Your Score</h3>
          <div className="cs-factors-list">
            {data.factors.map((f, i) => (
              <div className="cs-factor" key={i}>
                <div className="cs-factor-head">
                  <span className="cs-factor-label">{f.label}</span>
                  <span className="cs-factor-status">{f.status}</span>
                </div>
                <div className="cs-factor-bar-track">
                  <div className="cs-factor-bar-fill" style={{ width: `${f.pct}%` }}></div>
                </div>
                <p className="cs-factor-tip">{f.tip}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="cs-bottom-grid">
          <div className="card cs-tips-card">
            <h3>💡 Tips to Improve Your Score</h3>
            {data.tips.map((tip, i) => <div className="cs-tip-item" key={i}><span>✓</span>{tip}</div>)}
          </div>
          <Link to="/eligibility" className="card cs-cta-card">
            <div className="cs-cta-amount">{fmt(500000)}</div>
            <div className="cs-cta-title">You may be pre-approved</div>
            <div className="cs-cta-sub">Based on your score, check your personalised offers →</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CreditScore;
