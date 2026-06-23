import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer-main">
        <div className="footer-brand">
          <div className="footer-logo">
            <div className="logo-icon">F</div>
            <span>Flextenure</span>
          </div>
          <p>India's smartest lending platform — connecting you to the best loan offers, fast.</p>
          <div className="footer-badges">
            <span className="fbadge">🔒 RBI Regulated</span>
            <span className="fbadge">⭐ ISO 27001</span>
            <span className="fbadge">🛡️ SSL Secured</span>
          </div>
        </div>
        <div className="footer-col">
          <h4>Loan Products</h4>
          <Link to="/loans/personal">Personal Loan</Link>
          <Link to="/loans/home">Home Loan</Link>
          <Link to="/loans/car">Car Loan</Link>
          <Link to="/loans/education">Education Loan</Link>
          <Link to="/loans/business">Business Loan</Link>
          <Link to="/loans/gold">Gold Loan</Link>
        </div>
        <div className="footer-col">
          <h4>Tools</h4>
          <Link to="/eligibility">Eligibility Checker</Link>
          <Link to="/emi-calculator">EMI Calculator</Link>
          <Link to="/credit-score">Credit Score</Link>
          <Link to="/dashboard">My Dashboard</Link>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <a href="#about">About Us</a>
          <a href="#careers">Careers</a>
          <a href="#partners">Partner with Us</a>
          <a href="#blog">Blog</a>
          <a href="#contact">Contact Us</a>
        </div>
        <div className="footer-col">
          <h4>Support</h4>
          <a href="mailto:support@flextenure.com">support@flextenure.com</a>
          <a href="tel:1800-123-4567">1800-123-4567</a>
          <a href="#faq">FAQs</a>
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms & Conditions</a>
          <a href="#grievance">Grievance Policy</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2024 Flextenure Financial Services Pvt. Ltd. All rights reserved.</p>
        <p className="footer-disclaimer">
          Flextenure is a lending marketplace and does not directly offer loans. Loan disbursement is subject to lender approval.
          Interest rates and amounts are indicative and may vary. NBFC Registration No: NBFC-MFI-XXXXXXXXXXX
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;