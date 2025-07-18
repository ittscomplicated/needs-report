import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
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

const getPinIcon = (color) => {
  if (typeof window === "undefined" || !window.google) return null;
  return {
    path: window.google.maps.SymbolPath.CIRCLE,
    scale: 8,
    fillColor: color,
    fillOpacity: 1,
    strokeWeight: 1,
    strokeColor: "#ffffff",
  };
};

export default function MapLanding() {
  const router = useRouter();
  const { report: reportIdFromURL } = router.query;
  const searchInputRef = useRef(null);


  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeInfoWindow, setActiveInfoWindow] = useState(null);
  const [topIssues, setTopIssues] = useState([]);
  const [searchedLocation, setSearchedLocation] = useState("");



  const reportsRef = useRef([]);
  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_FETCH_ENDPOINT;

  const clearMarkers = () => {
    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);
  };

  const renderMarkers = (reports) => {
    const bounds = new window.google.maps.LatLngBounds();
    const newMarkers = [];

    reports.forEach((report) => {
      const lat = parseFloat(report.latitude);
      const lng = parseFloat(report.longitude);
      if (isNaN(lat) || isNaN(lng)) return;

      const color =
        categoryColors[report.type?.toLowerCase()] || categoryColors.other;

      const marker = new window.google.maps.Marker({
        position: { lat, lng },
        map,
        icon: getPinIcon(color),
        title: `${report.type} report`,
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="font-family:sans-serif;padding:12px 14px;max-width:260px;line-height:1.4;">
            <h2 style="margin:0 0 8px;font-size:18px;color:#064E65;">${
              report.type
            }</h2>
            <hr style="margin:0 0 8px;border:none;border-top:1px solid #ddd;" />
            <p><strong>Location:</strong> ${
              report.locationName || "Unknown"
            }</p>
            <p><strong>Message:</strong> ${report.details || "No message"}</p>
            <p style="font-size:12px;color:#888;">${new Date(
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

      newMarkers.push({ marker, report });
      bounds.extend(marker.getPosition());
    });

    if (newMarkers.length > 0) map.fitBounds(bounds);
    setMarkers(newMarkers.map((m) => m.marker));
  };

  const fetchAndRenderReports = async () => {
    try {
      const res = await fetch(API_ENDPOINT);
      const data = await res.json();
      if (data.reports) {
        reportsRef.current = data.reports;
        filterAndRender();
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
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

  const zoomToReportIfNeeded = () => {
    if (!reportIdFromURL || !map || markers.length === 0) return;

    const targetReport = reportsRef.current.find(
      (r) => r.report_id === reportIdFromURL
    );
    if (!targetReport) return;

    const targetMarker = markers.find((m) => {
      const pos = m.getPosition();
      return (
        pos.lat().toFixed(6) === parseFloat(targetReport.latitude).toFixed(6) &&
        pos.lng().toFixed(6) === parseFloat(targetReport.longitude).toFixed(6)
      );
    });

    if (targetMarker) {
      map.panTo(targetMarker.getPosition());
      map.setZoom(15);

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="font-family:sans-serif;padding:12px 14px;max-width:260px;line-height:1.4;">
            <h2 style="margin:0 0 8px;font-size:18px;color:#064E65;">${
              targetReport.type
            }</h2>
            <hr style="margin:0 0 8px;border:none;border-top:1px solid #ddd;" />
            <p><strong>Location:</strong> ${
              targetReport.locationName || "Unknown"
            }</p>
            <p><strong>Message:</strong> ${
              targetReport.details || "No message"
            }</p>
            <p style="font-size:12px;color:#888;">${new Date(
              targetReport.timestamp
            ).toLocaleDateString()}</p>
          </div>
        `,
      });

      infoWindow.open(map, targetMarker);
      setActiveInfoWindow(infoWindow);
    }
  };

  useEffect(() => {
    loader.load().then(() => {
      if (typeof window !== "undefined" && window.google) {
        const mapInstance = new window.google.maps.Map(
          document.getElementById("map"),
          {
            center: { lat: 40.7128, lng: -74.0060 },
            zoom: 2,
            styles: softCivicHarmony,
            gestureHandling: "greedy",
            restriction: {
              latLngBounds: {
                north: 85,
                south: -85,
                west: -180,
                east: 179.9999,
              },
              strictBounds: true,
            },
          }
        );
        
        setMap(mapInstance);

        const input = document.getElementById("location-search");
        const autocomplete = new window.google.maps.places.Autocomplete(input);
        autocomplete.setFields(["geometry", "formatted_address"]);

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (!place.geometry) return;

          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          const formatted = place.formatted_address;

          mapInstance.panTo({ lat, lng });
          mapInstance.setZoom(10);

          // Dynamically fetch top 3 issues here using your API
          fetchTopIssues(formatted);
        });
      }
    });
  }, []);

  useEffect(() => {
    if (map) fetchAndRenderReports();
  }, [map]);

  useEffect(() => {
    if (map && reportsRef.current.length > 0) filterAndRender();
  }, [selectedCategory]);

  useEffect(() => {
    if (markers.length > 0) zoomToReportIfNeeded();
  }, [markers, reportIdFromURL, map]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mapDiv = document.getElementById("map");
      const sidebar = document.getElementById("sidebar-panel");

      if (mapDiv && sidebar) {
        mapDiv.style.height = `${sidebar.offsetHeight}px`;
      }
    }
  }, [map]);

  const toggleCategory = (cat) => {
    setSelectedCategory((prev) => (prev === cat ? null : cat));
  };

  const fetchTopIssues = async (location) => {
    const formattedLocation = location.toLowerCase().replace(/\s+/g, "-");

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_ISSUE_ENDPOINT, {
        method: "POST",
        body: JSON.stringify({ location: formattedLocation }),
      });

      const data = await res.json();
      
      if (data?.topIssues?.length) {
        setTopIssues(data.topIssues);
        setSearchedLocation(location); // for display later
      } else {
        setTopIssues([]);
        setSearchedLocation("");
      }
    } catch (error) {
      console.error("Error fetching top issues:", error);
    }
  };
  

  return (
    <div className="min-h-screen px-4 py-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-[#064E65] mb-2">
        Map of Reported Needs
      </h1>
      <p className="text-gray-600 mb-4 text-center max-w-2xl">
        Click a category to filter markers or click on a marker to see more.
      </p>

      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-5 items-start justify-center">
        {/* Sidebar */}
        <div
          className="bg-white border border-gray-200 shadow-md rounded-lg p-4 w-full max-w-[300px] flex-shrink-0"
          id="sidebar-panel"
        >
          <input
            id="location-search"
            type="text"
            placeholder="Search for a location"
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="bg-white border border-gray-200 shadow-md rounded-lg p-4 w-full max-w-[220px] mt-4">
            <h2 className="text-md font-semibold text-[#064E65] mb-2">
              Filter by Category
            </h2>
            <ul className="flex flex-wrap gap-2">
              {Object.entries(categoryColors).map(([category, color]) => (
                <li key={category}>
                  <button
                    type="button"
                    className={`flex items-center space-x-2 px-3 py-1 rounded-md border transition-colors duration-150
                      ${
                        selectedCategory === category
                          ? "bg-[#f5f5f5] border-gray-400"
                          : "bg-white border-gray-200 hover:bg-gray-100"
                      }
                      shadow-sm focus:outline-none`}
                    onClick={() => toggleCategory(category)}
                  >
                    <span
                      className="inline-block w-4 h-4 rounded-full"
                      style={{ backgroundColor: color }}
                    ></span>
                    <span className="capitalize font-medium">{category}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Map */}
        <div
          id="map"
          className="w-full rounded-lg shadow-lg"
          style={{
            height:
              typeof window !== "undefined" &&
              document.getElementById("sidebar-panel")?.offsetHeight
                ? document.getElementById("sidebar-panel").offsetHeight + "px"
                : "100%",
            minHeight: "300px",
          }}
        />
      </div>
      {/* Top Issues Section */}
      {topIssues.length > 0 && (
        <div className="mt-8 w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-[#064E65] mb-4">
            Top Reported Needs in {searchedLocation}
          </h2>
          <ul className="space-y-2">
            {topIssues.map(({ issue, count }) => (
              <li
                key={issue}
                className="flex justify-between items-center text-gray-800 border-b pb-1"
              >
                <span className="capitalize">{issue}</span>
                <span className="text-sm text-[#064E65] font-semibold">
                  {count} report{count > 1 ? "s" : ""}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mb-10" />
    </div>
  );
}

