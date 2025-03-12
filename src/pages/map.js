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

          // Fetch data from API
          const response = await fetch('/api/fetchFromDatabase', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tableName: 'userData', queryParams }),
          });

          if (!response.ok) throw new Error("Failed to fetch places data");

          const result = await response.json();
          console.log("Fetched places data:", result.items);

          if (result.items.length === 0) return; // No locations

          // Convert coordinates & create markers
          const newMarkers = result.items.map((location) => {
            const latitude = parseFloat(location.latitude.N);
            const longitude = parseFloat(location.longitude.N);

            if (!isNaN(latitude) && !isNaN(longitude)) {
              const latLng = { lat: latitude, lng: longitude };

              // Create a marker
              const marker = new window.google.maps.Marker({
                position: latLng,
                map: map,
                title: location.name.S || 'Location',
              });

              return marker;
            } else {
              console.error("Invalid coordinates:", location);
              return null;
            }
          });

          // Filter out null markers
          const validMarkers = newMarkers.filter((marker) => marker !== null);

          // Adjust the map center & bounds
          if (validMarkers.length > 0) {
            const bounds = new window.google.maps.LatLngBounds();
            validMarkers.forEach(marker => bounds.extend(marker.getPosition()));
            map.fitBounds(bounds); // Adjusts map zoom to fit markers
          }

          setPlaces(validMarkers);
        } catch (error) {
          console.error("Error fetching places:", error);
        }
      };

      fetchPlaces();
    }
  }, [map]);

  // Initialize Google Maps
  useEffect(() => {
    loader.load().then(() => {
      const mapOptions = {
        center: { lat: 37.7749, lng: -122.4194 }, // Default center (San Francisco)
        zoom: 10,
      };

      const newMap = new window.google.maps.Map(document.getElementById('map'), mapOptions);
      setMap(newMap);
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-[#064E65] mb-4">Map of Locations</h1>
      <div id="map" className="w-full max-w-4xl h-96 rounded-lg shadow-lg"></div>
    </div>
  );
};

export default MapLanding;
