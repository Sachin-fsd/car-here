
import React, { useRef, useEffect } from 'react';
import maplibregl from 'maplibre-gl';

const VroomMap = ({ zoom = 14, setZoom, pickup, dropoff, showRoute, carMarker, zoomOnClick }) => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapContainer.current) return;
    if (mapRef.current) return;
    // Default center: India
      mapRef.current = new maplibregl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            satellite: {
              type: 'raster',
              tiles: [
                'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
              ],
              tileSize: 256,
              attribution: 'Tiles © Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            }
          },
          layers: [
            {
              id: 'satellite',
              type: 'raster',
              source: 'satellite',
              minzoom: 0,
              maxzoom: 22
            }
          ]
        },
        // Always center on Bangalore (longitude, latitude)
        center: [77.5946, 12.9716],
        zoom: zoom,
        maxZoom: 20
      });
    mapRef.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    // Zoom on click
    if (zoomOnClick) {
      mapRef.current.on('click', (e) => {
        mapRef.current.flyTo({ center: [e.lngLat.lng, e.lngLat.lat], zoom: mapRef.current.getZoom() + 1 });
      });
    }
  }, [zoomOnClick, zoom]);

  // Helper: Calculate distance between two lat/lng points (Haversine formula)
  function calcDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  useEffect(() => {
    if (!mapRef.current) return;
    // Remove previous markers
    if (mapRef.current.markers) {
      mapRef.current.markers.forEach(m => m.remove());
    }
    mapRef.current.markers = [];

    // Car marker (simulate car at pickup)
    if (carMarker && pickup) {
      const carEl = document.createElement('div');
      carEl.style.width = '32px';
      carEl.style.height = '32px';
      carEl.style.background = 'none';
      carEl.innerHTML = '<svg width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="#fff" stroke="#333" stroke-width="2"/><rect x="10" y="14" width="12" height="6" rx="3" fill="#0074D9"/><rect x="13" y="16" width="6" height="2" rx="1" fill="#fff"/></svg>';
      const carMarkerObj = new maplibregl.Marker({ element: carEl }).setLngLat([pickup.lng, pickup.lat]).addTo(mapRef.current);
      mapRef.current.markers.push(carMarkerObj);
    }

    // Pickup marker
    if (pickup) {
      const pickupMarker = new maplibregl.Marker({ color: 'green' }).setLngLat([pickup.lng, pickup.lat]).addTo(mapRef.current);
      mapRef.current.markers.push(pickupMarker);
    }
    // Dropoff marker
    if (dropoff) {
      const dropoffMarker = new maplibregl.Marker({ color: 'red' }).setLngLat([dropoff.lng, dropoff.lat]).addTo(mapRef.current);
      mapRef.current.markers.push(dropoffMarker);
    }

    // Route line and distance label
    if (showRoute && pickup && dropoff) {
      // Remove previous route
      if (mapRef.current.getLayer('route')) {
        mapRef.current.removeLayer('route');
      }
      if (mapRef.current.getSource('route')) {
        mapRef.current.removeSource('route');
      }
      // Fetch real route from OpenRouteService
      const apiKey = '5b3ce35978...'; // Replace with your actual OpenRouteService API key
      const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${pickup.lng},${pickup.lat}&end=${dropoff.lng},${dropoff.lat}`;
      fetch(url)
        .then(res => res.json())
        .then(data => {
          if (!data.features || !data.features[0]) throw new Error('No route');
          const coords = data.features[0].geometry.coordinates;
          // Draw route polyline (follows roads)
          mapRef.current.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: coords
              }
            }
          });
          mapRef.current.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: { 'line-join': 'round', 'line-cap': 'round' },
            paint: { 'line-color': '#0074D9', 'line-width': 4 }
          });
          // Calculate route distance
          let totalDist = 0;
          for (let i = 1; i < coords.length; i++) {
            totalDist += calcDistance(coords[i-1][1], coords[i-1][0], coords[i][1], coords[i][0]);
          }
          // Do NOT fit map to route bounds, keep Bangalore center
          // Add distance label at midpoint
          const midIdx = Math.floor(coords.length / 2);
          const midLng = coords[midIdx][0];
          const midLat = coords[midIdx][1];
          const distanceLabel = document.createElement('div');
          distanceLabel.style.background = 'black';
          distanceLabel.style.color = 'white';
          distanceLabel.style.padding = '6px 12px';
          distanceLabel.style.borderRadius = '8px';
          distanceLabel.style.fontWeight = 'bold';
          distanceLabel.style.fontSize = '16px';
          distanceLabel.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
          distanceLabel.innerText = `${totalDist.toFixed(2)} km`;
          const distanceMarker = new maplibregl.Marker({ element: distanceLabel })
            .setLngLat([midLng, midLat])
            .addTo(mapRef.current);
          mapRef.current.markers.push(distanceMarker);
        })
        .catch(() => {
          // Fallback to straight line if API fails
          mapRef.current.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: [
                  [pickup.lng, pickup.lat],
                  [dropoff.lng, dropoff.lat]
                ]
              }
            }
          });
          mapRef.current.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: { 'line-join': 'round', 'line-cap': 'round' },
            paint: { 'line-color': '#0074D9', 'line-width': 4 }
          });
          const dist = calcDistance(pickup.lat, pickup.lng, dropoff.lat, dropoff.lng);
          const midLat = (pickup.lat + dropoff.lat) / 2;
          const midLng = (pickup.lng + dropoff.lng) / 2;
          const distanceLabel = document.createElement('div');
          distanceLabel.style.background = 'black';
          distanceLabel.style.color = 'white';
          distanceLabel.style.padding = '6px 12px';
          distanceLabel.style.borderRadius = '8px';
          distanceLabel.style.fontWeight = 'bold';
          distanceLabel.style.fontSize = '16px';
          distanceLabel.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
          distanceLabel.innerText = `${dist.toFixed(2)} km`;
          const distanceMarker = new maplibregl.Marker({ element: distanceLabel })
            .setLngLat([midLng, midLat])
            .addTo(mapRef.current);
          mapRef.current.markers.push(distanceMarker);
        });
    }
  }, [pickup, dropoff, showRoute, carMarker]);

  return (
    <div style={{ width: '100%', height: '400px', minHeight: '400px', background: '#eaeaea', borderRadius: '12px', overflow: 'hidden' }}>
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default VroomMap;
