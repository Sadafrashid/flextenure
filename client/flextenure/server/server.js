require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const loanRoutes = require('./routes/loans');
const eligibilityRoutes = require('./routes/eligibility');
const applicationRoutes = require('./routes/applications');
const creditScoreRoutes = require('./routes/creditScore');

const app = express();

// --- Middleware ---
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:3000').split(',').map((o) => o.trim());
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

// --- Routes ---
app.get('/api/health', (req, res) => res.json({ success: true, message: 'Flextenure API is running' }));

app.use('/api/auth', authRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/eligibility', eligibilityRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/credit-score', creditScoreRoutes);

// 404 handler for unknown API routes
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.originalUrl} not found` });
});

// Generic error handler (catches anything thrown synchronously in routes)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Something went wrong on our end.' });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Flextenure API listening on http://localhost:${PORT}`);
  });
});
