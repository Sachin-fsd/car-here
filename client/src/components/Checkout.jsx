import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [amount, setAmount] = useState(100); // Example amount
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const makePayment = async () => {
    setLoading(true);
    const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
    const body = { amount, email };
    const headers = { "Content-Type": "application/json" };
    const response = await fetch("http://localhost:5000/api/create-checkout-session", {
      method: "POST",
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
    <div style={{ maxWidth: 400, margin: "0 auto", padding: 24 }}>
      <label>
        Payment Method:{" "}
        <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
          <option value="">Select</option>
          <option value="card">Card</option>
        </select>
      </label>
      <br />
      <label>
        Email:{" "}
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ marginBottom: 8 }} />
      </label>
      <br />
      <label>
        Amount (₹):{" "}
        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} style={{ marginBottom: 8 }} />
      </label>
      <br />
      {paymentMethod === "card" && (
        <button onClick={makePayment} style={{ marginTop: 10 }} disabled={loading || !email || !amount}>
          {loading ? "Redirecting..." : "Pay"}
        </button>
      )}
    </div>
  );
}

export default Checkout;
