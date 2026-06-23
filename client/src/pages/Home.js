import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

const statsData = [
  { value: '50L+', label: 'Happy Customers' },
  { value: '₹10,000Cr+', label: 'Loans Disbursed' },
  { value: '30+', label: 'Lending Partners' },
  { value: '4.8★', label: 'App Rating' },
];

const loanTypes = [
  { id: 'personal', icon: '💳', name: 'Personal Loan', desc: 'Up to ₹50 Lakhs', rate: '10.5%', color: '#2563EB' },
  { id: 'home', icon: '🏠', name: 'Home Loan', desc: 'Up to ₹10 Crores', rate: '8.35%', color: '#10B981' },
  { id: 'car', icon: '🚗', name: 'Car Loan', desc: 'Up to ₹1 Crore', rate: '8.7%', color: '#F59E0B' },
  { id: 'education', icon: '🎓', name: 'Education Loan', desc: 'Up to ₹1.5 Crores', rate: '9.0%', color: '#8B5CF6' },
  { id: 'business', icon: '🏢', name: 'Business Loan', desc: 'Up to ₹5 Crores', rate: '11.0%', color: '#EF4444' },
  { id: 'gold', icon: '🥇', name: 'Gold Loan', desc: 'Instant disbursal', rate: '7.5%', color: '#F59E0B' },
];

const howItWorks = [
  { icon: '📋', title: 'Check Eligibility', desc: 'Answer a few quick questions to see your loan eligibility in seconds.' },
  { icon: '🤝', title: 'Compare Offers', desc: 'We match you with the best offers from 30+ verified lenders.' },
  { icon: '📄', title: 'Upload Documents', desc: 'Simple digital upload — no need to visit any branch.' },
  { icon: '💰', title: 'Get Disbursed', desc: 'Money in your account within hours of approval.' },
];

const testimonials = [
  { name: 'Rahul Sharma', city: 'Mumbai', rating: 5, text: 'Got my personal loan approved in 4 hours! The process was completely online and transparent. Flextenure is amazing.', loan: 'Personal Loan • ₹3L' },
  { name: 'Priya Menon', city: 'Bengaluru', rating: 5, text: 'Best platform for home loans. Compared 12 lenders in one place and saved ₹45,000 in interest. Highly recommend!', loan: 'Home Loan • ₹60L' },
  { name: 'Amit Verma', city: 'Delhi', rating: 5, text: 'My credit score was 680 and they still found me a good deal. The eligibility checker is really helpful.', loan: 'Car Loan • ₹8L' },
];

