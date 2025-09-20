import DriverMapView from "../components/DriverMapView";
// Removed unused RoutingMap import
// Removed unused RoutingMap import
import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
// Removed unused RoutingMap import

function DriverPage() {
    // State for incoming ride requests
    const [incomingRequests, setIncomingRequests] = useState([]);
    // State for accepted request
    const [acceptedRequest, setAcceptedRequest] = useState(() => {
        // Try to restore from localStorage
        const saved = localStorage.getItem('driver_accepted_request');
        return saved ? JSON.parse(saved) : null;
    });
    const [online, setOnline] = useState(false);
    const [driverId, setDriverId] = useState(null);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [routeInfo, setRouteInfo] = useState({ distance: null, fromCoords: null, toCoords: null });


    // Get driver id from supabase auth
    useEffect(() => {
        async function getDriverId() {
            const { data } = await supabase.auth.getSession();
            if (data?.session?.user?.id) {
                setDriverId(data.session.user.id);
            }
        }
        getDriverId();
    }, []);

    // Listen for incoming ride requests in real time
    useEffect(() => {
        if (!driverId) return;
        let subscription;
        async function fetchAndSubscribe() {
            // Initial fetch
            const { data, error } = await supabase
                .from('ride_requests')
                .select('*')
                .eq('driver_id', driverId)
                .eq('status', 'pending');
            if (!error && data) setIncomingRequests(data);

            // Subscribe to changes
            subscription = supabase
                .channel('ride_requests_driver_' + driverId)
                .on('postgres_changes', { event: '*', schema: 'public', table: 'ride_requests', filter: `driver_id=eq.${driverId}` }, payload => {
                    // Refetch on any change
                    supabase
                        .from('ride_requests')
                        .select('*')
                        .eq('driver_id', driverId)
                        .eq('status', 'pending')
                        .then(({ data }) => setIncomingRequests(data || []));
                })
                .subscribe();
        }
        fetchAndSubscribe();
        return () => {
            if (subscription) supabase.removeChannel(subscription);
        };
    }, [driverId]);

    // Update drivers_online table when online status changes
    useEffect(() => {
        if (!driverId) return;
        async function updateOnlineStatus() {
            if (online) {
                // Upsert online status
                await supabase.from('drivers_online').upsert({ driver_id: driverId, status: 'online', updated_at: new Date().toISOString() });
            } else {
                // Set offline or delete row
                await supabase.from('drivers_online').upsert({ driver_id: driverId, status: 'offline', updated_at: new Date().toISOString() });
            }
        }
        updateOnlineStatus();
    }, [online, driverId]);

    // Set offline on unmount (tab close/logout)
    useEffect(() => {
        if (!driverId) return;
        const handleUnload = async () => {
            await supabase.from('drivers_online').upsert({ driver_id: driverId, status: 'offline', updated_at: new Date().toISOString() });
        };
        window.addEventListener('beforeunload', handleUnload);
        return () => {
            handleUnload();
            window.removeEventListener('beforeunload', handleUnload);
        };
    }, [driverId]);

    // Fetch route info when selectedRequest changes
    useEffect(() => {
        async function fetchRoute() {
            if (!selectedRequest) return;
            // Use indiaLocations to get coordinates
            const indiaLocations = (await import("../data/indiaLocations")).default;
            const fromObj = indiaLocations.find(loc => loc.label.toLowerCase().includes(selectedRequest.from.toLowerCase()));
            const toObj = indiaLocations.find(loc => loc.label.toLowerCase().includes(selectedRequest.to.toLowerCase()));
            if (fromObj && toObj) {
                // Calculate distance using Haversine formula
                const R = 6371; // km
                const dLat = (toObj.value.lat - fromObj.value.lat) * Math.PI / 180;
                const dLon = (toObj.value.lng - fromObj.value.lng) * Math.PI / 180;
                const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(fromObj.value.lat * Math.PI / 180) * Math.cos(toObj.value.lat * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                const distance = (R * c).toFixed(2);
                setRouteInfo({ distance, fromCoords: fromObj.value, toCoords: toObj.value });
            } else {
                setRouteInfo({ distance: null, fromCoords: null, toCoords: null });
            }
        }
        fetchRoute();
    }, [selectedRequest]);
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    React.useEffect(() => {
        async function checkAuth() {
            const { data } = await supabase.auth.getSession();
            if (data?.session) {
                setIsAuthenticated(true);
            } else {
                navigate("/driver-auth");
            }
        }
        checkAuth();
    }, [navigate]);
    // Removed unused online state
    const earnings = 0;
    const requests = [
        { id: 1, rider: "Amit Singh", from: "Mumbai", to: "Pune", fare: 1200 },
        { id: 2, rider: "Priya Sharma", from: "Delhi", to: "Agra", fare: 900 },
    ];

    // Example: ratings and earnings history arrays, in real app fetch from backend
    const ratings = [5, 4, 5, 3, 4]; // Replace with real data from user dashboard
    const earningsHistory = [
        { date: '2025-09-10', amount: 1200 },
        { date: '2025-09-12', amount: 900 },
        { date: '2025-09-14', amount: 1500 },
    ];
    const ratingHistory = [
        { date: '2025-09-10', rating: 5, comment: 'Great ride!' },
        { date: '2025-09-12', rating: 4, comment: 'Smooth trip.' },
        { date: '2025-09-14', rating: 3, comment: 'Okay experience.' },
    ];
    const rideHistory = [
        { date: '2025-09-10', from: 'Mumbai', to: 'Pune', fare: 1200 },
        { date: '2025-09-12', from: 'Delhi', to: 'Agra', fare: 900 },
        { date: '2025-09-14', from: 'Bangalore', to: 'Chennai', fare: 1500 },
    ];
    const avgRating = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2) : null;

    const [showEarningsHistory, setShowEarningsHistory] = useState(false);
    const [showRatingHistory, setShowRatingHistory] = useState(false);
    const [showRideHistory, setShowRideHistory] = useState(false);

    // Removed unused handleOnlineToggle function

    // Accept ride request handler
    const handleAcceptRequest = async (req) => {
        // Update status in Supabase
        await supabase.from('ride_requests').update({ status: 'accepted' }).eq('id', req.id);
        setAcceptedRequest(req);
        setSelectedRequest(req);
        localStorage.setItem('driver_accepted_request', JSON.stringify(req));
    };

    // On mount, if acceptedRequest exists, check Supabase for latest status
    useEffect(() => {
        if (!acceptedRequest) return;
        async function checkStatus() {
            const { data } = await supabase.from('ride_requests').select('*').eq('id', acceptedRequest.id).single();
            if (data && data.status !== 'accepted') {
                setAcceptedRequest(null);
                localStorage.removeItem('driver_accepted_request');
            }
        }
        checkStatus();
    }, [acceptedRequest]);

    if (!isAuthenticated) return null;

    return (
        <div className={"min-h-screen bg-gradient-to-br from-gray-100 via-blue-100 to-green-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white p-2 sm:p-4 md:p-8 flex flex-col w-full"}>
                    {/* Incoming Ride Requests UI */}
                    {online && incomingRequests.length > 0 && !acceptedRequest && (
                        <div className="mb-8 w-full max-w-2xl mx-auto bg-yellow-50 border border-yellow-300 rounded-xl shadow p-4">
                            <div className="font-bold text-lg text-yellow-800 mb-2">Incoming Ride Requests</div>
                            <ul className="space-y-3">
                                {incomingRequests.map(req => (
                                    <li key={req.id} className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 bg-white rounded-lg p-3 border border-yellow-200">
                                        <div>
                                            <div className="font-semibold text-gray-800">From: <span className="text-blue-700">{req.from_location}</span></div>
                                            <div className="font-semibold text-gray-800">To: <span className="text-blue-700">{req.to_location}</span></div>
                                            <div className="text-xs text-gray-500">Request ID: {req.id.slice(0, 8)}...</div>
                                        </div>
                                        <button className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold shadow hover:bg-green-600 transition" onClick={() => handleAcceptRequest(req)}>Accept</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {/* Show accepted request info */}
                    {acceptedRequest && (
                        <div className="mb-8 w-full max-w-2xl mx-auto bg-green-50 border border-green-300 rounded-xl shadow p-4">
                            <div className="font-bold text-lg text-green-800 mb-2">Accepted Ride Request</div>
                            <div className="font-semibold text-gray-800">From: <span className="text-blue-700">{acceptedRequest.from_location}</span></div>
                            <div className="font-semibold text-gray-800">To: <span className="text-blue-700">{acceptedRequest.to_location}</span></div>
                            <div className="text-xs text-gray-500">Request ID: {acceptedRequest.id.slice(0, 8)}...</div>
                        </div>
                    )}
    <nav className="flex flex-col md:flex-row items-center justify-between w-full py-4 md:py-6 px-2 md:px-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 mb-4 md:mb-6 gap-4 md:gap-0">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-green-400 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white font-extrabold text-2xl tracking-wide">V</span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-400 drop-shadow">CarHere</h1>
                </div>
                <div className="flex flex-wrap gap-2 md:gap-4 justify-center md:justify-end w-full md:w-auto">
                    <button className="px-4 md:px-5 py-2 bg-gradient-to-r from-blue-500 to-green-400 text-white rounded-xl font-semibold shadow hover:scale-105 transition-transform duration-150 text-sm md:text-base" onClick={() => navigate('/driver-profile')}>Profile & Verification</button>
                    <button className="px-4 md:px-5 py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-xl font-semibold shadow hover:scale-105 transition-transform duration-150 text-sm md:text-base" onClick={() => navigate('/driver-settings')}>Settings</button>
                    <button className="px-4 md:px-5 py-2 bg-gradient-to-r from-blue-400 to-green-400 text-white rounded-xl font-semibold shadow hover:scale-105 transition-transform duration-150 text-sm md:text-base" onClick={() => navigate('/driver-pricing')}>Driver Pricing</button>
                </div>
            </nav>
            {/* Online/offline toggle */}
            <div className="flex items-center justify-center w-full my-6 md:my-8">
                <label className="flex items-center gap-3 text-lg font-semibold select-none">
                    <span
                        className={`relative inline-block w-12 h-7 transition duration-200 align-middle select-none cursor-pointer`}
                        onClick={() => setOnline((prev) => !prev)}
                    >
                        <span
                            className={`absolute left-0 top-0 w-12 h-7 rounded-full transition-colors duration-200 ${online ? 'bg-green-500' : 'bg-gray-300'}`}
                        ></span>
                        <span
                            className={`absolute left-1 top-1 w-5 h-5 rounded-full bg-white shadow transform transition-transform duration-200 ${online ? 'translate-x-5' : ''}`}
                        ></span>
                        <input
                            type="checkbox"
                            checked={online}
                            onChange={e => setOnline(e.target.checked)}
                            className="opacity-0 w-12 h-7 absolute cursor-pointer"
                            tabIndex={-1}
                        />
                    </span>
                    <span className={`font-bold text-xl ${online ? 'text-green-600' : 'text-gray-600'}`}>{online ? "Online" : "Offline"}</span>
                </label>
            </div>
            {!online ? (
                <div className="flex items-center justify-center w-full h-48 md:h-64 text-xl md:text-3xl font-extrabold text-gray-400 bg-white/60 dark:bg-gray-800/60 rounded-xl shadow-lg">You are offline</div>
            ) : (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 w-full">
                        <div className="bg-white/80 dark:bg-gray-900/90 backdrop-blur-lg rounded-2xl shadow-xl p-4 md:p-8 w-full border border-gray-200 dark:border-gray-700">
                            <div className="mb-2 font-extrabold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-400">
                                Earnings: ₹{earnings}
                            </div>
                            <button
                                className="text-blue-500 underline text-sm mb-2 hover:text-blue-700 transition"
                                onClick={() => setShowEarningsHistory(true)}
                                type="button"
                            >
                                View Earnings History
                            </button>
                            {avgRating && (
                                <>
                                    <div className="flex items-center gap-2 mt-4 mb-2">
                                        <span className="flex items-center gap-1 text-yellow-500 text-xl font-bold">
                                            {Array.from({ length: 5 }, (_, i) => (
                                                <span key={i}>
                                                    {i < Math.round(avgRating) ? '★' : '☆'}
                                                </span>
                                            ))}
                                        </span>
                                        <span className="ml-2 text-blue-700 text-lg font-bold">{avgRating}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-4 mt-2">
                                        <button
                                            className="text-blue-500 underline text-sm hover:text-blue-700 transition"
                                            onClick={() => setShowRatingHistory(true)}
                                            type="button"
                                        >
                                            View Rating History
                                        </button>
                                        <button
                                            className="text-blue-500 underline text-sm hover:text-blue-700 transition"
                                            onClick={() => setShowRideHistory(true)}
                                            type="button"
                                        >
                                            View Ride History
                                        </button>
                                    </div>
                                </>
                            )}
                    {/* Ride History Modal */}
                    {showRideHistory && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-all duration-300">
                            <div className="bg-white dark:bg-gray-900 dark:text-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative animate-fadeIn">
                                <button className="absolute top-3 right-4 text-3xl text-gray-400 hover:text-blue-600 transition" onClick={() => setShowRideHistory(false)} aria-label="Close">&times;</button>
                                <h2 className="text-2xl font-extrabold mb-6 text-green-700 text-center tracking-wide">Ride History</h2>
                                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {rideHistory.length === 0 ? (
                                        <li className="py-4 text-center text-gray-400">No rides yet.</li>
                                    ) : rideHistory.map((item, idx) => (
                                        <li key={idx} className="py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                            <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                <span className="font-semibold text-gray-700 dark:text-gray-200">{item.date}</span>
                                                <span className="text-blue-600 font-bold">{item.from} → {item.to}</span>
                                            </div>
                                            <span className="text-green-600 font-bold text-lg">₹{item.fare}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                    {/* Earnings History Modal */}
                    {showEarningsHistory && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-all duration-300">
                            <div className="bg-white dark:bg-gray-900 dark:text-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fadeIn">
                                <button className="absolute top-3 right-4 text-3xl text-gray-400 hover:text-blue-600 transition" onClick={() => setShowEarningsHistory(false)} aria-label="Close">&times;</button>
                                <h2 className="text-2xl font-extrabold mb-6 text-blue-700 text-center tracking-wide">Earnings History</h2>
                                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {earningsHistory.length === 0 ? (
                                        <li className="py-4 text-center text-gray-400">No earnings yet.</li>
                                    ) : earningsHistory.map((item, idx) => (
                                        <li key={idx} className="py-3 flex justify-between items-center">
                                            <span className="font-semibold text-gray-700 dark:text-gray-200">{item.date}</span>
                                            <span className="text-green-600 font-bold text-lg">₹{item.amount}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                    {/* Rating History Modal */}
                    {showRatingHistory && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-all duration-300">
                            <div className="bg-white dark:bg-gray-900 dark:text-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fadeIn">
                                <button className="absolute top-3 right-4 text-3xl text-gray-400 hover:text-yellow-500 transition" onClick={() => setShowRatingHistory(false)} aria-label="Close">&times;</button>
                                <h2 className="text-2xl font-extrabold mb-6 text-yellow-500 text-center tracking-wide">Rating History</h2>
                                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {ratingHistory.length === 0 ? (
                                        <li className="py-4 text-center text-gray-400">No ratings yet.</li>
                                    ) : ratingHistory.map((item, idx) => (
                                        <li key={idx} className="py-3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-yellow-500 font-bold text-lg">
                                                    {Array.from({ length: 5 }, (_, i) => (
                                                        <span key={i}>{i < item.rating ? '★' : '☆'}</span>
                                                    ))}
                                                </span>
                                                <span className="text-blue-700 font-semibold">{item.rating}</span>
                                                <span className="text-gray-400 text-xs ml-2">{item.date}</span>
                                            </div>
                                            <div className="text-gray-700 dark:text-gray-300 text-sm italic pl-2 border-l-4 border-yellow-200 dark:border-yellow-600">{item.comment}</div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                        </div>
                        <div className="bg-white/80 dark:bg-gray-900/90 backdrop-blur-lg rounded-2xl shadow-xl p-4 md:p-8 w-full border border-gray-200 dark:border-gray-700 mt-6 lg:mt-0">
                            <div className="font-extrabold mb-4 text-2xl text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-600">Ride Requests</div>
                            <ul className="space-y-4">
                                {requests.length === 0 ? (
                                    <li className="text-gray-400 text-lg">No requests yet.</li>
                                ) : (
                                    requests.map((req) => (
                                        <li key={req.id} className={`p-4 bg-gradient-to-r from-blue-100 to-green-100 dark:from-gray-700 dark:to-gray-800 rounded-xl flex justify-between items-center shadow-md transition-all duration-150 ${selectedRequest && selectedRequest.id === req.id ? "border-4 border-blue-500 scale-105" : "border border-gray-200 dark:border-gray-700"}`}>
                                            <span className="font-semibold text-lg text-gray-800 dark:text-white">{req.rider}: {req.from} → {req.to} <span className="font-bold text-blue-600">(₹{req.fare})</span></span>
                                            <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-green-400 text-white rounded-xl font-semibold shadow hover:scale-110 transition-transform duration-150" onClick={() => setSelectedRequest(req)}>Show Route</button>
                                        </li>
                                    ))
                                )}
                            </ul>
                            {routeInfo.distance && (
                                <div className="mt-6 text-xl font-extrabold text-green-600">Distance: {routeInfo.distance} km</div>
                            )}
                        </div>
                    </div>
                    {/* Show driver map with route and distance when a request is selected */}
                    <div className="w-full mt-6 md:mt-10">
                        {selectedRequest && routeInfo.fromCoords && routeInfo.toCoords ? (
                            <DriverMapView
                                fromCoords={routeInfo.fromCoords}
                                toCoords={routeInfo.toCoords}
                                fromname={selectedRequest.from}
                                toname={selectedRequest.to}
                                distance={routeInfo.distance}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-32 text-lg text-gray-400 bg-white/60 dark:bg-gray-800/60 rounded-xl shadow-lg">Select a ride request and click Show Route to view map</div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default DriverPage;
