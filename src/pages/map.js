import { useEffect, useState } from "react";
import loader from "../utils/googleMapsLoader";

const MapLanding = () => {
  const [map, setMap] = useState(null);
  const [places, setPlaces] = useState([]);
  const [activeInfoWindow, setActiveInfoWindow] = useState(null); // Track open InfoWindow

  // Load API URL from environment variables
  const NEXT_PUBLIC_API_FETCH_ENDPOINT = process.env.NEXT_PUBLIC_API_FETCH_ENDPOINT;

  // Fetch reports and create markers when the map is ready
  useEffect(() => {
    if (map) {
      const fetchReports = async () => {
        try {
          if (!NEXT_PUBLIC_API_FETCH_ENDPOINT) {
            throw new Error("API endpoint is missing! Check your .env.local file.");
          }

          console.log("Fetching from:", NEXT_PUBLIC_API_FETCH_ENDPOINT);
          
          const response = await fetch(NEXT_PUBLIC_API_FETCH_ENDPOINT);
          if (!response.ok) throw new Error("Failed to fetch reports");

          const result = await response.json();
          console.log("Fetched reports:", result.reports);

          if (!result.reports || result.reports.length === 0) return;

          // Create markers from reports
          const newMarkers = result.reports.map((report) => {
            const latitude = parseFloat(report.latitude);
            const longitude = parseFloat(report.longitude);

            if (!isNaN(latitude) && !isNaN(longitude)) {
              const latLng = { lat: latitude, lng: longitude };

              // Create a marker with report details
              const marker = new window.google.maps.Marker({
                position: latLng,
                map: map,
                title: `Report #${report.reportID}`, // Tooltip on hover
              });

              const infoWindow = new window.google.maps.InfoWindow({
                content: `
                  <div style="font-family: Arial, sans-serif; max-width: 250px;">
                    <h3 style="color: #064E65; margin: 0;">Report #${report.reportID}</h3>
                    <p><strong>Location:</strong> ${report.locationName || "Unknown"}</p>
                    <p><strong>Category:</strong> ${report.categoryNeed}</p>
                    <p><strong>Message:</strong> ${report.needMessage}</p>
                    <p style="font-size: 12px; color: gray;">Reported on: ${new Date(report.created).toLocaleDateString()}</p>
                  </div>
                `,
              });

              // Open InfoWindow on click & close previous one
              marker.addListener("click", () => {
                if (activeInfoWindow) activeInfoWindow.close();
                infoWindow.open(map, marker);
                setActiveInfoWindow(infoWindow);
              });

              return marker;
            } else {
              console.error("Invalid coordinates:", report);
              return null;
            }
          });

          // Filter out null markers
          const validMarkers = newMarkers.filter((marker) => marker !== null);

          // Adjust map center & bounds
          if (validMarkers.length > 0) {
            const bounds = new window.google.maps.LatLngBounds();
            validMarkers.forEach((marker) => bounds.extend(marker.getPosition()));
            map.fitBounds(bounds);
          }

          setPlaces(validMarkers);
        } catch (error) {
          console.error("❌ Error fetching reports:", error);
        }
      };

      fetchReports();
    }
  }, [map]);

  // Initialize Google Maps
  useEffect(() => {
    loader
      .load()
      .then(() => {
        if (window.google) {
          const mapOptions = {
            center: { lat: 37.7749, lng: -122.4194 }, // Default center (San Francisco)
            zoom: 10,
          };

          const newMap = new window.google.maps.Map(document.getElementById("map"), mapOptions);
          setMap(newMap);
        } else {
          console.error("Google Maps failed to load.");
        }
      })
      .catch((error) => console.error("Google Maps Loader Error:", error));
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-[#064E65] mb-4">Map of Reported Locations</h1>
        <p className="text-gray-600 mb-4">Click on the markers to view report details.</p>
        <p className="text-gray-600 mb-4">This is a test to see if the map will load with the correct markers and data</p>        
        <p className="text-gray-600 mb-4">More refinement to come</p>        

      <div id="map" className="w-full max-w-4xl h-96 rounded-lg shadow-lg"></div>
    </div>
  );
};

export default MapLanding;
