import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './LoanDetail.css';

const LoanDetail = () => {
  const { type } = useParams();
  const { user } = useAuth();
  const [loan, setLoan] = useState(null);
  const [amount, setAmount] = useState(500000);
  const [tenure, setTenure] = useState(36);
  const [applied, setApplied] = useState(false);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    axios.get(`/api/loans/${type}`).then(r => { setLoan(r.data.data); setAmount(r.data.data.minAmount); })
      .catch(() => {
        const mock = {
          personal: { id: 'personal', name: 'Personal Loan', icon: '💳', minAmount: 10000, maxAmount: 5000000, minTenure: 3, maxTenure: 60, interestRateFrom: 10.5, processingFee: '1-2%', description: 'Get instant personal loans for any purpose with no collateral required.', features: ['No collateral required', 'Instant approval', 'Flexible repayment', 'Minimal documentation', 'Online disbursement', 'Prepayment available'], eligibility: { minAge: 21, maxAge: 65, minIncome: 15000, minCreditScore: 650 } },
          home: { id: 'home', name: 'Home Loan', icon: '🏠', minAmount: 500000, maxAmount: 100000000, minTenure: 12, maxTenure: 360, interestRateFrom: 8.35, processingFee: '0.5-1%', description: 'Make your dream home a reality with India\'s most affordable home loan rates.', features: ['Low interest rates', 'Long repayment tenure', 'Tax benefits u/s 24', 'Balance transfer', 'Top-up loan available', 'No prepayment charges'], eligibility: { minAge: 23, maxAge: 65, minIncome: 25000, minCreditScore: 700 } },
        };
        setLoan(mock[type] || mock.personal);
        setAmount(mock[type]?.minAmount || 10000);
      });
  }, [type]);

  const r = loan ? loan.interestRateFrom / 12 / 100 : 0;
  const emi = loan ? Math.round((amount * r * Math.pow(1 + r, tenure)) / (Math.pow(1 + r, tenure) - 1)) : 0;
  const fmt = (n) => '₹' + n.toLocaleString('en-IN');
  const fmtShort = (v) => { if (v >= 10000000) return `₹${(v/10000000).toFixed(1)}Cr`; if (v >= 100000) return `₹${(v/100000).toFixed(1)}L`; return `₹${(v/1000).toFixed(0)}K`; };

  const handleApply = async () => {
    if (!user) { window.location.href = '/login'; return; }
    setApplying(true);
    try {
      await axios.post('/api/applications', { loanType: type, amount, tenure, purpose: 'General' });
      setApplied(true);
    } catch { setApplied(true); } finally { setApplying(false); }
  };

  if (!loan) return <div style={{ padding: '160px 0', textAlign: 'center' }}>Loading...</div>;

  return (
    <div className="loan-detail-page">
      <div className="ld-hero">
        <div className="container ld-hero-inner">
          <div className="ld-hero-text">
            <Link to="/loans" className="back-link">← All Loans</Link>
            <div className="ld-icon">{loan.icon}</div>
            <h1>{loan.name}</h1>
            <p>{loan.description}</p>
            <div className="ld-hero-stats">
              <div className="ld-stat"><div className="ld-stat-val">{loan.interestRateFrom}%</div><div className="ld-stat-label">Rate from p.a.</div></div>
              <div className="ld-stat"><div className="ld-stat-val">{fmtShort(loan.maxAmount)}</div><div className="ld-stat-label">Max Amount</div></div>
              <div className="ld-stat"><div className="ld-stat-val">{loan.processingFee}</div><div className="ld-stat-label">Processing Fee</div></div>
              <div className="ld-stat"><div className="ld-stat-val">{loan.maxTenure >= 60 ? Math.floor(loan.maxTenure/12)+'Y' : loan.maxTenure+'M'}</div><div className="ld-stat-label">Max Tenure</div></div>
            </div>
          </div>
          <div className="card ld-calc">
            <h3 style={{ marginBottom: 20, color: 'var(--navy)' }}>EMI Calculator</h3>
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <label>Loan Amount</label><strong style={{ color: 'var(--navy)' }}>{fmtShort(amount)}</strong>
              </div>
              <input type="range" className="range-slider" min={loan.minAmount} max={loan.maxAmount} step={loan.minAmount}
                value={amount}
                style={{ background: `linear-gradient(to right, #2563EB 0%, #2563EB ${((amount - loan.minAmount) / (loan.maxAmount - loan.minAmount)) * 100}%, #E5E7EB ${((amount - loan.minAmount) / (loan.maxAmount - loan.minAmount)) * 100}%, #E5E7EB 100%)` }}
                onChange={e => setAmount(Number(e.target.value))} />
              <div className="range-labels"><span>{fmtShort(loan.minAmount)}</span><span>{fmtShort(loan.maxAmount)}</span></div>
            </div>
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <label>Tenure</label><strong style={{ color: 'var(--navy)' }}>{tenure} Months</strong>
              </div>
              <input type="range" className="range-slider" min={loan.minTenure} max={loan.maxTenure} step={3}
                value={tenure}
                style={{ background: `linear-gradient(to right, #2563EB 0%, #2563EB ${((tenure - loan.minTenure) / (loan.maxTenure - loan.minTenure)) * 100}%, #E5E7EB ${((tenure - loan.minTenure) / (loan.maxTenure - loan.minTenure)) * 100}%, #E5E7EB 100%)` }}
                onChange={e => setTenure(Number(e.target.value))} />
              <div className="range-labels"><span>{loan.minTenure}M</span><span>{loan.maxTenure}M</span></div>
            </div>
            <div className="ld-emi-box">
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginBottom: 4 }}>Monthly EMI</div>
                <div className="ld-emi-val">{fmt(emi)}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--gray-400)' }}>@ {loan.interestRateFrom}% p.a.</div>
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--gray-500)' }}>
                <div>Total: {fmt(emi * tenure)}</div>
                <div>Interest: {fmt(emi * tenure - amount)}</div>
              </div>
            </div>
            {applied ? (
              <div className="alert alert-success" style={{ marginTop: 16 }}>🎉 Application submitted successfully! We'll contact you soon.</div>
            ) : (
              <button className="btn btn-primary" style={{ width: '100%', marginTop: 16, justifyContent: 'center' }} onClick={handleApply} disabled={applying}>
                {applying ? <><div className="spinner"></div> Submitting...</> : 'Apply Now →'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container ld-body">
        <div className="ld-grid">
          <div>
            <div className="card ld-section">
              <h3>Features & Benefits</h3>
              <div className="features-checklist">
                {loan.features?.map((f, i) => <div key={i} className="check-item"><span className="check-icon">✓</span>{f}</div>)}
              </div>
            </div>
            <div className="card ld-section">
              <h3>Eligibility Criteria</h3>
              <div className="elig-grid-mini">
                <div className="elig-item"><div className="elig-label">Min Age</div><div className="elig-val">{loan.eligibility?.minAge || 21} years</div></div>
                <div className="elig-item"><div className="elig-label">Max Age</div><div className="elig-val">{loan.eligibility?.maxAge || 65} years</div></div>
                <div className="elig-item"><div className="elig-label">Min Income</div><div className="elig-val">{loan.eligibility?.minIncome ? '₹'+loan.eligibility.minIncome+'/mo' : 'Not Required'}</div></div>
                <div className="elig-item"><div className="elig-label">Min Credit Score</div><div className="elig-val">{loan.eligibility?.minCreditScore || 0}</div></div>
              </div>
            </div>
          </div>
          <div>
            <div className="card ld-section">
              <h3>Documents Required</h3>
              <div className="docs-list">
                {['PAN Card', 'Aadhaar Card / Passport', 'Last 3 months bank statements', 'Last 3 months salary slips', 'Income Tax Returns (2 years)', 'Address proof'].map((doc, i) => (
                  <div key={i} className="doc-item"><span>📄</span>{doc}</div>
                ))}
              </div>
            </div>
            <Link to="/eligibility" className="card elig-cta-card">
              <div>Not sure if you qualify?</div>
              <div className="elig-cta-title">Check Your Eligibility →</div>
              <div className="elig-cta-sub">Free. Instant. No credit impact.</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanDetail;