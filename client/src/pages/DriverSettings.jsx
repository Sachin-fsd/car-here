import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DriverSettings() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => document.documentElement.classList.contains('dark'));
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Simulate logout (replace with real auth logic as needed)
  function handleLogout() {
    // Perform logout logic here (clear tokens, etc.)
    navigate("/");
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white dark:bg-gray-900">
      <div className="w-full max-w-2xl p-8 rounded-none shadow-none">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg font-semibold shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          ← Back
        </button>
        <h2 className="text-4xl font-bold mb-10 text-center text-blue-600">Driver Settings</h2>
        <div className="space-y-8">
          <div>
            <label className="block font-semibold mb-2">Notifications</label>
            <select className="w-full p-3 border rounded text-lg">
              <option>All</option>
              <option>Only Ride Requests</option>
              <option>None</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-2">Language</label>
            <select className="w-full p-3 border rounded text-lg">
              <option>English</option>
              <option>Hindi</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-2">Dark Mode</label>
            <input
              type="checkbox"
              className="mr-2"
              checked={darkMode}
              onChange={e => setDarkMode(e.target.checked)}
            /> Enable
          </div>
          {/* Logout Button */}
          <div className="pt-8 flex justify-center">
            <button
              className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg text-lg transition"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
        {/* Popup for online logout restriction */}
        {showLogoutPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-sm w-full flex flex-col items-center">
              <div className="text-xl font-bold mb-4 text-red-600 dark:text-red-400">You are currently online</div>
              <div className="mb-6 text-gray-800 dark:text-gray-100 text-center">Go offline before you can logout.</div>
              <button
                className="px-6 py-2 bg-gray-700 text-white rounded-lg font-semibold shadow hover:bg-gray-800 transition mb-2"
                onClick={() => setShowLogoutPopup(false)}
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
