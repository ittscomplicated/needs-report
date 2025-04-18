import { useEffect, useState, useRef } from "react";
import loader from "../utils/googleMapsLoader";

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

const getPinIcon = (color) => ({
  path: window.google.maps.SymbolPath.CIRCLE,
  scale: 8,
  fillColor: color,
  fillOpacity: 1,
  strokeWeight: 1,
  strokeColor: "#ffffff",
});

const MapLanding = () => {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeInfoWindow, setActiveInfoWindow] = useState(null);
  const reportsRef = useRef([]); // Cached reports

  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_FETCH_ENDPOINT;

  const clearMarkers = () => {
    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);
  };

  const renderMarkers = (reports) => {
    const newMarkers = [];
    const bounds = new window.google.maps.LatLngBounds();

    reports.forEach((report) => {
      const lat = parseFloat(report.latitude);
      const lng = parseFloat(report.longitude);
      if (isNaN(lat) || isNaN(lng)) return;

      const color = categoryColors[report.type?.toLowerCase()] || "#D6D6D6";

      const marker = new window.google.maps.Marker({
        position: { lat, lng },
        map,
        icon: getPinIcon(color),
        title: `${report.type} report`,
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="font-family:sans-serif; padding:12px 14px; max-width:260px; line-height:1.4;">
            <h2 style="margin:0 0 8px; font-size:18px; color:#064E65;">${
              report.type
            }</h2>
            <hr style="margin:0 0 8px; border:none; border-top:1px solid #ddd;" />
            <p><strong>Location:</strong> ${
              report.locationName || "Unknown"
            }</p>
            <p><strong>Message:</strong> ${report.details || "No message"}</p>
            <p style="font-size:12px; color:#888;">${new Date(
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

      newMarkers.push(marker);
      bounds.extend(marker.getPosition());
    });

    if (newMarkers.length > 0) map.fitBounds(bounds);
    setMarkers(newMarkers);
  };

  const filterAndRender = () => {
    const filtered = selectedCategory
      ? reportsRef.current.filter(
          (r) => r.type?.toLowerCase() === selectedCategory
        )
      : reportsRef.current;
    clearMarkers();
    renderMarkers(filtered);
  };

  useEffect(() => {
    loader.load().then(() => {
      if (!window.google) return;

      const mapInstance = new window.google.maps.Map(
        document.getElementById("map"),
        {
          center: { lat: 37.7749, lng: -122.4194 },
          zoom: 10,
          styles: softCivicHarmony,
          gestureHandling: "greedy",
        }
      );

      setMap(mapInstance);
    });
  }, []);

  useEffect(() => {
    if (!map) return;

    const fetchAndRender = async () => {
      try {
        const res = await fetch(API_ENDPOINT);
        const data = await res.json();
        if (data.reports && Array.isArray(data.reports)) {
          reportsRef.current = data.reports;
          filterAndRender();
        }
      } catch (err) {
        console.error("Error fetching reports:", err);
      }
    };

    fetchAndRender();
  }, [map]);

  useEffect(() => {
    if (map && reportsRef.current.length > 0) {
      filterAndRender();
    }
  }, [selectedCategory]);

  const toggleCategory = (cat) => {
    setSelectedCategory((prev) => (prev === cat ? null : cat));
  };

  return (
    <div className="min-h-screen px-4 py-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-[#064E65] mb-2">
        Map of Reported Needs
      </h1>
      <p className="text-gray-600 mb-4 text-center max-w-2xl">
        Click a category to filter the map markers or click on a marker to see
        more details.
      </p>

      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-4 items-start justify-center">
        {/* Legend */}
        <div className="bg-white border border-gray-200 shadow-md rounded-lg p-4 w-full max-w-[220px]">
          <h2 className="text-sm font-semibold text-[#064E65] mb-2">
            Filter by Category
          </h2>
          <ul className="space-y-2 text-sm text-gray-800">
            {Object.entries(categoryColors).map(([category, color]) => (
              <li
                key={category}
                className={`flex items-center space-x-2 cursor-pointer ${
                  selectedCategory === category
                    ? "bg-[#f5f5f5] px-2 py-1 rounded"
                    : ""
                }`}
                onClick={() => toggleCategory(category)}
              >
                <span
                  className="inline-block w-4 h-4 rounded-full"
                  style={{ backgroundColor: color }}
                ></span>
                <span className="capitalize">{category}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Map */}
        <div id="map" className="w-full h-96 rounded-lg shadow-lg" />
      </div>
    </div>
  );
};

export default MapLanding;
