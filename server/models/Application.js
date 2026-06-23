const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    applicationId: { type: String, required: true, unique: true },
    loanType: {
      type: String,
      required: true,
      enum: ['personal', 'home', 'car', 'education', 'business', 'gold'],
    },
    amount: { type: Number, required: true },
    tenure: { type: Number, required: true }, // months
    interestRate: { type: Number, required: true },
    purpose: { type: String, default: 'General' },
    status: {
      type: String,
      enum: ['draft', 'submitted', 'under_review', 'approved', 'rejected', 'disbursed', 'closed'],
      default: 'submitted',
    },
    appliedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', applicationSchema);
