import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const DriverCheckout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Get plan and amount from query params
  const params = new URLSearchParams(location.search);
  const plan = params.get("plan") || "Pro Driver";
  const amount = params.get("amount") || 499;

  // Real Stripe checkout redirect
  const handleCheckout = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"}/api/payments/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, type: "driver-plan", plan })
      });
      const session = await response.json();
      if (session.url) {
        window.location.href = session.url;
      } else {
        alert("Failed to create Stripe checkout session");
      }
    } catch (err) {
      alert("Stripe checkout failed: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-200 via-blue-100 to-blue-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-10 max-w-md w-full mt-20">
        <h2 className="text-3xl font-extrabold text-blue-700 mb-4 text-center">Checkout for {plan === "elite" ? "Elite" : plan === "pro" ? "Pro" : plan === "starter" ? "Starter" : plan} Plan</h2>
        <div className="mb-6 text-center">
          <div className="text-xl font-bold text-gray-700 dark:text-white mb-2">{plan}</div>
          <div className="text-2xl font-extrabold text-green-600">₹{amount}</div>
        </div>
        <button
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl text-lg transition mb-4"
          onClick={handleCheckout}
        >
          Pay with Stripe
        </button>
        <button
          className="w-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-white font-semibold py-2 rounded-xl text-base transition"
          onClick={() => navigate("/driver-pricing")}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DriverCheckout;
