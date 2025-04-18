// ~ Line 1
import { useEffect, useState } from "react";
import loader from "../utils/googleMapsLoader";

const MapLanding = () => {
  const [map, setMap] = useState(null);
  const [places, setPlaces] = useState([]);
  const [activeInfoWindow, setActiveInfoWindow] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const NEXT_PUBLIC_API_FETCH_ENDPOINT =
    process.env.NEXT_PUBLIC_API_FETCH_ENDPOINT;

  // ~ Line 20
  const softCivicHarmony = [
    {
      featureType: "all",
      elementType: "labels.text.fill",
      stylers: [{ color: "#222222" }],
    },
    {
      featureType: "administrative",
      elementType: "geometry.stroke",
      stylers: [{ color: "#C3CD00" }],
    },
    {
      featureType: "landscape",
      elementType: "geometry",
      stylers: [{ color: "#FAF8F0" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#E5E5E5" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#A2D6F9" }],
    },
  ];

  const categoryColors = {
    education: "#F2C14E",
    energy: "#FF8C42",
    equality: "#D36C6C",
    financial: "#2D6A4F",
    food: "#C3CD00",
    health: "#A460ED",
    infrastructure: "#0B4F6C",
    other: "#D6D6D6",
  };

  // ~ Line 60
  const getPinIcon = (hexColor) => ({
    path: window.google.maps.SymbolPath.CIRCLE,
    scale: 8,
    fillColor: hexColor,
    fillOpacity: 1,
    strokeWeight: 1,
    strokeColor: "#ffffff",
  });

  const clearMarkers = () => {
    places.forEach((marker) => marker.setMap(null));
    setPlaces([]);
  };

  // ~ Line 75
const renderMarkers = (reports) => {
  const newMarkers = reports.map((report) => {
    const latitude = parseFloat(report.latitude);
    const longitude = parseFloat(report.longitude);

    if (!isNaN(latitude) && !isNaN(longitude)) {
      const latLng = { lat: latitude, lng: longitude };
      const category = report.type?.toLowerCase() || "other";
      const color = categoryColors[category] || "#D6D6D6";

      const marker = new window.google.maps.Marker({
        position: latLng,
        map: map,
        icon: getPinIcon(color),
        title: `${category} report`,
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="font-family: 'Helvetica Neue', sans-serif; padding: 12px 14px; max-width: 260px; line-height: 1.4;">
            <h2 style="margin: 0 0 8px; font-size: 18px; color: #064E65;">${
              report.type
            }</h2>
            <hr style="margin: 0 0 8px; border: none; border-top: 1px solid #ddd;" />
            <p style="margin: 0 0 6px; font-size: 14px;"><strong>Location:</strong> ${
              report.locationName || "Unknown"
            }</p>
            <p style="margin: 0 0 6px; font-size: 14px;"><strong>Message:</strong> ${
              report.details
            }</p>
            <p style="margin-top: 8px; font-size: 12px; color: #888;">${new Date(
              report.timestamp
            ).toLocaleDateString()}</p>
          </div>
        `,
      });

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

  const validMarkers = newMarkers.filter((marker) => marker !== null);

  if (validMarkers.length > 0) {
    const bounds = new window.google.maps.LatLngBounds();
    validMarkers.forEach((marker) => {
      const pos = marker.getPosition();
      if (pos) bounds.extend(pos);
    });
    map.fitBounds(bounds);
  }

  setPlaces(validMarkers);
};


  // ~ Line 130
  useEffect(() => {
    if (map) {
      const fetchReports = async () => {
        try {
          const response = await fetch(NEXT_PUBLIC_API_FETCH_ENDPOINT);
          const result = await response.json();

          let filteredReports = result.reports;
          if (selectedCategory) {
            filteredReports = result.reports.filter(
              (r) => r.type?.toLowerCase() === selectedCategory // ✅ FIXED
            );
          }

          clearMarkers();
          renderMarkers(filteredReports);
        } catch (error) {
          console.error("❌ Error fetching reports:", error);
        }
      };

      fetchReports();
    }
  }, [map, selectedCategory]);

  // ~ Line 155
  useEffect(() => {
    loader
      .load()
      .then(() => {
        if (window.google) {
          const mapOptions = {
            center: { lat: 37.7749, lng: -122.4194 },
            zoom: 10,
            styles: softCivicHarmony,
          };

          const newMap = new window.google.maps.Map(
            document.getElementById("map"),
            mapOptions
          );
          setMap(newMap);
        } else {
          console.error("Google Maps failed to load.");
        }
      })
      .catch((error) => console.error("Google Maps Loader Error:", error));
  }, []);

  const toggleCategory = (cat) => {
    setSelectedCategory((prev) => (prev === cat ? null : cat));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-bold text-[#064E65] mb-4">
        Map of Reported Needs
      </h1>
      <p className="text-gray-600 mb-4">
        Click a category to filter the map markers or Click on a marker to see
        more details.
      </p>

      <p className="text-gray-600 mb-4">
        {" "}
        This is still <strong>test data</strong> to make sure our map is working
        correctly.
      </p>
      <p className="text-gray-600 mb-4">
        Please check back later for real data.
      </p>

      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-4 items-start justify-center">
        {/* Legend Box */}
        <div className="bg-white border border-gray-200 shadow-md rounded-lg p-4 w-full max-w-[220px]">
          <h2 className="text-sm font-semibold text-[#064E65] mb-2">
            Filter by Category
          </h2>
          <ul className="space-y-2 text-sm text-gray-800">
            {Object.entries(categoryColors).map(([category, color]) => {
              const isActive = selectedCategory === category;
              return (
                <li
                  key={category}
                  className={`flex items-center space-x-2 cursor-pointer transition ${
                    isActive ? "bg-[#f5f5f5] rounded-md px-2 py-1" : ""
                  }`}
                  onClick={() => toggleCategory(category)}
                >
                  <span
                    className="inline-block w-4 h-4 rounded-full border border-white shadow"
                    style={{ backgroundColor: color }}
                  ></span>
                  <span className="capitalize">{category}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Map Box */}
        <div id="map" className="w-full h-96 rounded-lg shadow-lg" />
      </div>
    </div>
  );
};

export default MapLanding;
