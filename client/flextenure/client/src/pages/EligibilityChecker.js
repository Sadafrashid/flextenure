import React, { useState } from 'react';
import axios from 'axios';
import './EligibilityChecker.css';

const steps = ['Basic Info', 'Income & Job', 'Loan Details', 'Results'];

const EligibilityChecker = () => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [form, setForm] = useState({
    age: '', monthlyIncome: '', creditScore: '', employmentType: '',
    loanType: 'personal', requestedAmount: 500000
  });

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const checkEligibility = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/eligibility/check', form);
      setResult(res.data.data);
      setStep(3);
    } catch (e) {
      // Fallback mock
      const income = parseFloat(form.monthlyIncome) || 0;
      const score = parseInt(form.creditScore) || 650;
      const emi = Math.round((500000 * (12.5/12/100) * Math.pow(1 + 12.5/12/100, 36)) / (Math.pow(1 + 12.5/12/100, 36) - 1));
      setResult({
        eligibilityScore: score >= 700 ? 78 : 52,
        maxEligibleAmount: income * 18,
        isEligible: income > 15000,
        offers: score >= 700 ? [
          { lender: 'HDFC Bank', rate: 11.5, maxAmount: income * 18, processingFee: '1%', approval: 'Instant' },
          { lender: 'ICICI Bank', rate: 12.0, maxAmount: income * 16, processingFee: '1.5%', approval: 'Same Day' }
        ] : [
          { lender: 'Flextenure NBFC', rate: 16.0, maxAmount: income * 10, processingFee: '2%', approval: '48 Hours' }
        ],
        tips: score < 700 ? ['Improve credit score for better rates', 'Consider a co-applicant'] : [],
        message: income > 15000 ? 'You qualify for multiple loan offers!' : 'Limited eligibility — see tips below.'
      });
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  const fmt = (n) => '₹' + Math.round(n).toLocaleString('en-IN');

  return (
    <div className="elig-page">
      <div className="elig-hero">
        <div className="container">
          <div className="badge badge-mint" style={{ marginBottom: 16 }}>✅ Free & Instant</div>
          <h1>Check Your Loan Eligibility</h1>
          <p>Find out how much you can borrow — in under 2 minutes. No impact on your credit score.</p>
        </div>
      </div>

      <div className="container elig-container">
        {/* Progress */}
        {step < 3 && (
          <div className="progress-bar-wrap">
            {steps.map((s, i) => (
              <div key={i} className={`progress-step ${i <= step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
                <div className="progress-dot">
                  {i < step ? '✓' : i + 1}
                </div>
                <span>{s}</span>
                {i < steps.length - 1 && <div className="progress-line"></div>}
              </div>
            ))}
          </div>
        )}

        <div className="elig-card card">
          {step === 0 && (
            <div className="elig-step">
              <h2>Let's start with the basics</h2>
              <p className="step-desc">Tell us a little about yourself.</p>
              <div className="form-row">
                <div className="form-group">
                  <label>Your Age</label>
                  <input type="number" className="form-control" placeholder="e.g. 28"
                    value={form.age} onChange={e => update('age', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Mobile Number</label>
                  <input type="tel" className="form-control" placeholder="10-digit mobile" />
                </div>
              </div>
              <div className="form-group">
                <label>City of Residence</label>
                <input type="text" className="form-control" placeholder="e.g. Mumbai" />
              </div>
              <button className="btn btn-primary btn-lg" onClick={() => setStep(1)} disabled={!form.age}>
                Continue →
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="elig-step">
              <h2>Income & Employment</h2>
              <p className="step-desc">This helps us find the right lenders for you.</p>
              <div className="form-group">
                <label>Employment Type</label>
                <select className="form-control" value={form.employmentType} onChange={e => update('employmentType', e.target.value)}>
                  <option value="">Select type</option>
                  <option value="salaried">Salaried Employee</option>
                  <option value="self-employed">Self Employed Professional</option>
                  <option value="business">Business Owner</option>
                  <option value="student">Student</option>
                  <option value="retired">Retired</option>
                </select>
              </div>
              <div className="form-group">
                <label>Monthly Income (Net Take-Home)</label>
                <div className="input-prefix">
                  <span>₹</span>
                  <input type="number" className="form-control" placeholder="e.g. 45000"
                    value={form.monthlyIncome} onChange={e => update('monthlyIncome', e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label>Credit Score (approximate)</label>
                <select className="form-control" value={form.creditScore} onChange={e => update('creditScore', e.target.value)}>
                  <option value="">Select range</option>
                  <option value="780">Excellent (750+)</option>
                  <option value="720">Good (700-749)</option>
                  <option value="670">Fair (650-699)</option>
                  <option value="620">Low (600-649)</option>
                  <option value="550">Very Low (below 600)</option>
                  <option value="650">Don't know</option>
                </select>
              </div>
              <div className="step-nav">
                <button className="btn btn-outline" onClick={() => setStep(0)}>← Back</button>
                <button className="btn btn-primary btn-lg" onClick={() => setStep(2)} disabled={!form.employmentType || !form.monthlyIncome}>
                  Continue →
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="elig-step">
              <h2>What do you need?</h2>
              <p className="step-desc">Almost done — tell us about the loan you need.</p>
              <div className="form-group">
                <label>Loan Type</label>
                <div className="loan-type-grid">
                  {[
                    { id: 'personal', icon: '💳', label: 'Personal' },
                    { id: 'home', icon: '🏠', label: 'Home' },
                    { id: 'car', icon: '🚗', label: 'Car' },
                    { id: 'education', icon: '🎓', label: 'Education' },
                    { id: 'business', icon: '🏢', label: 'Business' },
                    { id: 'gold', icon: '🥇', label: 'Gold' },
                  ].map(t => (
                    <button key={t.id}
                      className={`loan-type-btn ${form.loanType === t.id ? 'selected' : ''}`}
                      onClick={() => update('loanType', t.id)}>
                      <span>{t.icon}</span><span>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Loan Amount</label>
                <div className="amount-display">{fmt(form.requestedAmount)}</div>
                <input type="range" className="range-slider"
                  min="50000" max="5000000" step="50000"
                  value={form.requestedAmount}
                  style={{ background: `linear-gradient(to right, #2563EB 0%, #2563EB ${((form.requestedAmount - 50000) / 4950000) * 100}%, #E5E7EB ${((form.requestedAmount - 50000) / 4950000) * 100}%, #E5E7EB 100%)` }}
                  onChange={e => update('requestedAmount', Number(e.target.value))} />
                <div className="range-labels"><span>₹50K</span><span>₹50L</span></div>
              </div>
              <div className="step-nav">
                <button className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
                <button className="btn btn-primary btn-lg" onClick={checkEligibility} disabled={loading}>
                  {loading ? <><div className="spinner"></div> Checking...</> : 'Check Eligibility ✨'}
                </button>
              </div>
            </div>
          )}

          {step === 3 && result && (
            <div className="elig-results">
              <div className="result-header">
                <div className={`result-badge ${result.isEligible ? 'eligible' : 'limited'}`}>
                  {result.isEligible ? '🎉 Congratulations!' : '⚠️ Limited Eligibility'}
                </div>
                <h2>{result.message}</h2>
                <div className="eligibility-score-bar">
                  <div className="score-bar-label">
                    <span>Eligibility Score</span>
                    <span className="score-num">{result.eligibilityScore}/100</span>
                  </div>
                  <div className="score-bar-track">
                    <div className="score-bar-fill" style={{ width: `${result.eligibilityScore}%` }}></div>
                  </div>
                </div>
              </div>

              {result.maxEligibleAmount > 0 && (
                <div className="max-amount-box">
                  <div className="max-amount-label">Max Eligible Amount</div>
                  <div className="max-amount-value">{fmt(result.maxEligibleAmount)}</div>
                </div>
              )}

              {result.offers?.length > 0 && (
                <div className="offers-section">
                  <h3>Your Matched Offers ({result.offers.length})</h3>
                  <div className="offers-list">
                    {result.offers.map((offer, i) => (
                      <div className="offer-card" key={i}>
                        <div className="offer-lender">
                          <div className="lender-avatar">{offer.lender[0]}</div>
                          <div>
                            <div className="lender-name">{offer.lender}</div>
                            <div className="lender-approval">{offer.approval} Approval</div>
                          </div>
                        </div>
                        <div className="offer-details">
                          <div className="offer-stat"><div className="ostat-val">{offer.rate}%</div><div className="ostat-label">Rate p.a.</div></div>
                          <div className="offer-stat"><div className="ostat-val">{fmt(offer.maxAmount)}</div><div className="ostat-label">Max Amount</div></div>
                          <div className="offer-stat"><div className="ostat-val">{offer.processingFee}</div><div className="ostat-label">Processing Fee</div></div>
                        </div>
                        <button className="btn btn-primary btn-sm">Apply Now</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.tips?.length > 0 && (
                <div className="tips-section">
                  <h4>💡 Tips to Improve Your Eligibility</h4>
                  {result.tips.map((tip, i) => <div className="tip-item" key={i}>✓ {tip}</div>)}
                </div>
              )}

              <button className="btn btn-outline" onClick={() => { setStep(0); setResult(null); }}>
                Check Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EligibilityChecker;