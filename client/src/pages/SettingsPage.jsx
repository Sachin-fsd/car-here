import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SettingsPage() {
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(() => {
        const stored = localStorage.getItem('darkMode');
        return stored === 'true';
    });

    React.useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('darkMode', darkMode);
    }, [darkMode]);
    const [notifications, setNotifications] = useState(true);
    const [language, setLanguage] = useState("en");

    function handleLogout() {
        // Add your logout logic here (e.g., supabase.auth.signOut())
        navigate("/"); // Go to home page
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="w-full max-w-3xl mx-auto p-6 flex flex-col gap-8">
                <button
                    className="mb-4 px-5 py-2 bg-white/60 dark:bg-gray-700/60 rounded-xl shadow-lg hover:bg-white/80 dark:hover:bg-gray-700/80 font-semibold self-start backdrop-blur border border-gray-200 dark:border-gray-700 transition"
                    onClick={() => navigate('/user-dashboard')}
                >
                    ← Go Back
                </button>
                <div className="bg-white/60 dark:bg-gray-800/60 rounded-2xl shadow-xl p-8 backdrop-blur border border-gray-200 dark:border-gray-700">
                    <div className="text-3xl font-extrabold mb-6 text-blue-700 dark:text-blue-300">Settings</div>
                    <div className="mb-6 flex flex-col gap-4">
                        <label className="flex items-center gap-3 text-lg">
                            <input type="checkbox" checked={darkMode} onChange={e => setDarkMode(e.target.checked)} className="accent-blue-500 w-5 h-5" />
                            <span className="font-semibold">Dark Mode</span>
                        </label>
                        <label className="flex items-center gap-3 text-lg">
                            <input type="checkbox" checked={notifications} onChange={e => setNotifications(e.target.checked)} className="accent-purple-500 w-5 h-5" />
                            <span className="font-semibold">Enable Notifications</span>
                        </label>
                        <div>
                            <label className="block mb-2 font-semibold text-lg">Language</label>
                            <select value={language} onChange={e => setLanguage(e.target.value)} className="px-4 py-2 rounded-xl border w-full bg-white dark:bg-gray-900 dark:text-white dark:border-gray-700 focus:ring-2 focus:ring-blue-400">
                                <option value="en">English</option>
                                <option value="hi">Hindi</option>
                                <option value="es">Spanish</option>
                            </select>
                        </div>
                    </div>
                    <button className="mt-8 px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl shadow hover:scale-105 transition-transform" onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </div>
    );
}

export default SettingsPage;
