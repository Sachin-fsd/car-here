import React from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentCancel() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F2B134]">
      <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4 text-[#B94A2C]">Payment Cancelled</h2>
        <p className="mb-4 text-[#B94A2C]">Your payment was not completed or was cancelled.</p>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-[#B94A2C] text-white rounded" onClick={() => navigate("/pricing")}>Back to Pricing</button>
          <button className="px-4 py-2 bg-gray-600 text-white rounded" onClick={() => navigate("/user-dashboard")}>Go to Dashboard</button>
        </div>
      </div>
    </div>
  );
}
