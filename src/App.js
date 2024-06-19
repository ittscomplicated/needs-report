import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import React from 'react';

const libraries = ['places'];
const mapContainerStyle = {
  width: '100vw',
  height: '100vh',
};

const google = window.google

const center = {
  lat: 7.2905715, // default latitude
  lng: 80.6337262, // default longitude
};

const App = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyDrEoW_12igQhu1YBjrPT-4Q1DNwYsgpdk',
    libraries,
  });

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps</div>;
  }

  // create a google map object with marker
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 7.2905715, lng: 80.6337262 },
    zoom: 10,
  });
  
  const markerA = new google.maps.Marker({
    map: map, 
    position: new google.maps.LatLng(7.2905715, 80.6337262),
    customInfo: "Marker A"
  });
  
  return (
    <div>\

      <GoogleMap>
        setMap={map}
      </GoogleMap>
    </div>
  );
};

export default App;