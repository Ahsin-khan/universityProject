import React, { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// const SingleMarkerMapComponent = ({ latitude, longitude, onMapClick }) => {
    const SingleMarkerMapComponent = ({ latitude, longitude}) => {
    const mapRef = useRef(null);

    useEffect(() => {
        if (!mapRef.current && latitude !== undefined && longitude !== undefined) {
            // Initialize the map
            const mapInstance = L.map('map', {
                fullscreenControl: true,
            }).setView([latitude, longitude], 13);

            // Add a tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(mapInstance);

            // Use the imported image in your custom icon definition
            const customIcon = L.icon({
                iconUrl: '/images/placeholder.png',
                iconSize: [32, 32],
            });

            // Create a marker and add it to the map
            L.marker([latitude, longitude], { icon: customIcon }).addTo(mapInstance);

            // Add a click event listener to capture the clicked location
            mapInstance.on('click', (event) => {
                const clickedLatitude = event.latlng.lat;
                const clickedLongitude = event.latlng.lng;
                // onMapClick(clickedLatitude, clickedLongitude);
            });

            // Store the map instance in the ref to prevent reinitialization
            mapRef.current = mapInstance;
        }
    }, [mapRef, latitude, longitude]);
// }, [mapRef, latitude, longitude, onMapClick]);

    return <div id="map" style={{ height: '100vh' }}></div>;
};

export default SingleMarkerMapComponent;
