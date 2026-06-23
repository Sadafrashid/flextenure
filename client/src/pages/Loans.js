import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Loans.css';

const Loans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/loans').then(res => { setLoans(res.data.data); setLoading(false); })
      .catch(() => {
        setLoans([
          { id: 'personal', name: 'Personal Loan', icon: '💳', minAmount: 10000, maxAmount: 5000000, interestRateFrom: 10.5, processingFee: '1-2%', description: 'Get instant personal loans for any purpose', features: ['No collateral required', 'Instant approval', 'Flexible repayment', 'Minimal documentation'] },
          { id: 'home', name: 'Home Loan', icon: '🏠', minAmount: 500000, maxAmount: 100000000, interestRateFrom: 8.35, processingFee: '0.5-1%', description: 'Make your dream home a reality with affordable rates', features: ['Low interest rates', 'Long repayment tenure', 'Tax benefits', 'Balance transfer available'] },
          { id: 'car', name: 'Car Loan', icon: '🚗', minAmount: 100000, maxAmount: 10000000, interestRateFrom: 8.7, processingFee: '0.5-1.5%', description: 'Drive your dream car with easy EMIs', features: ['Up to 100% on-road funding', 'Quick disbursal', 'New & used cars', 'Flexible EMI options'] },
          { id: 'education', name: 'Education Loan', icon: '🎓', minAmount: 50000, maxAmount: 15000000, interestRateFrom: 9.0, processingFee: 'Nil', description: 'Invest in your future with education financing', features: ['Study in India & abroad', 'Moratorium period', 'Tax benefits under 80E', 'No collateral up to ₹7.5L'] },
          { id: 'business', name: 'Business Loan', icon: '🏢', minAmount: 50000, maxAmount: 50000000, interestRateFrom: 11.0, processingFee: '1-3%', description: 'Scale your business with flexible funding', features: ['Collateral free up to ₹50L', 'Quick disbursal', 'Online application', 'Multiple repayment options'] },
          { id: 'gold', name: 'Gold Loan', icon: '🥇', minAmount: 5000, maxAmount: 5000000, interestRateFrom: 7.5, processingFee: '0.5%', description: 'Unlock the value of your gold instantly', features: ['Instant approval', 'No income proof needed', 'Lowest interest rates', 'Safe gold storage'] },
        ]);
        setLoading(false);
      });
  }, []);

  const fmt = (n) => {
    if (n >= 10000000) return `₹${(n/10000000).toFixed(0)} Cr`;
    if (n >= 100000) return `₹${(n/100000).toFixed(0)} L`;
    return `₹${(n/1000).toFixed(0)}K`;
  };

  return (
    <div className="loans-page">
      <div className="loans-hero">
        <div className="container">
          <h1>All Loan Products</h1>
          <p>Compare and apply for loans tailored to your needs — all in one place.</p>
        </div>
      </div>
      <div className="container loans-container">
        {loading ? (
          <div className="loading-state">Loading loan products...</div>
        ) : (
          <div className="loans-list">
            {loans.map(loan => (
              <div className="loan-list-card card" key={loan.id}>
                <div className="llc-left">
                  <div className="llc-icon">{loan.icon}</div>
                  <div className="llc-info">
                    <h3>{loan.name}</h3>
                    <p>{loan.description}</p>
                    <div className="llc-features">
                      {loan.features.slice(0, 3).map((f, i) => (
                        <span key={i} className="feature-tag">✓ {f}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="llc-stats">
                  <div className="llc-stat">
                    <div className="llc-stat-val">{loan.interestRateFrom}%</div>
                    <div className="llc-stat-label">Rate from (p.a.)</div>
                  </div>
                  <div className="llc-stat">
                    <div className="llc-stat-val">{fmt(loan.maxAmount)}</div>
                    <div className="llc-stat-label">Max Amount</div>
                  </div>
                  <div className="llc-stat">
                    <div className="llc-stat-val">{loan.processingFee}</div>
                    <div className="llc-stat-label">Processing Fee</div>
                  </div>
                </div>
                <div className="llc-actions">
                  <Link to={`/loans/${loan.id}`} className="btn btn-primary">Apply Now</Link>
                  <Link to={`/loans/${loan.id}`} className="btn btn-outline btn-sm">Know More</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Loans;