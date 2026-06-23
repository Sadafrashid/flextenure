const mongoose = require('mongoose');

const loanProductSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // slug e.g. 'personal'
  name: { type: String, required: true },
  icon: { type: String, default: '💳' },
  minAmount: { type: Number, required: true },
  maxAmount: { type: Number, required: true },
  minTenure: { type: Number, required: true }, // months
  maxTenure: { type: Number, required: true }, // months
  interestRateFrom: { type: Number, required: true },
  processingFee: { type: String, default: '1%' },
  description: { type: String, required: true },
  features: { type: [String], default: [] },
  eligibility: {
    minAge: { type: Number, default: 21 },
    maxAge: { type: Number, default: 65 },
    minIncome: { type: Number, default: 0 },
    minCreditScore: { type: Number, default: 0 },
  },
});

module.exports = mongoose.model('LoanProduct', loanProductSchema);
