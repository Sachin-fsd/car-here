import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PaymentForm from "../components/PaymentForm";
import { supabase } from "../supabaseClient";

const getDefaultProfile = () => ({
    name: "User Name",
    email: "user@email.com",

});

function ProfilePage() {
    const navigate = useNavigate();
    // Removed unused wallet state
    // Removed unused newMethod state
        const [profile, setProfile] = useState(getDefaultProfile());
        const [uploading, setUploading] = useState(false);
        const [trips, setTrips] = useState([]);
        const [editing, setEditing] = useState(false);

        function handleEditProfile() {
            setEditing(true);
        }
        function handleSaveProfile() {
            setEditing(false);
        }
    useEffect(() => {
        async function fetchAll() {
            // Fetch user profile
            const { data: userData } = await supabase.auth.getUser();
            if (userData?.user) {
                const email = userData.user.email || "";
                const name = userData.user.user_metadata?.full_name || "";
                const photo = userData.user.user_metadata?.photo || "https://randomuser.me/api/portraits/lego/1.jpg";
                setProfile((prev) => ({ ...prev, name, email, photo }));
            }
            // Removed fetching saved places and reference to setSavedPlaces since it's undefined and unused
            // Fetch trips
            const { data: tripsData } = await supabase.from('ride_history').select('*');
            if (tripsData) setTrips(tripsData);
        }
        fetchAll();
    }, []);

    async function handleProfilePicUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        const fileExt = file.name.split('.').pop();
        const fileName = `${profile.email}-profile.${fileExt}`;
        const { error } = await supabase.storage.from('profile-pics').upload(fileName, file, { upsert: true });
        if (!error) {
            const { publicUrl } = supabase.storage.from('profile-pics').getPublicUrl(fileName).data;
            setProfile((prev) => ({ ...prev, photo: publicUrl }));
            // Optionally update user metadata
            await supabase.auth.updateUser({ data: { photo: publicUrl } });
        }
        setUploading(false);
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
                    {/* Profile Header */}
                    <div className="bg-white/60 dark:bg-gray-800/60 rounded-2xl shadow-xl p-8 flex flex-col md:flex-row items-center gap-8 backdrop-blur border border-gray-200 dark:border-gray-700">
                        <div className="relative">
                            <img src={profile.photo} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-blue-300 shadow-lg" />
                            <label htmlFor="profile-pic-upload" className="absolute bottom-2 right-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full p-3 cursor-pointer shadow-lg hover:scale-105 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 20h14M12 4v16m8-8H4" /></svg>
                            </label>
                            <input id="profile-pic-upload" type="file" accept="image/*" className="hidden" onChange={handleProfilePicUpload} disabled={uploading} />
                            {uploading && <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white/70 dark:bg-gray-900/70 rounded-full"><span className="text-blue-600 font-bold">Uploading...</span></div>}
                        </div>
                        <div className="flex-1">
                            {editing ? (
                                <div className="space-y-3">
                                    <input type="text" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} className="px-4 py-2 rounded-xl border w-full focus:ring-2 focus:ring-blue-400" />
                                    <input type="email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} className="px-4 py-2 rounded-xl border w-full focus:ring-2 focus:ring-purple-400" />
                                    <input type="text" value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} className="px-4 py-2 rounded-xl border w-full focus:ring-2 focus:ring-pink-400" />
                                    <button className="mt-2 px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl shadow hover:scale-105 transition-transform" onClick={handleSaveProfile}>Save</button>
                                </div>
                            ) : (
                                <>
                                    <div className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">{profile.name}</div>
                                    <div className="text-lg text-gray-600 dark:text-gray-300 mb-1">{profile.email}</div>
                                    {profile.phone && <div className="text-md text-gray-500 dark:text-gray-400">{profile.phone}</div>}
                                    <button className="mt-3 px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl shadow hover:scale-105 transition-transform" onClick={handleEditProfile}>Edit Profile</button>
                                </>
                            )}
                        </div>
                    </div>
                    {/* Ride History */}
                    <div className="bg-white/60 dark:bg-gray-800/60 rounded-2xl shadow-xl p-8 backdrop-blur border border-gray-200 dark:border-gray-700">
                        <div className="font-extrabold text-2xl mb-4 text-blue-700 dark:text-blue-300">Ride History</div>
                        <ul className="mb-4">
                            {trips.length === 0 ? (
                                <li className="mb-2 text-gray-500">No rides yet.</li>
                            ) : (
                                trips.map((trip, idx) => (
                                    <li key={idx} className="mb-6 bg-white/80 dark:bg-gray-900/80 rounded-xl p-4 shadow flex flex-col md:flex-row md:items-center justify-between gap-4 border border-gray-100 dark:border-gray-800">
                                        <div className="flex flex-col md:flex-row md:items-center gap-2">
                                            <span className="font-bold text-lg text-purple-700 dark:text-purple-300">{trip.date}</span>
                                            <span className="mx-2 text-gray-400">|</span>
                                            <span className="text-blue-600 dark:text-blue-300">{trip.from}</span>
                                            <span className="mx-1">→</span>
                                            <span className="text-pink-600 dark:text-pink-300">{trip.to}</span>
                                            <span className="mx-2 text-gray-400">|</span>
                                            <span className="font-semibold text-green-700 dark:text-green-300">₹{trip.fare}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="px-3 py-1 bg-gradient-to-r from-blue-400 to-purple-400 text-white rounded-lg shadow hover:scale-105 transition-transform">Download Invoice</button>
                                            {!trip.paid && (
                                                <div className="mt-2 md:mt-0">
                                                    <PaymentForm amount={trip.fare} rideId={trip.id} userId={profile.email} />
                                                </div>
                                            )}
                                        </div>
                                    </li>
                                ))
                            )}
                        </ul>
                        <button className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl shadow hover:scale-105 transition-transform">Support / Dispute</button>
                    </div>
                </div>
            </div>
        );
// ...existing code...
}

export default ProfilePage;
