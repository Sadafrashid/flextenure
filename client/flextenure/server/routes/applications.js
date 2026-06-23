const express = require('express');
const { body, validationResult } = require('express-validator');
const Application = require('../models/Application');
const LoanProduct = require('../models/LoanProduct');
const generateApplicationId = require('../utils/generateApplicationId');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes here require a logged-in user
router.use(protect);

// GET /api/applications — list the current user's applications, most recent first
router.get('/', async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: applications });
  } catch (err) {
    console.error('List applications error:', err.message);
    res.status(500).json({ success: false, message: 'Could not load your applications.' });
  }
});

// GET /api/applications/:id — a single application belonging to the current user
router.get('/:id', async (req, res) => {
  try {
    const application = await Application.findOne({ _id: req.params.id, user: req.user._id });
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }
    res.json({ success: true, data: application });
  } catch (err) {
    console.error('Get application error:', err.message);
    res.status(500).json({ success: false, message: 'Could not load this application.' });
  }
});

// POST /api/applications — create a new loan application
router.post(
  '/',
  [
    body('loanType').isIn(['personal', 'home', 'car', 'education', 'business', 'gold']).withMessage('Invalid loan type'),
    body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than 0'),
    body('tenure').isInt({ gt: 0 }).withMessage('Tenure must be greater than 0'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { loanType, amount, tenure, purpose } = req.body;
      const loanProduct = await LoanProduct.findOne({ id: loanType });
      const interestRate = loanProduct ? loanProduct.interestRateFrom : 12.5;

      const application = await Application.create({
        user: req.user._id,
        applicationId: generateApplicationId(),
        loanType,
        amount,
        tenure,
        interestRate,
        purpose: purpose || 'General',
        status: 'submitted',
      });

      res.status(201).json({ success: true, data: application });
    } catch (err) {
      console.error('Create application error:', err.message);
      res.status(500).json({ success: false, message: 'Could not submit your application. Please try again.' });
    }
  }
);

module.exports = router;
