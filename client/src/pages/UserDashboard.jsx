import carImg from '../assets/car_embedded.svg';
import { supabase } from '../supabaseClient';
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import indiaLocations from '../data/indiaLocations';

function RoutingMap({ from, to, fromname, toname, handleDistanceUpdate }) {
	const mapRef = useRef(null);
	const markersRef = useRef([]);
	const routeLayersRef = useRef([]);
	const [distance, setDistance] = useState(null);

	delete L.Icon.Default.prototype._getIconUrl;
	L.Icon.Default.mergeOptions({
		iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
		iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
		shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
	});

	const clearAllLayers = () => {
		if (!mapRef.current) return;
		markersRef.current.forEach((m) => mapRef.current.removeLayer(m));
		markersRef.current = [];
		routeLayersRef.current.forEach((l) => mapRef.current.removeLayer(l));
		routeLayersRef.current = [];
		mapRef.current.eachLayer((layer) => {
			if (!(layer instanceof L.TileLayer)) {
				mapRef.current.removeLayer(layer);
			}
		});
	};

	useEffect(() => {
		if (!mapRef.current) {
			mapRef.current = L.map("map").setView([13.0827, 80.2707], 11);
			L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
				attribution: "&copy; OpenStreetMap contributors",
			}).addTo(mapRef.current);
		}

		clearAllLayers();

		if (!from || !to) {
			mapRef.current.setView([13.0827, 80.2707], 11);
			return;
		}

		if (from && to && from.length === 2 && to.length === 2) {
			const [fromLat, fromLng] = from;
			const [toLat, toLng] = to;

			const fromMarker = L.marker([fromLat, fromLng]).addTo(mapRef.current).bindPopup(`From: ${fromname}`);
			const toMarker = L.marker([toLat, toLng]).addTo(mapRef.current).bindPopup(`To: ${toname}`);
			markersRef.current.push(fromMarker, toMarker);

			const url = `https://router.project-osrm.org/route/v1/driving/${fromLng},${fromLat};${toLng},${toLat}?overview=full&geometries=geojson`;
			fetch(url)
				.then((res) => res.json())
				.then((result) => {
					if (!result.routes || result.routes.length === 0) return;
					const route = result.routes[0].geometry;
					const distMeters = result.routes[0].distance;
					const distKm = (distMeters / 1000).toFixed(2);
					setDistance(distKm);
					const geojson = L.geoJSON(route, {
						style: { color: "#000", weight: 4, opacity: 0.7 },
					}).addTo(mapRef.current);
					routeLayersRef.current.push(geojson);
					mapRef.current.fitBounds(geojson.getBounds());
				})
				.catch((err) => console.error("Routing error", err));
		}
	}, [from, to, fromname, toname]);

	useEffect(() => {
		if (handleDistanceUpdate) {
			handleDistanceUpdate(distance);
		}
	}, [distance, handleDistanceUpdate]);

	return (
		<div style={{ height: "100%", width: "100%", position: "relative" }}>
			<div id="map" style={{ height: "100%", width: "100%" }}></div>
		</div>
	);
}

async function geocodePlace(place) {
	const res = await fetch(
		`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`
	);
	const data = await res.json();
	if (data.length > 0)
		return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
	return null;
}


const BASE_FARE = 7;

// Remove static driverList. We'll fetch online drivers from Supabase.

