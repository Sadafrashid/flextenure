const express = require('express');
const LoanProduct = require('../models/LoanProduct');

const router = express.Router();

// GET /api/loans — list all loan products
router.get('/', async (req, res) => {
  try {
    const loans = await LoanProduct.find().sort({ interestRateFrom: 1 });
    res.json({ success: true, data: loans });
  } catch (err) {
    console.error('List loans error:', err.message);
    res.status(500).json({ success: false, message: 'Could not load loan products.' });
  }
});

// GET /api/loans/:type — get a single loan product by its slug, e.g. 'personal'
router.get('/:type', async (req, res) => {
  try {
    const loan = await LoanProduct.findOne({ id: req.params.type.toLowerCase() });
    if (!loan) {
      return res.status(404).json({ success: false, message: `No loan product found for "${req.params.type}"` });
    }
    res.json({ success: true, data: loan });
  } catch (err) {
    console.error('Get loan error:', err.message);
    res.status(500).json({ success: false, message: 'Could not load loan product.' });
  }
});

module.exports = router;
