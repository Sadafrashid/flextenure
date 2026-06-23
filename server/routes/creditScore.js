const express = require('express');
const { protect } = require('../middleware/auth');
const buildCreditReport = require('../utils/creditReport');

const router = express.Router();

// GET /api/credit-score — protected; returns the logged-in user's credit report
router.get('/', protect, async (req, res) => {
  try {
    const report = buildCreditReport(req.user.creditScore, req.user._id);
    res.json({ success: true, data: report });
  } catch (err) {
    console.error('Credit score error:', err.message);
    res.status(500).json({ success: false, message: 'Could not load your credit score right now.' });
  }
});

module.exports = router;
