const express = require('express');
const { calculateEligibility } = require('../utils/eligibility');

const router = express.Router();

// POST /api/eligibility/check — public, no login required.
// Mirrors the shape the frontend's fallback mock already expects.
router.post('/check', async (req, res) => {
  try {
    const { age, monthlyIncome, creditScore, employmentType, loanType, requestedAmount } = req.body;

    if (!age || !monthlyIncome || !employmentType) {
      return res.status(400).json({ success: false, message: 'age, monthlyIncome and employmentType are required.' });
    }

    const result = calculateEligibility({ age, monthlyIncome, creditScore, employmentType, loanType, requestedAmount });
    res.json({ success: true, data: result });
  } catch (err) {
    console.error('Eligibility check error:', err.message);
    res.status(500).json({ success: false, message: 'Could not check eligibility right now. Please try again.' });
  }
});

module.exports = router;
