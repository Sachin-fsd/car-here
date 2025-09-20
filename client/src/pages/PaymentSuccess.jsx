import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const type = params.get("type");
  const amount = Number(params.get("amount"));
  const userId = params.get("userId");
  const rideId = params.get("rideId");

  useEffect(() => {
    async function updateAfterPayment() {
      if (type === "wallet" && userId) {
        // Update wallet balance in Supabase
        const { data: wallet } = await supabase.from("wallet").select("*").eq("user_id", userId).single();
        if (wallet) {
          await supabase.from("wallet").update({ balance: wallet.balance + amount }).eq("id", wallet.id);
        }
      } else if (type === "ride" && rideId) {
        // Mark ride as paid in Supabase
        await supabase.from("ride_history").update({ paid: true }).eq("id", rideId);
      }
    }
    updateAfterPayment();
  }, [type, amount, userId, rideId]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-4">Payment Successful!</h2>
      <p className="mb-4">Thank you for your payment.</p>
      <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={() => navigate("/profile")}>Go to Profile</button>
    </div>
  );
}
