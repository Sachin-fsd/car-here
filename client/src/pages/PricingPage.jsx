import React from "react";
import { Link } from "react-router-dom";
// import { startStripeCheckout } from "../utils/stripeCheckout";
import { useState } from "react";
import { supabase } from "../supabaseClient";

const PricingPage = ({ isDark }) => (
  <div className="min-h-screen flex flex-col bg-slate-950">
    {/* Navbar */}
    <nav className="w-full flex items-center justify-between px-8 py-4 bg-slate-900/95 border-b border-slate-800 backdrop-blur-sm">
      <div className="flex items-center gap-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">V</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">CarHere</h1>
          <Link 
            to="/user-dashboard" 
            className="ml-6 px-4 py-2 bg-slate-800 text-slate-300 font-medium rounded-lg border border-slate-700 hover:bg-slate-700 hover:text-white transition-all"
          >
            Dashboard
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Link 
          to="/profile" 
          className="px-4 py-2 text-slate-300 font-medium rounded-lg hover:text-white hover:bg-slate-800 transition-colors"
        >
          Profile
        </Link>
        <Link 
          to="/settings" 
          className="px-4 py-2 text-slate-300 font-medium rounded-lg hover:text-white hover:bg-slate-800 transition-colors"
        >
          Settings
        </Link>
      </div>
    </nav>
    {/* Pricing Section */}
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
      <section className="w-full max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-slate-800/50 backdrop-blur-sm text-cyan-400 text-sm font-medium rounded-full border border-slate-700/50 mb-6">
            💰 Flexible Pricing Plans
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Choose Your Plan</h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">Start free and upgrade as your ride needs grow. All plans include our core features.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Free Plan */}
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-xl p-8 flex flex-col relative group hover:border-slate-600/50 transition-all">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-slate-600 to-slate-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎆</span>
              </div>
              <h3 className="font-bold text-2xl text-white mb-2">Free Plan</h3>
              <div className="text-4xl font-bold text-slate-300 mb-2">₹0<span className="text-base font-normal text-slate-400">/month</span></div>
            </div>
            <div className="space-y-3 text-slate-300 text-center mb-8 flex-1">
              <div className="flex items-center justify-center gap-2"><span className="text-emerald-400">✓</span>First ride free</div>
              <div className="flex items-center justify-center gap-2"><span className="text-emerald-400">✓</span>Basic support</div>
              <div className="flex items-center justify-center gap-2"><span className="text-emerald-400">✓</span>Standard ride quality</div>
              <div className="flex items-center justify-center gap-2"><span className="text-emerald-400">✓</span>Email support</div>
            </div>
            <button className="w-full py-3 bg-slate-700 text-white font-medium rounded-lg border border-slate-600 hover:bg-slate-600 transition-colors">Current Plan</button>
          </div>
          {/* Pro Plan */}
          <div className="bg-slate-800/50 backdrop-blur-xl border border-cyan-400/30 rounded-2xl shadow-xl p-8 flex flex-col relative group hover:border-cyan-400/50 transition-all scale-105 ring-2 ring-cyan-400/20">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">🔥 Most Popular</span>
            </div>
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="font-bold text-2xl text-white mb-2">Pro Plan</h3>
              <div className="text-4xl font-bold text-cyan-400 mb-2">₹499<span className="text-base font-normal text-slate-400">/month</span></div>
            </div>
            <div className="space-y-3 text-slate-300 text-center mb-8 flex-1">
              <div className="flex items-center justify-center gap-2"><span className="text-emerald-400">✓</span>10 free rides/month under 2km</div>
              <div className="flex items-center justify-center gap-2"><span className="text-emerald-400">✓</span>Priority support</div>
              <div className="flex items-center justify-center gap-2"><span className="text-emerald-400">✓</span>High-quality rides</div>
              <div className="flex items-center justify-center gap-2"><span className="text-emerald-400">✓</span>Live chat support</div>
              <div className="flex items-center justify-center gap-2"><span className="text-emerald-400">✓</span>Export ride history</div>
            </div>
            <StripeCheckoutButton amount={499} label="Upgrade to Pro" isPrimary={true} />
          </div>
          {/* Premium Plan */}
          <div className="bg-slate-800/50 backdrop-blur-xl border border-emerald-400/30 rounded-2xl shadow-xl p-8 flex flex-col relative group hover:border-emerald-400/50 transition-all">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="font-bold text-2xl text-white mb-2">Premium Plan</h3>
              <div className="text-4xl font-bold text-emerald-400 mb-2">₹999<span className="text-base font-normal text-slate-400">/month</span></div>
            </div>
            <div className="space-y-3 text-slate-300 text-center mb-8 flex-1">
              <div className="flex items-center justify-center gap-2"><span className="text-emerald-400">✓</span>Unlimited 2km rides</div>
              <div className="flex items-center justify-center gap-2"><span className="text-emerald-400">✓</span>2 free rides/month under 5km</div>
              <div className="flex items-center justify-center gap-2"><span className="text-emerald-400">✓</span>1 free ride/month under 10km</div>
              <div className="flex items-center justify-center gap-2"><span className="text-emerald-400">✓</span>24/7 priority support</div>
              <div className="flex items-center justify-center gap-2"><span className="text-emerald-400">✓</span>Ultra-high ride quality</div>
              <div className="flex items-center justify-center gap-2"><span className="text-emerald-400">✓</span>Advanced ride tracking</div>
              <div className="flex items-center justify-center gap-2"><span className="text-emerald-400">✓</span>Team collaboration</div>
              <div className="flex items-center justify-center gap-2"><span className="text-emerald-400">✓</span>All access features</div>
            </div>
            <StripeCheckoutButton amount={999} label="Upgrade to Premium" />
          </div>
        </div>
        {/* All Plans Include */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 flex flex-col items-center text-center group hover:border-slate-600/50 transition-all">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-2xl">🛡️</span>
            </div>
            <h4 className="font-bold text-white mb-2">Secure & Private</h4>
            <p className="text-slate-400 text-sm leading-relaxed">Your ride data is encrypted and never shared. Ride with complete confidence and privacy.</p>
          </div>
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 flex flex-col items-center text-center group hover:border-slate-600/50 transition-all">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-2xl">⚡</span>
            </div>
            <h4 className="font-bold text-white mb-2">Lightning Fast</h4>
            <p className="text-slate-400 text-sm leading-relaxed">Get anywhere quickly with our AI-optimized routing and instant driver matching.</p>
          </div>
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 flex flex-col items-center text-center group hover:border-slate-600/50 transition-all">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-2xl">🚀</span>
            </div>
            <h4 className="font-bold text-white mb-2">Easy to Use</h4>
            <p className="text-slate-400 text-sm leading-relaxed">Intuitive interface designed for seamless booking and the best user experience.</p>
          </div>
        </div>
        {/* FAQ Section */}
        <div className="max-w-5xl w-full mb-12 mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h3>
            <p className="text-slate-400">Everything you need to know about our pricing plans</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 hover:border-slate-600/50 transition-all">
              <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                <span className="text-cyan-400">❓</span>
                Can I change plans anytime?
              </h4>
              <p className="text-slate-300 text-sm leading-relaxed">Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate the billing accordingly.</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 hover:border-slate-600/50 transition-all">
              <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                <span className="text-emerald-400">💳</span>
                What payment methods are supported?
              </h4>
              <p className="text-slate-300 text-sm leading-relaxed">We accept all major payment methods including UPI, credit/debit cards, net banking, and digital wallets for maximum convenience.</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 hover:border-slate-600/50 transition-all">
              <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                <span className="text-blue-400">🎆</span>
                Is there a free trial?
              </h4>
              <p className="text-slate-300 text-sm leading-relaxed">You can start with our Free plan which includes your first ride free. No credit card required to get started!</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 hover:border-slate-600/50 transition-all">
              <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                <span className="text-purple-400">🛡️</span>
                How secure is my ride data?
              </h4>
              <p className="text-slate-300 text-sm leading-relaxed">All ride data is encrypted with military-grade security. We never share your personal information and follow strict privacy protocols.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
);


// StripeCheckoutButton component using Stripe.js redirectToCheckout
function StripeCheckoutButton({ amount, label, isPrimary = false }) {
  const [loading, setLoading] = useState(false);

  const handleStripeCheckout = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.auth.getUser();
      const userId = data?.user?.email || "guest";
      const response = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/payments/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, type: "plan", userId })
      });
      const session = await response.json();
      if (session.url) {
        window.location.href = session.url;
      } else {
        alert("Failed to create Stripe checkout session");
      }
    } catch (err) {
      alert("Stripe checkout failed: " + err.message);
      console.error("Stripe checkout error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`w-full py-3 rounded-lg font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
        isPrimary
          ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white hover:from-cyan-500 hover:to-blue-600 shadow-lg'
          : 'bg-gradient-to-r from-emerald-400 to-cyan-500 text-white hover:from-emerald-500 hover:to-cyan-600 shadow-lg'
      }`}
      onClick={handleStripeCheckout}
      disabled={loading}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          Redirecting...
        </div>
      ) : (
        <span className="flex items-center justify-center gap-2">
          <span>🚀</span>
          {label}
        </span>
      )}
    </button>
  );
}

export default PricingPage;
