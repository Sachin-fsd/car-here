// import DriverPricingPage from './pages/DriverPricing';
import { supabase } from './supabaseClient';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import UserAuth from './pages/UserAuth';
import DriverAuth from './pages/DriverAuth';
import Dashboard from './pages/Dashboard';
import UserDashboard from './pages/UserDashboard';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import DriverPage from './pages/DriverPage';
import DriverProfile from './pages/DriverProfile';
import DriverSettings from './pages/DriverSettings';
import PricingPage from './pages/PricingPage';
import PaymentCancel from './pages/PaymentCancel';
import DriverPricingPage from './pages/DriverPricing';
import DriverCheckout from './pages/DriverCheckout';
import DriverPaymentCancel from './pages/DriverPaymentCancel';



function App() {
  React.useEffect(() => {
    supabase.auth.getSession().then(res => {
      console.log('Supabase session test:', res);
    }).catch(err => {
      console.error('Supabase connection error:', err);
    });
  }, []);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/user-auth" element={<UserAuth />} />
        <Route path="/driver-auth" element={<DriverAuth />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
  <Route path="/pricing" element={<PricingPage isDark={false} />} />
  <Route path="/payment-cancel" element={<PaymentCancel />} />
  <Route path="/driver-pricing" element={<DriverPricingPage isDark={false} />} />
  <Route path="/driver-checkout" element={<DriverCheckout />} />
  <Route path="/driver-payment-cancel" element={<DriverPaymentCancel />} />
        <Route path="/driver" element={<DriverPage />} />
        <Route path="/driver-profile" element={<DriverProfile />} />
        <Route path="/driver-settings" element={<DriverSettings />} />
      </Routes>
    </Router>
  );
}

export default App;
