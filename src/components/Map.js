// pages/MapLanding.js
import React, { useEffect, useState } from 'react';
import loader from '../utils/googleMapsLoader';

const MapLanding = () => {
  const [map, setMap] = useState(null);
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const queryParams = {
          FilterExpression: "attribute_exists(id)",
        };

        // Call the API route and pass table name and query parameters
        const response = await fetch('/api/fetchFromDatabase', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ tableName: 'CoordinateData', queryParams }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch places data");
        }

        const result = await response.json();
        console.log("Fetched places data:", result.items);
        
        // Add each location as a marker on the map
        result.items.forEach((location) => {
          const latLng = { lat: location.Latitude, lng: location.Longitude };

          console.log("Adding marker at:", latLng);

          // Create a marker and add it to the map
          const marker = new window.google.maps.Marker({
            position: latLng,
            map: map,
            title: location.title || 'Location',
          });
          setPlaces((prevPlaces) => [...prevPlaces, marker]);
        });
      } catch (error) {
        console.error("Error fetching places:", error);
      }
    };

    // Initialize Google Maps and load markers when map is ready
    loader.load().then(() => {
      const mapOptions = {
        center: { lat: -25.344, lng: 131.031 }, // Default center
        zoom: 8,
      };

      const newMap = new window.google.maps.Map(
        document.getElementById('map'),
        mapOptions
      );

      setMap(newMap);
      fetchPlaces(); // Fetch and display places after map is ready
    });
  }, []); // Empty dependency array to load on mount

  return (
    <div>
      <h1>Google Maps Example</h1>
      <div id="map" style={{ height: '400px', width: '100%' }}></div>
    </div>
  );
};

export default MapLanding;
