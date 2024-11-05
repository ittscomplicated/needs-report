// pages/MapLanding.js
import React, { useEffect, useState } from 'react';
import loader from '../utils/googleMapsLoader';

const MapLanding = () => {
  const [map, setMap] = useState(null);
  const [places, setPlaces] = useState([]);

  // Fetch places and create markers when the map is ready
  useEffect(() => {
    if (map) {
      const fetchPlaces = async () => {
        try {
          const queryParams = {
            FilterExpression: "attribute_exists(userID)",
          };

          // Call the API route and pass table name and query parameters
          const response = await fetch('/api/fetchFromDatabase', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tableName: 'userData', queryParams }),
          });

          if (!response.ok) {
            throw new Error("Failed to fetch places data");
          }

          const result = await response.json();
          console.log("Fetched places data:", result.items);

          // Add each location as a marker on the map
          const newMarkers = result.items.map((location) => {
            // Extract the nested string values and convert them to numbers
            const latitude = parseFloat(location.latitude.N);
            const longitude = parseFloat(location.longitude.N);

            // Check if latitude and longitude are valid numbers
            if (!isNaN(latitude) && !isNaN(longitude)) {
              const latLng = { lat: latitude, lng: longitude };

              // Create a marker and add it to the map
              const marker = new window.google.maps.Marker({
                position: latLng,
                map: map, // Attach the map instance
                title: location.name.S || 'Location',
              });
              return marker;
            } else {
              console.error(`Invalid coordinates for location:`, location);
              return null;
            }
          });

          // Filter out any null markers and set state
          setPlaces(newMarkers.filter((marker) => marker !== null));
        } catch (error) {
          console.error("Error fetching places:", error);
        }
      };

      fetchPlaces();
    }
  }, [map]); // Run only when the map is initialized

  // Initialize Google Maps
  useEffect(() => {
    loader.load().then(() => {
      const mapOptions = {
        center: { lat: -25.344, lng: 131.031 }, // Default center
        zoom: 0,
      };

      const newMap = new window.google.maps.Map(
        document.getElementById('map'),
        mapOptions
      );

      setMap(newMap); // Set the map instance
    });
  }, []); // Load map on component mount

  return (
    <div>
      <h1>Google Maps Example</h1>
      <div id="map" style={{ height: '400px', width: '100%' }}></div>
    </div>
  );
};

export default MapLanding;