const Home = () => {
  const [heroAmount, setHeroAmount] = useState(500000);
  const [heroTenure, setHeroTenure] = useState(36);
  const [heroEMI, setHeroEMI] = useState(null);

  useEffect(() => {
    const r = 12.5 / 12 / 100;
    const emi = Math.round((heroAmount * r * Math.pow(1 + r, heroTenure)) / (Math.pow(1 + r, heroTenure) - 1));
    setHeroEMI(emi);
  }, [heroAmount, heroTenure]);

  const formatAmount = (val) => {
    if (val >= 10000000) return `₹${(val/10000000).toFixed(1)}Cr`;
    if (val >= 100000) return `₹${(val/100000).toFixed(1)}L`;
    return `₹${(val/1000).toFixed(0)}K`;
  };

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-gradient"></div>
          <div className="hero-dots"></div>
        </div>
        <div className="container hero-inner">
          <div className="hero-content fade-up">
            <div className="badge badge-blue hero-badge">🚀 India's #1 Loan Marketplace</div>
            <h1 className="hero-title">
              The Smarter Way to<br />
              <span className="hero-highlight">Borrow Money</span>
            </h1>
            <p className="hero-subtitle">
              Compare loans from 30+ top banks & NBFCs. Get the best rates, instant approval, and money in your account — all online.
            </p>
            <div className="hero-cta">
              <Link to="/eligibility" className="btn btn-primary btn-lg">Check My Eligibility</Link>
              <Link to="/emi-calculator" className="btn btn-white btn-lg">Calculate EMI</Link>
            </div>
          </div>

          <div className="hero-widget card fade-up fade-up-delay-2">
            <div className="widget-header">
              <span className="widget-title">Quick EMI Estimate</span>
              <span className="badge badge-mint">Personal Loan</span>
            </div>
            <div className="widget-body">
              <div className="form-group">
                <label>Loan Amount</label>
                <div className="range-val">{formatAmount(heroAmount)}</div>
                <input
                  type="range" className="range-slider"
                  min="50000" max="5000000" step="50000"
                  value={heroAmount}
                  style={{ background: `linear-gradient(to right, #2563EB 0%, #2563EB ${((heroAmount - 50000) / 4950000) * 100}%, #E5E7EB ${((heroAmount - 50000) / 4950000) * 100}%, #E5E7EB 100%)` }}
                  onChange={e => setHeroAmount(Number(e.target.value))}
                />
                <div className="range-labels"><span>₹50K</span><span>₹50L</span></div>
              </div>
              <div className="form-group">
                <label>Tenure</label>
                <div className="range-val">{heroTenure} Months</div>
                <input
                  type="range" className="range-slider"
                  min="6" max="60" step="6"
                  value={heroTenure}
                  style={{ background: `linear-gradient(to right, #2563EB 0%, #2563EB ${((heroTenure - 6) / 54) * 100}%, #E5E7EB ${((heroTenure - 6) / 54) * 100}%, #E5E7EB 100%)` }}
                  onChange={e => setHeroTenure(Number(e.target.value))}
                />
                <div className="range-labels"><span>6M</span><span>60M</span></div>
              </div>
              <div className="emi-result">
                <div>
                  <div className="emi-label">Est. Monthly EMI</div>
                  <div className="emi-value">₹{heroEMI?.toLocaleString('en-IN')}</div>
                  <div className="emi-note">@ 12.5% p.a. (indicative)</div>
                </div>
                <Link to="/eligibility" className="btn btn-primary">Apply Now →</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-stats">
          <div className="container">
            <div className="stats-grid">
              {statsData.map((s, i) => (
                <div className="stat-item" key={i}>
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Loan Products */}
      <section className="section loan-products">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">Products</div>
            <h2 className="section-title">Loans for Every Need</h2>
            <p className="section-subtitle">From personal loans to home loans — we have the right product for every life stage.</p>
          </div>
          <div className="loans-grid">
            {loanTypes.map(loan => (
              <Link to={`/loans/${loan.id}`} className="loan-card card" key={loan.id}>
                <div className="loan-card-icon" style={{ background: loan.color + '15' }}>
                  <span>{loan.icon}</span>
                </div>
                <div className="loan-card-body">
                  <h3>{loan.name}</h3>
                  <p>{loan.desc}</p>
                </div>
                <div className="loan-card-rate">
                  <span>From {loan.rate}</span>
                  <span className="loan-card-arrow">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="section how-it-works">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">Process</div>
            <h2 className="section-title">Get a Loan in 4 Easy Steps</h2>
          </div>
          <div className="steps-grid">
            {howItWorks.map((step, i) => (
              <div className="step-card" key={i}>
                <div className="step-number">{String(i + 1).padStart(2, '0')}</div>
                <div className="step-icon">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Flextenure */}
      <section className="section why-us">
        <div className="container">
          <div className="why-us-inner">
            <div className="why-us-content">
              <div className="section-eyebrow">Why Choose Us</div>
              <h2 className="section-title" style={{ textAlign: 'left' }}>Built Around Your Financial Journey</h2>
              <p style={{ color: 'var(--gray-500)', marginBottom: 32 }}>We're not just a loan app. We're your financial partner — helping you borrow smartly, repay comfortably, and build a stronger credit profile.</p>
              <div className="features-list">
                {[
                  { icon: '⚡', title: 'Instant Approval', desc: 'Get in-principle approval in under 2 minutes' },
                  { icon: '🔍', title: 'Zero Impact on Credit', desc: 'Soft inquiry only — checking eligibility won\'t hurt your score' },
                  { icon: '🤝', title: '30+ Lending Partners', desc: 'We work with India\'s top banks and NBFCs' },
                  { icon: '🔒', title: '100% Secure', desc: 'Bank-grade 256-bit encryption on all data' },
                  { icon: '📱', title: 'Fully Digital', desc: 'No branch visits — do everything from your phone' },
                  { icon: '🆓', title: 'Completely Free', desc: 'No fees to compare offers or check eligibility' },
                ].map((f, i) => (
                  <div className="feature-item" key={i}>
                    <div className="feature-icon">{f.icon}</div>
                    <div>
                      <strong>{f.title}</strong>
                      <p>{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/eligibility" className="btn btn-primary">Start Your Journey →</Link>
            </div>
            <div className="why-us-visual">
              <div className="score-card card">
                <div className="score-header">Your Credit Health</div>
                <div className="score-dial">
                  <svg viewBox="0 0 200 120" width="200">
                    <path d="M 20 100 A 80 80 0 0 1 180 100" stroke="#E5E7EB" strokeWidth="16" fill="none" strokeLinecap="round"/>
                    <path d="M 20 100 A 80 80 0 0 1 152 38" stroke="url(#scoreGrad)" strokeWidth="16" fill="none" strokeLinecap="round"/>
                    <defs>
                      <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#EF4444"/>
                        <stop offset="50%" stopColor="#F59E0B"/>
                        <stop offset="100%" stopColor="#10B981"/>
                      </linearGradient>
                    </defs>
                    <text x="100" y="92" textAnchor="middle" fontSize="28" fontWeight="800" fill="#0A1628">742</text>
                    <text x="100" y="108" textAnchor="middle" fontSize="10" fill="#6B7280">GOOD SCORE</text>
                  </svg>
                </div>
                <div className="score-actions">
                  <div className="score-tip">✅ Eligible for best rates</div>
                  <Link to="/credit-score" className="btn btn-outline btn-sm">View Full Report</Link>
                </div>
              </div>
              <div className="offer-mini-card card">
                <div className="offer-mini-header">🎉 Pre-approved Offer</div>
                <div className="offer-mini-amount">₹5,00,000</div>
                <div className="offer-mini-details">
                  <span>@ 11.5% p.a.</span>
                  <span>EMI ₹10,877/mo</span>
                </div>
                <div className="offer-mini-lender">HDFC Bank • 48 months</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section testimonials">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">Reviews</div>
            <h2 className="section-title">What Our Customers Say</h2>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div className="testimonial-card card" key={i}>
                <div className="testimonial-rating">{'⭐'.repeat(t.rating)}</div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{t.name[0]}</div>
                  <div>
                    <div className="author-name">{t.name}</div>
                    <div className="author-city">{t.city} · {t.loan}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="container">
          <div className="cta-inner">
            <div>
              <h2>Ready to Get Your Loan?</h2>
              <p>Check eligibility for free. No impact on your credit score.</p>
            </div>
            <div className="cta-actions">
              <Link to="/eligibility" className="btn btn-white btn-lg">Check Eligibility</Link>
              <Link to="/register" className="btn btn-mint btn-lg">Create Free Account</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;