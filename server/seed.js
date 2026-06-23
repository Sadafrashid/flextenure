// Seeds the database with the 6 loan products shown across the site.
// Run with: npm run seed   (make sure .env is set up first)
require('dotenv').config();
const connectDB = require('./config/db');
const LoanProduct = require('./models/LoanProduct');

const loanProducts = [
  {
    id: 'personal',
    name: 'Personal Loan',
    icon: '💳',
    minAmount: 10000,
    maxAmount: 5000000,
    minTenure: 3,
    maxTenure: 60,
    interestRateFrom: 10.5,
    processingFee: '1-2%',
    description: 'Get instant personal loans for any purpose with no collateral required.',
    features: ['No collateral required', 'Instant approval', 'Flexible repayment', 'Minimal documentation', 'Online disbursement', 'Prepayment available'],
    eligibility: { minAge: 21, maxAge: 65, minIncome: 15000, minCreditScore: 650 },
  },
  {
    id: 'home',
    name: 'Home Loan',
    icon: '🏠',
    minAmount: 500000,
    maxAmount: 100000000,
    minTenure: 12,
    maxTenure: 360,
    interestRateFrom: 8.35,
    processingFee: '0.5-1%',
    description: "Make your dream home a reality with India's most affordable home loan rates.",
    features: ['Low interest rates', 'Long repayment tenure', 'Tax benefits u/s 24', 'Balance transfer', 'Top-up loan available', 'No prepayment charges'],
    eligibility: { minAge: 23, maxAge: 65, minIncome: 25000, minCreditScore: 700 },
  },
  {
    id: 'car',
    name: 'Car Loan',
    icon: '🚗',
    minAmount: 100000,
    maxAmount: 10000000,
    minTenure: 12,
    maxTenure: 84,
    interestRateFrom: 8.7,
    processingFee: '0.5-1.5%',
    description: 'Drive your dream car with easy EMIs and quick approval.',
    features: ['Up to 100% on-road funding', 'Quick disbursal', 'New & used cars', 'Flexible EMI options'],
    eligibility: { minAge: 21, maxAge: 65, minIncome: 20000, minCreditScore: 650 },
  },
  {
    id: 'education',
    name: 'Education Loan',
    icon: '🎓',
    minAmount: 50000,
    maxAmount: 15000000,
    minTenure: 12,
    maxTenure: 180,
    interestRateFrom: 9.0,
    processingFee: 'Nil',
    description: 'Invest in your future with education financing for India and abroad.',
    features: ['Study in India & abroad', 'Moratorium period', 'Tax benefits under 80E', 'No collateral up to ₹7.5L'],
    eligibility: { minAge: 18, maxAge: 35, minIncome: 0, minCreditScore: 0 },
  },
  {
    id: 'business',
    name: 'Business Loan',
    icon: '🏢',
    minAmount: 50000,
    maxAmount: 50000000,
    minTenure: 6,
    maxTenure: 96,
    interestRateFrom: 11.0,
    processingFee: '1-3%',
    description: 'Scale your business with flexible, collateral-free funding.',
    features: ['Collateral free up to ₹50L', 'Quick disbursal', 'Online application', 'Multiple repayment options'],
    eligibility: { minAge: 21, maxAge: 65, minIncome: 0, minCreditScore: 700 },
  },
  {
    id: 'gold',
    name: 'Gold Loan',
    icon: '🥇',
    minAmount: 5000,
    maxAmount: 5000000,
    minTenure: 3,
    maxTenure: 36,
    interestRateFrom: 7.5,
    processingFee: '0.5%',
    description: 'Unlock the value of your gold instantly with the lowest rates.',
    features: ['Instant approval', 'No income proof needed', 'Lowest interest rates', 'Safe gold storage'],
    eligibility: { minAge: 18, maxAge: 70, minIncome: 0, minCreditScore: 0 },
  },
];

(async () => {
  await connectDB();
  try {
    await LoanProduct.deleteMany({});
    await LoanProduct.insertMany(loanProducts);
    console.log(`Seeded ${loanProducts.length} loan products.`);
  } catch (err) {
    console.error('Seeding failed:', err.message);
  } finally {
    process.exit(0);
  }
})();
