import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Loans from './pages/Loans';
import LoanDetail from './pages/LoanDetail';
import EligibilityChecker from './pages/EligibilityChecker';
import EMICalculator from './pages/EMICalculator';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import CreditScore from './pages/CreditScore';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/loans" element={<Loans />} />
              <Route path="/loans/:type" element={<LoanDetail />} />
              <Route path="/eligibility" element={<EligibilityChecker />} />
              <Route path="/emi-calculator" element={<EMICalculator />} />
              <Route path="/credit-score" element={<CreditScore />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;