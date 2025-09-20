
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";


const DriverMapView = ({ fromCoords, toCoords, fromname, toname }) => {
  const [route, setRoute] = useState([]);
  const [actualDistance, setActualDistance] = useState(null);
  // Always call hooks first
  const position1 = fromCoords ? [fromCoords.lat, fromCoords.lng] : null;
  const position2 = toCoords ? [toCoords.lat, toCoords.lng] : null;
  const bounds = position1 && position2 ? [position1, position2] : null;

  useEffect(() => {
    if (!fromCoords || !toCoords) return;
    // Fetch route from OSRM API
    const fetchRoute = async () => {
      const url = `https://router.project-osrm.org/route/v1/driving/${fromCoords.lng},${fromCoords.lat};${toCoords.lng},${toCoords.lat}?overview=full&geometries=geojson`;
      try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.routes && data.routes.length > 0) {
          setRoute(data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]));
          setActualDistance((data.routes[0].distance / 1000).toFixed(2)); // meters to km
        } else {
          setRoute([]);
          setActualDistance(null);
        }
      } catch (e) {
        setRoute([]);
        setActualDistance(null);
      }
    };
    fetchRoute();
  }, [fromCoords, toCoords]);

  if (!fromCoords || !toCoords) return null;

  return (
    <div className="rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 p-4 flex flex-col items-center w-full max-w-3xl mx-auto">
      <div className="w-full text-center mb-2 text-lg font-bold text-blue-600 dark:text-blue-300">Route Map</div>
      <MapContainer
        center={position1}
        bounds={bounds}
        zoom={7}
        style={{ height: "500px", width: "100%", borderRadius: "1rem", boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.2)" }}
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://osm.org/copyright'>OpenStreetMap</a> contributors"
        />
        <Marker position={position1}>
          <Popup>
            {fromname}
          </Popup>
        </Marker>
        <Marker position={position2}>
          <Popup>
            {toname}
          </Popup>
        </Marker>
        {route.length > 0 && <Polyline positions={route} color="blue" />} 
        <Popup position={[(position1[0] + position2[0]) / 2, (position1[1] + position2[1]) / 2]}>
          Distance: {actualDistance ? `${actualDistance} km` : "-"}
        </Popup>
      </MapContainer>
      <div className="mt-4 text-xl font-semibold text-green-700 dark:text-green-400">Distance: {actualDistance ? `${actualDistance} km` : "-"}</div>
    </div>
  );
};

export default DriverMapView;
