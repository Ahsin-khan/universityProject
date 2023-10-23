// MapComponent.js
import React, { useEffect, useState } from 'react';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS

const MapComponent = ({ onLocationSelect}) => {
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (!map) {
      // Initialize the map
      const mapInstance = L.map('map' , {
        fullscreenControl: true, // Enable fullscreen control
      }).setView([51.505, -0.09], 13);
  
      // Add a tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstance);
  
      // Set up an event listener for user clicks on the map
      mapInstance.on('click', (e) => {
        const { lat, lng } = e.latlng;
        onLocationSelect(lat, lng);
      });

      setMap(mapInstance);
    }
  }, [map, onLocationSelect]);
   // Only runs once when the component mounts

  return <div id="map" style={{ height: '100vh' }}></div>;
};

export default MapComponent;
