import React, { useEffect, useRef } from 'react';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const Map = ({ lat, lng }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    if (isLoaded && mapRef.current) {
      const position = { lat, lng };

      // Remove existing marker if it exists
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }

      // Add new marker
      markerRef.current = new google.maps.Marker({
        map: mapRef.current,
        position,
      });

      // Center the map on the new position
      mapRef.current.setCenter(position);
    }
  }, [lat, lng, isLoaded]);

  const onLoad = (map) => {
    mapRef.current = map;

    const position = { lat, lng };

    // Initialize the marker on map load
    markerRef.current = new google.maps.Marker({
      map: mapRef.current,
      position,
    });

    // Center the map on the initial position
    map.setCenter(position);
  };

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading Maps...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={{ lat, lng }}
      zoom={10}
      onLoad={onLoad}
    />
  );
};

export default Map;
