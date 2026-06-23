import React, { useState, useEffect } from 'react';
import './EMICalculator.css';

const EMICalculator = () => {
  const [amount, setAmount] = useState(500000);
  const [rate, setRate] = useState(12.5);
  const [tenure, setTenure] = useState(36);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const r = rate / 12 / 100;
    const n = tenure;
    const emi = Math.round((amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
    const total = emi * n;
    const interest = total - amount;
    setResult({ emi, total, interest });
  }, [amount, rate, tenure]);

  const fmt = (n) => '₹' + n.toLocaleString('en-IN');
  const fmtShort = (v) => {
    if (v >= 10000000) return `₹${(v/10000000).toFixed(1)}Cr`;
    if (v >= 100000) return `₹${(v/100000).toFixed(1)}L`;
    return `₹${(v/1000).toFixed(0)}K`;
  };

  const principalPct = result ? Math.round((amount / result.total) * 100) : 0;
  const interestPct = 100 - principalPct;

  return (
    <div className="emi-page">
      <div className="emi-hero">
        <div className="container">
          <div className="badge badge-blue" style={{ marginBottom: 16 }}>🧮 Financial Tools</div>
          <h1>EMI Calculator</h1>
          <p>Plan your loan repayments. Adjust the sliders to see real-time results.</p>
        </div>
      </div>
      <div className="container emi-container">
        <div className="emi-grid">
          {/* Controls */}
          <div className="card emi-controls">
            <h3 className="controls-title">Loan Details</h3>

            <div className="form-group">
              <div className="control-header">
                <label>Loan Amount</label>
                <span className="control-val">{fmtShort(amount)}</span>
              </div>
              <input type="range" className="range-slider" min="10000" max="10000000" step="10000"
                value={amount}
                style={{ background: `linear-gradient(to right, #2563EB 0%, #2563EB ${((amount - 10000) / 9990000) * 100}%, #E5E7EB ${((amount - 10000) / 9990000) * 100}%, #E5E7EB 100%)` }}
                onChange={e => setAmount(Number(e.target.value))} />
              <div className="range-labels"><span>₹10K</span><span>₹1Cr</span></div>
            </div>

            <div className="form-group">
              <div className="control-header">
                <label>Interest Rate (p.a.)</label>
                <span className="control-val">{rate}%</span>
              </div>
              <input type="range" className="range-slider" min="7" max="30" step="0.25"
                value={rate}
                style={{ background: `linear-gradient(to right, #2563EB 0%, #2563EB ${((rate - 7) / 23) * 100}%, #E5E7EB ${((rate - 7) / 23) * 100}%, #E5E7EB 100%)` }}
                onChange={e => setRate(Number(e.target.value))} />
              <div className="range-labels"><span>7%</span><span>30%</span></div>
            </div>

            <div className="form-group">
              <div className="control-header">
                <label>Loan Tenure</label>
                <span className="control-val">{tenure} Months ({Math.floor(tenure/12)}y {tenure%12}m)</span>
              </div>
              <input type="range" className="range-slider" min="3" max="360" step="3"
                value={tenure}
                style={{ background: `linear-gradient(to right, #2563EB 0%, #2563EB ${((tenure - 3) / 357) * 100}%, #E5E7EB ${((tenure - 3) / 357) * 100}%, #E5E7EB 100%)` }}
                onChange={e => setTenure(Number(e.target.value))} />
              <div className="range-labels"><span>3M</span><span>30Y</span></div>
            </div>

            <div className="quick-rates">
              <div className="quick-rates-title">Quick Rate Select:</div>
              <div className="quick-rate-chips">
                {[{ label: 'Personal', rate: 12.5 }, { label: 'Home', rate: 8.5 }, { label: 'Car', rate: 9.0 }, { label: 'Gold', rate: 7.5 }].map(r => (
                  <button key={r.label} className={`rate-chip ${rate === r.rate ? 'active' : ''}`} onClick={() => setRate(r.rate)}>
                    {r.label} ({r.rate}%)
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="emi-results">
            {result && (
              <>
                <div className="card emi-main-result">
                  <div className="emi-primary">
                    <div className="emi-primary-label">Monthly EMI</div>
                    <div className="emi-primary-value">{fmt(result.emi)}</div>
                  </div>
                  <div className="emi-breakdown">
                    <div className="breakdown-item">
                      <div className="breakdown-dot" style={{ background: '#2563EB' }}></div>
                      <div>
                        <div className="breakdown-label">Principal Amount</div>
                        <div className="breakdown-value">{fmt(amount)}</div>
                      </div>
                      <div className="breakdown-pct">{principalPct}%</div>
                    </div>
                    <div className="breakdown-item">
                      <div className="breakdown-dot" style={{ background: '#F59E0B' }}></div>
                      <div>
                        <div className="breakdown-label">Total Interest</div>
                        <div className="breakdown-value">{fmt(result.interest)}</div>
                      </div>
                      <div className="breakdown-pct">{interestPct}%</div>
                    </div>
                    <div className="breakdown-item total-row">
                      <div className="breakdown-dot" style={{ background: 'var(--navy)' }}></div>
                      <div>
                        <div className="breakdown-label">Total Payable</div>
                        <div className="breakdown-value">{fmt(result.total)}</div>
                      </div>
                      <div className="breakdown-pct">100%</div>
                    </div>
                  </div>

                  {/* Pie chart */}
                  <div className="pie-chart-container">
                    <svg viewBox="0 0 100 100" width="120" height="120">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#F59E0B" strokeWidth="20"/>
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#2563EB" strokeWidth="20"
                        strokeDasharray={`${principalPct * 2.513} 251.3`}
                        strokeDashoffset="0" transform="rotate(-90 50 50)"/>
                    </svg>
                    <div className="pie-legend">
                      <div><span style={{ background: '#2563EB' }}></span>Principal</div>
                      <div><span style={{ background: '#F59E0B' }}></span>Interest</div>
                    </div>
                  </div>
                </div>

                {/* Amortization preview */}
                <div className="card amortization-card">
                  <h4>Amortization Schedule (First 6 months)</h4>
                  <table className="amort-table">
                    <thead>
                      <tr><th>Month</th><th>EMI</th><th>Principal</th><th>Interest</th><th>Balance</th></tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: Math.min(6, tenure) }, (_, i) => {
                        const month = i + 1;
                        const r = rate / 12 / 100;
                        let balance = amount;
                        for (let j = 0; j < i; j++) {
                          const int = balance * r;
                          const prin = result.emi - int;
                          balance -= prin;
                        }
                        const int = balance * r;
                        const prin = result.emi - int;
                        return (
                          <tr key={month}>
                            <td>{month}</td>
                            <td>{fmt(result.emi)}</td>
                            <td className="text-blue">{fmt(Math.round(prin))}</td>
                            <td className="text-amber">{fmt(Math.round(int))}</td>
                            <td>{fmt(Math.round(balance - prin))}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EMICalculator;