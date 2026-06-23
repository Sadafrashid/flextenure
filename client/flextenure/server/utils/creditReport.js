// Derives a deterministic credit report (history, factor breakdown, tips)
// from a user's stored score, so the same user sees consistent numbers
// on every request rather than something that reshuffles on refresh.

// Simple deterministic pseudo-random generator seeded by a string,
// used only to add believable per-user variation — not for security.
const seededRandom = (seed) => {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h << 5) - h + seed.charCodeAt(i);
    h |= 0;
  }
  return () => {
    h = (h * 9301 + 49297) % 233280;
    return h / 233280;
  };
};

const statusForPct = (pct) => {
  if (pct >= 85) return 'Excellent';
  if (pct >= 65) return 'Good';
  if (pct >= 45) return 'Fair';
  return 'Needs Work';
};

const buildCreditReport = (score, userId) => {
  const rand = seededRandom(String(userId));
  const basePct = Math.round(((score - 300) / (900 - 300)) * 100);

  const factorDefs = [
    { label: 'Payment History', tip: 'On-time payments are the single biggest factor in your score.', offset: 6 },
    { label: 'Credit Utilization', tip: 'Keep your credit card usage under 30% of your total limit.', offset: -8 },
    { label: 'Credit Age', tip: 'Older accounts in good standing help your score over time.', offset: -12 },
    { label: 'Credit Mix', tip: 'A healthy mix of loans and cards shows you can manage credit responsibly.', offset: 2 },
    { label: 'Hard Inquiries', tip: 'Too many loan or card applications in a short time can lower your score.', offset: 10 },
  ];

  const factors = factorDefs.map((f) => {
    const jitter = Math.round((rand() - 0.5) * 10);
    const pct = Math.max(5, Math.min(99, basePct + f.offset + jitter));
    return { label: f.label, status: statusForPct(pct), pct, tip: f.tip };
  });

  // Build a 6-month history that ends at the current score with a
  // gentle, plausible upward/downward drift.
  const history = [];
  let running = score - Math.round(rand() * 30 + 10);
  for (let i = 0; i < 5; i++) {
    history.push(Math.max(300, Math.min(900, running)));
    running += Math.round(rand() * 14 - 2);
  }
  history.push(score);

  const weakest = [...factors].sort((a, b) => a.pct - b.pct)[0];
  const tips = [
    weakest ? `Focus on "${weakest.label}" — it's currently your weakest factor.` : null,
    'Keep credit card utilization below 30% of your limit',
    'Avoid applying for multiple loans in a short span',
    'Set up auto-pay so you never miss a due date',
    'Keep old credit accounts open to build credit age',
  ].filter(Boolean);

  return { score, history, factors, tips };
};

module.exports = buildCreditReport;
