// Core eligibility-scoring logic used by POST /api/eligibility/check.
// Kept as a pure function (no DB calls) so it's easy to unit test and reuse.

const LOAN_MULTIPLIER = {
  personal: 18,
  home: 60,
  car: 24,
  education: 30,
  business: 20,
  gold: 10,
};

const EMPLOYMENT_FACTOR = {
  salaried: 1.0,
  'self-employed': 0.85,
  business: 0.9,
  student: 0.4,
  retired: 0.6,
};

const LENDER_OFFERS = {
  excellent: [
    { lender: 'HDFC Bank', rate: 10.5, processingFee: '1%', approval: 'Instant' },
    { lender: 'ICICI Bank', rate: 10.75, processingFee: '1%', approval: 'Instant' },
    { lender: 'SBI', rate: 10.9, processingFee: '0.5%', approval: 'Same Day' },
  ],
  good: [
    { lender: 'HDFC Bank', rate: 11.5, processingFee: '1%', approval: 'Instant' },
    { lender: 'ICICI Bank', rate: 12.0, processingFee: '1.5%', approval: 'Same Day' },
    { lender: 'Axis Bank', rate: 12.25, processingFee: '1.5%', approval: 'Same Day' },
  ],
  fair: [
    { lender: 'IDFC First Bank', rate: 14.5, processingFee: '2%', approval: '24 Hours' },
    { lender: 'Bajaj Finserv', rate: 15.0, processingFee: '2.5%', approval: '24 Hours' },
  ],
  poor: [
    { lender: 'Flextenure NBFC Partner', rate: 18.0, processingFee: '2.5%', approval: '48 Hours' },
  ],
};

const scoreTier = (creditScore) => {
  if (creditScore >= 750) return 'excellent';
  if (creditScore >= 700) return 'good';
  if (creditScore >= 650) return 'fair';
  return 'poor';
};

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const calculateEligibility = ({ age, monthlyIncome, creditScore, employmentType, loanType, requestedAmount }) => {
  const numAge = Number(age) || 0;
  const income = Number(monthlyIncome) || 0;
  const credit = Number(creditScore) || 650;
  const empFactor = EMPLOYMENT_FACTOR[employmentType] ?? 0.7;
  const multiplier = LOAN_MULTIPLIER[loanType] ?? LOAN_MULTIPLIER.personal;

  // --- weighted eligibility score (0-100) ---
  const creditComponent = clamp(((credit - 300) / (900 - 300)) * 100, 0, 100);
  const incomeComponent = clamp((income / 100000) * 100, 0, 100);
  const ageComponent = numAge >= 25 && numAge <= 45 ? 100 : numAge >= 21 && numAge <= 60 ? 70 : 30;
  const employmentComponent = empFactor * 100;

  const eligibilityScore = Math.round(
    creditComponent * 0.5 + incomeComponent * 0.3 + ageComponent * 0.1 + employmentComponent * 0.1
  );

  const isEligible = income >= 15000 && numAge >= 21 && numAge <= 60 && credit >= 600;

  const maxEligibleAmount = Math.round(income * multiplier * empFactor);

  const tier = scoreTier(credit);
  const offers = (LENDER_OFFERS[tier] || LENDER_OFFERS.poor).map((o) => ({
    ...o,
    maxAmount: Math.round(maxEligibleAmount * (0.9 + Math.random() * 0.15)),
  }));

  const tips = [];
  if (credit < 700) tips.push('Improve your credit score for access to lower interest rates');
  if (income < 30000) tips.push('A higher declared income can increase your eligible loan amount');
  if (numAge < 21 || numAge > 60) tips.push('Consider adding a co-applicant within the 21-60 age band');
  if (!['salaried', 'business'].includes(employmentType)) tips.push('Stable salaried or business income improves approval odds');
  if (tips.length === 0) tips.push('You have a strong profile — compare offers below and apply directly');

  const message = isEligible
    ? eligibilityScore >= 75
      ? 'Excellent! You qualify for our best loan offers.'
      : 'You qualify for multiple loan offers!'
    : 'Limited eligibility — see tips below to improve your profile.';

  return {
    eligibilityScore: clamp(eligibilityScore, 0, 100),
    maxEligibleAmount,
    isEligible,
    offers,
    tips,
    message,
    requestedAmount: Number(requestedAmount) || undefined,
  };
};

module.exports = { calculateEligibility, scoreTier };