const UserDashboard = () => {
	const [onlineDrivers, setOnlineDrivers] = useState([]);
	// Fetch online drivers from Supabase
	useEffect(() => {
		async function fetchOnlineDrivers() {
			const { data } = await supabase
				.from('drivers_online')
				.select('driver_id, status, updated_at')
				.eq('status', 'online');
			if (data && Array.isArray(data)) {
				// Optionally, fetch driver profile info (name, photo, etc.)
				// For now, just store driver_id
				setOnlineDrivers(data);
			} else {
				setOnlineDrivers([]);
			}
		}
		fetchOnlineDrivers();
		// Optionally, poll every 10 seconds for real-time update
		const interval = setInterval(fetchOnlineDrivers, 10000);
		return () => clearInterval(interval);
	}, []);

	const isDark = (() => {
		const stored = localStorage.getItem('darkMode');
		return stored === 'true';
	})();
	useEffect(() => {
		if (isDark) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}, [isDark]);
	// Payment handler (no Stripe)
	async function handlePayment() {
		const amount = distance ? (distance * BASE_FARE).toFixed(2) : 0;
		const email = userEmail || '';
		if (paymentMethod === 'Card' || paymentMethod === 'UPI') {
			const stripeModule = await import('@stripe/stripe-js');
			const stripe = await stripeModule.loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
			const body = { amount, email };
			const headers = { 'Content-Type': 'application/json' };
			const response = await fetch(`${process.env.REACT_APP_API_URL}/api/create-checkout-session`, {
				method: 'POST',
				headers,
				body: JSON.stringify(body),
			});
			const session = await response.json();
			const result = await stripe.redirectToCheckout({ sessionId: session.sessionId });
			if (result.error) {
				alert(result.error.message);
			}
		} else {
			// Cash or Wallet: just confirm payment
			alert('Payment confirmed!');
			setStep('invoice');
		}
	}

	// Download invoice as text file
	function handleDownloadInvoice() {
		const invoiceText = `Trip Receipt\n\nRider: ${userEmail ? userEmail : 'Guest User'}\nDriver: ${driver?.name}, ${driver?.vehicle}\nPickup: ${from}\nDrop: ${to}\nDistance: ${distance} km\nFare: ₹${(distance * BASE_FARE).toFixed(2)}\nPayment: ${paymentMethod}`;
		const blob = new Blob([invoiceText], { type: 'text/plain' });
		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.download = 'invoice.txt';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
	const [paymentMethod, setPaymentMethod] = useState('Cash');
	// Chat message send handler
	// Funny driver replies
	const funnyReplies = [
		"hlo!",
		"yo yo!",
		"What's up, superstar?",
		"Ready to roll!",
		"I hope you brought snacks!",
		"On my way with turbo speed!",
		"Did you say party? I'm in!",
		"Car here!",
		"You got jokes? I got wheels!",
		"Let's make this ride legendary!"
	];

	function getFunnyReply(userMsg) {
		const msg = userMsg.trim().toLowerCase();
		if (msg === "hii" || msg === "hi" || msg === "hello") {
			return funnyReplies[0 + Math.floor(Math.random() * 2)]; // "hlo!" or "yo yo!"
		}
		if (msg.includes("where are you") || msg.includes("where r you") || msg.includes("where are you")) {
			return "5m to goo!";
		}
		return funnyReplies[Math.floor(Math.random() * funnyReplies.length)];
	}

	function sendChatMessage() {
		if (chatInput.trim()) {
			setChatMessages([...chatMessages, { sender: 'rider', text: chatInput.trim() }]);
			const reply = getFunnyReply(chatInput);
			setChatInput("");
			// Simulate driver funny reply after 1.5s
			setTimeout(() => {
				setChatMessages(msgs => [...msgs, { sender: 'driver', text: reply }]);
			}, 1500);
		}
	}
	const [from, setFrom] = useState("");
	const [to, setTo] = useState("");
	const [fromCoords, setFromCoords] = useState(null);
	const [toCoords, setToCoords] = useState(null);
	const [fromSuggestions, setFromSuggestions] = useState([]);
	const [toSuggestions, setToSuggestions] = useState([]);
	const [searchHistory, setSearchHistory] = useState(() => {
		const saved = localStorage.getItem('ride_history');
		return saved ? JSON.parse(saved) : [];
	});
	const [distance, setDistance] = useState(null);
	const [step, setStep] = useState('booking');
	const [driver, setDriver] = useState(null);
	const [eta, setEta] = useState(null);
	const [showMessageModal, setShowMessageModal] = useState(false);
	const [chatMessages, setChatMessages] = useState([
		{ sender: 'driver', text: 'Hello, I am on the way!' },
		{ sender: 'rider', text: 'Thank you, please come fast.' }
	]);
	const [chatInput, setChatInput] = useState("");
	const [userEmail, setUserEmail] = useState('');

	useEffect(() => {
		async function fetchEmail() {
			const { data } = await supabase.auth.getUser();
			if (data?.user?.email) {
				setUserEmail(data.user.email);
			}
		}
		fetchEmail();
	}, []);

	function handleDistanceUpdate(newDistance) {
		setDistance(newDistance);
		if (newDistance) {
			setEta(Math.ceil(newDistance * 2 + Math.random() * 5));
		}
	}

	async function handleSearch() {
		let fromCoord = null, toCoord = null;
		const fromObj = indiaLocations.find(loc => loc.label.toLowerCase() === from.trim().toLowerCase());
		const toObj = indiaLocations.find(loc => loc.label.toLowerCase() === to.trim().toLowerCase());
		if (fromObj) {
			fromCoord = [fromObj.value.lat, fromObj.value.lng];
		} else {
			fromCoord = await geocodePlace(from);
		}
		if (toObj) {
			toCoord = [toObj.value.lat, toObj.value.lng];
		} else {
			toCoord = await geocodePlace(to);
		}
		if (fromCoord && toCoord) {
			setFromCoords(fromCoord);
			setToCoords(toCoord);
			const newSearch = { from, to, timestamp: new Date().toLocaleString() };
			setSearchHistory((prev) => {
				const exists = prev.some(
					(search) => search.from === from && search.to === to
				);
				let updated;
				if (!exists) {
					updated = [newSearch, ...prev.slice(0, 9)];
				} else {
					updated = prev;
				}
				localStorage.setItem('ride_history', JSON.stringify(updated));
				return updated;
			});
			setStep('matching');
			setTimeout(() => {
				// Pick a random online driver
				if (onlineDrivers.length > 0) {
					// For demo, just use driver_id as name, you can fetch more info if needed
					const randomOnline = onlineDrivers[Math.floor(Math.random() * onlineDrivers.length)];
					setDriver({
						name: randomOnline.driver_id,
						photo: 'https://randomuser.me/api/portraits/lego/1.jpg', // Placeholder, fetch real photo if available
						rating: 5,
						vehicle: 'Online Driver',
						plate: 'N/A',
					});
				} else {
					setDriver(null);
				}
				setStep('assigned');
			}, 2500);
		} else {
			alert("One of the locations could not be found.");
		}
	}

	function handleHistoryClick(historyItem) {
		setFrom(historyItem.from);
		setTo(historyItem.to);
		// setCoords removed (no longer needed)
		setTimeout(async () => {
			const fromCoords = await geocodePlace(historyItem.from);
			const toCoords = await geocodePlace(historyItem.to);
			if (fromCoords && toCoords) {
				// setCoords removed (no longer needed)
			}
		}, 100);
	}

	// Booking Sidebar
	const handleFromChange = (e) => {
		const value = e.target.value;
		setFrom(value);
		if (value.length > 0) {
			setFromSuggestions(indiaLocations.filter(loc => loc.label.toLowerCase().includes(value.toLowerCase())).slice(0, 5));
		} else {
			setFromSuggestions([]);
		}
	};
	const handleToChange = (e) => {
		const value = e.target.value;
		setTo(value);
		if (value.length > 0) {
			setToSuggestions(indiaLocations.filter(loc => loc.label.toLowerCase().includes(value.toLowerCase())).slice(0, 5));
		} else {
			setToSuggestions([]);
		}
	};

	const renderBookingSidebar = () => (
		<div className="flex-1 overflow-y-auto p-6 space-y-6">
			<div className="mb-6">
				<h2 className="text-2xl font-bold text-white mb-2">Book a Ride</h2>
				<p className="text-slate-400">Where would you like to go?</p>
			</div>
			<div className="space-y-4">
				{/* Pickup location */}
				<div className="relative">
					<label className="block text-slate-300 text-sm font-medium mb-2">Pickup Location</label>
					<div className="flex items-center space-x-3">
						<div className="w-3 h-3 bg-cyan-400 rounded-full flex-shrink-0"></div>
						<div className="flex-1">
							<input
								type="text"
								value={from}
								onChange={handleFromChange}
								placeholder="Enter pickup location"
								className="px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg w-full text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none transition-all"
								autoComplete="off"
							/>
							{fromSuggestions.length > 0 && (
								<div className="absolute z-10 bg-slate-700 border border-slate-600 rounded-lg w-full mt-1 shadow-xl max-h-48 overflow-y-auto">
									{fromSuggestions.map((loc, idx) => (
										<div
											key={idx}
											className="px-4 py-3 cursor-pointer hover:bg-slate-600 text-white transition-colors"
											onClick={() => { setFrom(loc.label); setFromSuggestions([]); }}
										>
											{loc.label}
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
				{/* Drop-off location */}
				<div className="relative">
					<label className="block text-slate-300 text-sm font-medium mb-2">Drop-off Location</label>
					<div className="flex items-center space-x-3">
						<div className="w-3 h-3 bg-emerald-400 rounded-sm flex-shrink-0"></div>
						<div className="flex-1">
							<input
								type="text"
								value={to}
								onChange={handleToChange}
								placeholder="Enter drop-off location"
								className="px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg w-full text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-all"
								autoComplete="off"
							/>
							{toSuggestions.length > 0 && (
								<div className="absolute z-10 bg-slate-700 border border-slate-600 rounded-lg w-full mt-1 shadow-xl max-h-48 overflow-y-auto">
									{toSuggestions.map((loc, idx) => (
										<div
											key={idx}
											className="px-4 py-3 cursor-pointer hover:bg-slate-600 text-white transition-colors"
											onClick={() => { setTo(loc.label); setToSuggestions([]); }}
										>
											{loc.label}
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
				{/* Fare Estimate Card */}
				<div className="bg-slate-700/50 border border-slate-600/50 rounded-lg p-4 mt-6">
					<div className="flex items-center gap-2 mb-2">
						<span className="text-lg">💰</span>
						<h3 className="font-semibold text-white">Fare Estimate</h3>
					</div>
					{distance ? (
						<div className="space-y-2">
							<div className="flex justify-between text-slate-300">
								<span>Distance:</span>
								<span>{distance} km</span>
							</div>
							<div className="flex justify-between text-slate-300">
								<span>ETA:</span>
								<span>{eta >= 60 ? `${Math.floor(eta / 60)} hr${eta >= 120 ? 's' : ''}` : `${eta} min`}</span>
							</div>
							<div className="border-t border-slate-600 pt-2 mt-2">
								<div className="flex justify-between text-lg font-bold text-cyan-400">
									<span>Total:</span>
									<span>₹{(distance * BASE_FARE).toFixed(2)}</span>
								</div>
							</div>
						</div>
					) : (
						<p className="text-slate-400">Enter pickup and drop-off locations to see fare estimate</p>
					)}
				</div>
				<button
					onClick={handleSearch}
					className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold py-3 rounded-lg hover:from-cyan-500 hover:to-blue-600 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
					disabled={!(from && to)}
				>
					<span className="flex items-center justify-center gap-2">
						<span>🚗</span>
						Find Driver
					</span>
				</button>
			</div>
			{/* Search History */}
			{searchHistory.length > 0 && (
				<div className="mt-6 space-y-3">
					<h3 className="text-sm font-medium text-white flex items-center gap-2">
						<span>🕰️</span>
						Recent Searches
					</h3>
					<div className="space-y-2 max-h-64 overflow-y-auto">
						{searchHistory.map((search, index) => (
							<div
								key={index}
								onClick={() => handleHistoryClick(search)}
								className="p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg cursor-pointer hover:bg-slate-600/50 transition-colors group"
							>
								<div className="flex items-center space-x-2 text-sm">
									<div className="w-2 h-2 bg-cyan-400 rounded-full flex-shrink-0"></div>
									<span className="text-slate-200 flex-1 group-hover:text-white">{search.from}</span>
								</div>
								<div className="flex items-center space-x-2 text-sm mt-1">
									<div className="w-2 h-2 bg-emerald-400 rounded-sm flex-shrink-0"></div>
									<span className="text-slate-200 flex-1 group-hover:text-white">{search.to}</span>
								</div>
								<div className="text-xs text-slate-400 mt-2 group-hover:text-slate-300">{search.timestamp}</div>
							</div>
						))}
					</div>
					<button
						onClick={() => {setSearchHistory([]); localStorage.setItem('ride_history', JSON.stringify([])); }}
						className="w-full text-sm text-slate-400 hover:text-white py-2 px-3 rounded-lg hover:bg-slate-700/50 transition-colors"
					>
						🗑️ Clear History
					</button>
				</div>
			)}
		</div>
	);

	// Driver Matching Screen
	const renderMatchingSidebar = () => (
		<div className="flex-1 flex flex-col items-center justify-center p-8">
			<div className="text-center mb-8">
				<div className="relative mb-6">
					<div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center mx-auto animate-pulse">
						<span className="text-3xl">🔍</span>
					</div>
					<div className="absolute -inset-4 rounded-full border-2 border-cyan-400/30 animate-ping"></div>
					<div className="absolute -inset-2 rounded-full border-2 border-blue-400/20 animate-ping animation-delay-150"></div>
				</div>
				<h3 className="text-2xl font-bold text-white mb-2">Finding Your Driver</h3>
				<p className="text-slate-400 mb-2">Connecting you with nearby drivers...</p>
				<div className="flex items-center justify-center gap-1 text-cyan-400">
					<div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
					<div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce animation-delay-75"></div>
					<div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce animation-delay-150"></div>
				</div>
			</div>
			<button 
				className="mt-8 px-8 py-3 bg-slate-700 text-slate-300 rounded-lg font-medium border border-slate-600 hover:bg-slate-600 hover:text-white transition-all" 
				onClick={() => setStep('booking')}
			>
				Cancel Search
			</button>
		</div>
	);

	// Driver Assigned Screen
	const renderAssignedSidebar = () => (
		<div className="flex-1 flex flex-col items-center justify-center p-6">
			<div className="w-full max-w-xs bg-slate-700/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-600/50 p-6 flex flex-col items-center">
				<div className="mb-4">
					<div className="relative">
						<img src={driver?.photo} alt="Driver" className="w-24 h-24 rounded-full object-cover border-4 border-cyan-400 shadow-lg" />
						<div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-400 rounded-full border-2 border-slate-700 flex items-center justify-center">
							<span className="text-xs text-white">✓</span>
						</div>
					</div>
				</div>
				<div className="text-center mb-4">
					<h3 className="font-bold text-xl text-white mb-1">{driver?.name}</h3>
					<p className="text-slate-300 text-sm mb-2">{driver?.vehicle} <span className="text-slate-400">({driver?.plate})</span></p>
					<div className="flex items-center justify-center gap-1 text-yellow-400 font-medium">
						<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" className="w-4 h-4"><path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z" /></svg>
						<span>{driver?.rating}</span>
					</div>
				</div>
				<div className="w-full space-y-3 mb-4">
					<div className="flex justify-between items-center p-3 bg-slate-600/30 rounded-lg">
						<span className="text-slate-300">Arriving in:</span>
						<span className="font-bold text-cyan-400">{eta >= 60 ? `${Math.floor(eta / 60)} hr${eta >= 120 ? 's' : ''}` : `${eta} min`}</span>
					</div>
					<div className="flex justify-between items-center p-3 bg-slate-600/30 rounded-lg">
						<span className="text-slate-300">Total Fare:</span>
						<div className="text-right">
							<div className="font-bold text-emerald-400">₹{(distance * BASE_FARE).toFixed(2)}</div>
							<div className="text-xs text-slate-400">{distance} km</div>
						</div>
					</div>
				</div>
				<div className="flex gap-3 mb-4 w-full">
					<button 
						className="flex-1 py-2.5 bg-slate-600 text-white rounded-lg font-medium shadow hover:bg-slate-500 transition-colors" 
						onClick={() => setShowMessageModal(true)}
					>
						💬 Message
					</button>
					<button 
						className="flex-1 py-2.5 bg-red-500/80 text-white rounded-lg font-medium shadow hover:bg-red-500 transition-colors" 
						onClick={() => setStep('booking')}
					>
						Cancel
					</button>
				</div>
				<button 
					className="w-full bg-gradient-to-r from-emerald-400 to-cyan-500 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:from-emerald-500 hover:to-cyan-600 transition-all duration-300" 
					onClick={() => setStep('inprogress')}
				>
					🚗 Start Ride
				</button>
			</div>
			{/* Message Modal - Chat Box Style */}
			{showMessageModal && (
				<div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black bg-opacity-50">
					<div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 w-[380px] min-h-[340px] flex flex-col relative border border-gray-200 dark:border-gray-800">
						<div className="font-bold text-center text-xl mb-4">Chat with {driver?.name}</div>
						<div className="flex-1 overflow-y-auto mb-4 border border-gray-100 dark:border-gray-800 rounded-lg p-3 bg-gray-50 dark:bg-gray-800" style={{ maxHeight: '180px' }}>
							{chatMessages.map((msg, idx) => (
								<div key={idx} className={`mb-3 flex ${msg.sender === 'rider' ? 'justify-end' : 'justify-start'}`}>
									<div className={`px-4 py-2 rounded-xl text-sm font-medium shadow ${msg.sender === 'rider' ? 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100' : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100'}`} style={{ minWidth: '120px', maxWidth: '80%' }}>
										<span className="font-semibold mr-1">{msg.sender === 'rider' ? 'You:' : `${driver?.name}:`}</span>{msg.text}
									</div>
								</div>
							))}
						</div>
						<form className="flex gap-2 items-center" onSubmit={e => { e.preventDefault(); sendChatMessage(); }}>
							<input
								type="text"
								className="flex-1 border border-gray-300 dark:border-gray-700 rounded-lg p-2 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-400"
								placeholder="Type your message..."
								value={chatInput}
								onChange={e => setChatInput(e.target.value)}
								onKeyDown={e => { if (e.key === 'Enter') sendChatMessage(); }}
								style={{ minWidth: '0' }}
							/>
							<button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition">Send</button>
							<button type="button" className="px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:text-white rounded-lg font-semibold shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition" onClick={() => setShowMessageModal(false)}>Close</button>
						</form>
					</div>
				</div>
			)}
		</div>
	);

	// Ride In Progress Screen
	const renderInProgressSidebar = () => (
		<div className="flex-1 flex flex-col items-center justify-center p-6">
			<div className="w-full max-w-xs bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 p-6 flex flex-col items-center">
				<div className="mb-3">
					<img src={carImg} alt="Car" className="w-28 h-20 object-contain rounded-xl shadow-md" />
				</div>
				<div className="font-extrabold text-xl text-gray-900 dark:text-white mb-1">Ride in Progress</div>
				<div className="mb-2">
					<span className="font-semibold text-blue-700 dark:text-blue-300">ETA:</span>
					<span className="font-bold text-blue-700 dark:text-blue-300 ml-1">
						{eta >= 60 ? `${Math.floor(eta / 60)} hr${eta >= 120 ? 's' : ''}` : `${eta} min`}
					</span>
				</div>
				<div className="mb-2 text-green-700 dark:text-green-400 font-bold text-lg">
					Total: <span>₹{(distance * BASE_FARE).toFixed(2)}</span> <span className="text-gray-500 dark:text-gray-300 font-normal text-base">| {distance} km</span>
				</div>
				<div className="mb-2 text-green-600 dark:text-green-400 font-semibold">On the way…</div>
				<button className="w-full bg-black dark:bg-gray-100 text-white dark:text-black py-3 rounded-xl font-bold text-lg shadow hover:bg-gray-800 dark:hover:bg-gray-200 transition duration-200 mt-2" onClick={() => setStep('payment')}>End Ride</button>
			</div>
		</div>
	);

	// Payment Screen
	// Modern payment sidebar with rating feature

	// Rating state for Trip Summary card (support half-stars)
	const [userRating, setUserRating] = useState(0); // can be 0.5, 1, 1.5, ... 5
	const [ratingSubmitted, setRatingSubmitted] = useState(false);

	const renderPaymentSidebar = () => (
		<div className="flex-1 flex flex-col items-center justify-center p-6">
			<div className="w-full max-w-xs bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 p-6 flex flex-col items-center">
				<div className="font-extrabold text-xl text-gray-900 dark:text-white mb-3">Trip Summary</div>
				<div className="mb-1 text-gray-700 dark:text-gray-200 text-base">Pickup: <span className="font-semibold">{from}</span></div>
				<div className="mb-1 text-gray-700 dark:text-gray-200 text-base">Drop: <span className="font-semibold">{to}</span></div>
				<div className="mb-1 text-gray-700 dark:text-gray-200 text-base">Distance: <span className="font-semibold">{distance} km</span></div>
				<div className="mb-1 text-gray-700 dark:text-gray-200 text-base">Fare: <span className="font-semibold">₹{(distance * BASE_FARE).toFixed(2)}</span></div>
				<div className="mb-2 font-bold text-green-700 dark:text-green-400 text-lg">Total: ₹{(distance * BASE_FARE).toFixed(2)} <span className="text-gray-500 dark:text-gray-300 font-normal text-base">| {distance} km</span></div>
				<div className="mb-3 w-full flex flex-col items-center">
					<label className="font-semibold text-gray-800 dark:text-gray-100 mb-1">Payment Method:</label>
					<select
						className="border rounded px-2 py-1 w-full dark:bg-gray-800 dark:text-white"
						value={paymentMethod}
						onChange={e => setPaymentMethod(e.target.value)}
					>
						<option value="Cash">Cash</option>
						<option value="Card">Card</option>
						<option value="UPI">UPI</option>
						<option value="Wallet">Wallet</option>
					</select>
				</div>
				{paymentMethod === 'Cash' && step !== 'invoice' && (
					<button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold text-lg shadow transition duration-200 mt-2" onClick={handlePayment}>Confirm Payment</button>
				)}
				{paymentMethod !== 'Cash' && step !== 'invoice' && (
					<div className="mb-2 p-3 border rounded bg-gray-50 dark:bg-gray-800 w-full">
						<button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full font-semibold shadow transition" onClick={handlePayment}>Pay with Stripe</button>
					</div>
				)}
				{/* Rating feature after payment on Trip Summary card */}
				{/* Rating feature always on Trip Summary card, not on invoice/receipt */}
				{!ratingSubmitted && (
					<div className="mt-6 w-full flex flex-col items-center">
						<div className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Rate Your Ride:</div>
						<div className="flex gap-2 mb-3">
							{[1, 2, 3, 4, 5].map(star => (
								<button
									key={star}
									type="button"
									className="bg-transparent border-none p-0 m-0 cursor-pointer"
									onClick={() => setUserRating(star)}
									aria-label={`Rate ${star} stars`}
								>
									<svg viewBox="0 0 24 24" width="32" height="32" className={userRating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600 fill-current'}>
										<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
									</svg>
								</button>
							))}
						</div>
						<button
							className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold shadow transition"
							onClick={() => setRatingSubmitted(true)}
							disabled={userRating === 0}
						>
							Submit Rating
						</button>
					</div>
				)}
				{ratingSubmitted && (
					<div className="mt-6 w-full flex flex-col items-center">
						<div className="font-semibold text-green-700 dark:text-green-400 mb-2">Thank you for rating your ride!</div>
						<div className="flex gap-2">
							{[1, 2, 3, 4, 5].map(star => (
								<svg key={star} viewBox="0 0 24 24" width="32" height="32" className={userRating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600 fill-current'}>
									<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
								</svg>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);

	// Invoice Screen
	const renderInvoiceSidebar = () => {
		const now = new Date();
		const dateStr = now.toLocaleDateString();
		const timeStr = now.toLocaleTimeString();
		const txnNum = 'TXN' + Math.floor(100000 + Math.random() * 900000);
		return (
			<div className="flex-1 flex flex-col items-center justify-center p-6">
				<div className="w-full max-w-xs bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 p-6 flex flex-col items-center">
					<div className="font-extrabold text-xl text-gray-900 dark:text-white mb-3">Trip Receipt</div>
					<div className="mb-1 text-gray-700 dark:text-gray-200 text-base">Date: <span className="font-semibold">{dateStr}</span></div>
					<div className="mb-1 text-gray-700 dark:text-gray-200 text-base">Time: <span className="font-semibold">{timeStr}</span></div>
					<div className="mb-1 text-gray-700 dark:text-gray-200 text-base">Rider: <span className="font-semibold">{userEmail ? userEmail : 'Guest User'}</span></div>
					<div className="mb-1 text-gray-700 dark:text-gray-200 text-base">Driver: <span className="font-semibold">{driver?.name}, {driver?.vehicle}</span></div>
					<div className="mb-1 text-gray-700 dark:text-gray-200 text-base">Pickup: <span className="font-semibold">{from}</span></div>
					<div className="mb-1 text-gray-700 dark:text-gray-200 text-base">Drop: <span className="font-semibold">{to}</span></div>
					<div className="mb-1 text-gray-700 dark:text-gray-200 text-base">Distance: <span className="font-semibold">{distance} km</span></div>
					<div className="mb-1 text-gray-700 dark:text-gray-200 text-base">Fare: <span className="font-semibold">₹{(distance * BASE_FARE).toFixed(2)}</span></div>
					<div className="mb-1 text-gray-700 dark:text-gray-200 text-base">Payment: <span className="font-semibold">{paymentMethod}</span></div>
					{paymentMethod !== 'Cash' && (
						<div className="mb-1 text-gray-700 dark:text-gray-200 text-base">Transaction #: <span className="font-semibold">{txnNum}</span></div>
					)}
					<button className="w-full bg-gray-900 dark:bg-gray-100 text-white dark:text-black py-3 rounded-xl font-bold text-lg shadow hover:bg-gray-800 dark:hover:bg-gray-200 transition duration-200 mt-4" onClick={handleDownloadInvoice}>Download Invoice</button>
					<button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-lg shadow transition duration-200 mt-2" onClick={() => setStep('booking')}>Book Another Ride</button>
				</div>
			</div>
		);
	};

	return (
		<div className="min-h-screen flex flex-col bg-slate-950">
			{/* Top Navbar */}
			<nav className="w-full flex items-center justify-between px-8 py-4 bg-slate-900/95 border-b border-slate-800 backdrop-blur-sm">
				<div className="flex items-center gap-6">
					<div className="flex items-center space-x-3">
						<div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
							<span className="text-white font-bold text-xl">V</span>
						</div>
						<h1 className="text-2xl font-bold text-white tracking-tight">CarHere</h1>
						<div className="hidden md:flex items-center gap-4 ml-8">
							<button 
								type="button" 
								onClick={() => setStep('booking')} 
								className={`px-4 py-2 rounded-lg font-medium transition-colors ${
									step === 'booking' 
										? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/30' 
										: 'text-slate-300 hover:text-white hover:bg-slate-800'
								}`}
							>
								Booking
							</button>
							<Link 
								to="/pricing" 
								className="px-4 py-2 text-slate-300 font-medium rounded-lg hover:text-white hover:bg-slate-800 transition-colors"
							>
								Pricing
							</Link>
						</div>
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
					<button 
						onClick={() => supabase.auth.signOut().then(() => window.location.href = '/')}
						className="px-4 py-2 bg-slate-800 text-slate-300 font-medium rounded-lg border border-slate-700 hover:bg-slate-700 hover:text-white transition-all"
					>
						Logout
					</button>
				</div>
			</nav>
			{/* Main Content */}
			<div className="flex flex-1 flex-col lg:flex-row gap-6 p-6 w-full">
				{/* Sidebar */}
				<div className="bg-slate-800/90 backdrop-blur-xl shadow-xl flex flex-col rounded-2xl border border-slate-700/50 w-full max-w-full md:max-w-md">
					{/* Step-based sidebar */}
					{step === 'booking' && renderBookingSidebar()}
					{step === 'matching' && renderMatchingSidebar()}
					{step === 'assigned' && renderAssignedSidebar()}
					{step === 'inprogress' && renderInProgressSidebar()}
					{step === 'payment' && renderPaymentSidebar()}
					{step === 'invoice' && renderInvoiceSidebar()}
				</div>
				{/* Map Area */}
				<div className="relative bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-xl flex-1 min-h-[300px] md:min-h-[500px] lg:min-h-[600px] max-h-[900px] overflow-hidden border border-slate-700/50 mt-4 lg:mt-0">
					<RoutingMap
						from={fromCoords}
						to={toCoords}
						fromname={from}
						toname={to}
						handleDistanceUpdate={handleDistanceUpdate}
					/>
				</div>
				{/* Ride History Section (Profile) */}
				{step === 'profile' && (
					<div className="w-full max-w-full md:max-w-md mx-auto bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-xl p-4 md:p-8 mt-4 md:mt-8">
						<h2 className="text-xl md:text-2xl font-extrabold text-blue-800 mb-4">Ride History</h2>
						{searchHistory.length === 0 ? (
							<div className="text-gray-500 mb-4">No rides yet.</div>
						) : (
							<ul className="divide-y divide-gray-200 mb-4">
								{searchHistory.map((ride, idx) => (
									<li key={idx} className="py-2 md:py-3">
										<div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 mb-1">
											<span className="text-blue-700 font-semibold">{ride.from} → {ride.to}</span>
											<span className="text-gray-400 text-xs sm:ml-2">{ride.timestamp}</span>
										</div>
									</li>
								))}
							</ul>
						)}
						<button className="w-full md:w-auto px-5 py-2 bg-gradient-to-r from-pink-500 to-red-400 text-white rounded-lg font-semibold shadow hover:scale-105 transition-transform duration-150">Support / Dispute</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default UserDashboard;
