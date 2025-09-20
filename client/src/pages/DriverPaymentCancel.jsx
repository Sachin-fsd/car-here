import React from "react";
import { useNavigate } from "react-router-dom";

const DriverPaymentCancel = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-200 via-blue-100 to-blue-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-10 max-w-md w-full mt-20 text-center">
        <h2 className="text-3xl font-extrabold text-red-600 mb-4">Payment Cancelled</h2>
        <p className="text-lg text-gray-700 dark:text-gray-200 mb-6">Your payment was cancelled. No charges were made.</p>
        <button
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl text-lg transition mb-3"
          onClick={() => navigate('/driver-pricing')}
        >
          Back to Pricing
        </button>
        <button
          className="w-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold py-2 rounded-xl text-base transition"
          onClick={() => navigate('/driver')}
        >
          Back to Driver Dashboard
        </button>
      </div>
    </div>
  );
};

export default DriverPaymentCancel;
