import React from "react";
const DriverPricingPage = ({ isDark }) => (
  <div className={isDark ? "min-h-screen flex items-center justify-center bg-gray-900 text-white" : "min-h-screen flex items-center justify-center bg-white text-gray-900"}>
    <div className="max-w-xl w-full p-8 rounded-2xl shadow-xl bg-gradient-to-br from-blue-100 via-green-100 to-purple-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-400">Driver Pricing</h1>
      <ul className="space-y-6">
        <li className="p-6 rounded-xl bg-white/80 dark:bg-gray-900/80 shadow flex flex-col md:flex-row md:items-center md:justify-between">
          <span className="font-bold text-lg md:text-xl text-blue-700">Starter Plan</span>
          <span className="text-green-600 font-extrabold text-xl md:text-2xl">₹199/month</span>
        </li>
        <li className="p-6 rounded-xl bg-white/80 dark:bg-gray-900/80 shadow flex flex-col md:flex-row md:items-center md:justify-between">
          <span className="font-bold text-lg md:text-xl text-purple-700">Pro Plan</span>
          <span className="text-green-600 font-extrabold text-xl md:text-2xl">₹499/month</span>
        </li>
        <li className="p-6 rounded-xl bg-white/80 dark:bg-gray-900/80 shadow flex flex-col md:flex-row md:items-center md:justify-between">
          <span className="font-bold text-lg md:text-xl text-pink-700">Elite Plan</span>
          <span className="text-green-600 font-extrabold text-xl md:text-2xl">₹999/month</span>
        </li>
      </ul>
      <div className="mt-8 flex justify-center">
        <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-green-400 text-white rounded-xl font-bold shadow hover:scale-105 transition-transform duration-150">Subscribe Now</button>
      </div>
    </div>
  </div>
);
export default DriverPricingPage;
