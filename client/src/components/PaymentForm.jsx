import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const PaymentForm = ({ amount, email }) => {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
    const body = { amount, email };
    const headers = { 'Content-Type': 'application/json' };
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/create-checkout-session`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    const session = await response.json();
    const result = await stripe.redirectToCheckout({ sessionId: session.id });
    if (result.error) {
      alert(result.error.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <button onClick={handlePay} disabled={loading || !amount || !email} className="btn btn-primary w-full">
        {loading ? 'Redirecting...' : 'Pay with Stripe'}
      </button>
    </div>
  );
};

export default PaymentForm;
