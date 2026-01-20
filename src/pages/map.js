import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
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

  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeInfoWindow, setActiveInfoWindow] = useState(null);
  const [topIssues, setTopIssues] = useState([]);
  const [searchedLocation, setSearchedLocation] = useState("");
  const [showTestData, setShowTestData] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;

    const urlMode = (router.query.mode || "real").toLowerCase();
    setShowTestData(urlMode === "test");
  }, [router.isReady, router.query.mode]);

  const reportsRef = useRef([]);
  const lastCenterRef = useRef(null);
  const lastZoomRef = useRef(null);
  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_FETCH_ENDPOINT;

  const captureView = () => {
    if (!map) return;
    const c = map.getCenter?.();
    if (c) {
      lastCenterRef.current = { lat: c.lat(), lng: c.lng() };
      lastZoomRef.current = map.getZoom?.();
    }
  };

  const clearMarkers = () => {
    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);
  };

  const renderMarkers = (reports, { preserveView = false } = {}) => {
    clearMarkers();
    if (!map) return;

    if (!Array.isArray(reports) || reports.length === 0) {
      if (!preserveView) {
        map.setCenter({ lat: 20, lng: 0 });
        map.setZoom(2);
      }
      setMarkers([]);
      return;
    }

    const bounds = new window.google.maps.LatLngBounds();
    const newMarkers = [];

    for (const report of reports) {
      const lat = Number(report.latitude);
      const lng = Number(report.longitude);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;

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
              report.timestamp,
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
    }

    if (preserveView && lastCenterRef.current && lastZoomRef.current != null) {
      map.setCenter(lastCenterRef.current);
      map.setZoom(lastZoomRef.current);
    } else if (newMarkers.length > 0) {
      map.fitBounds(bounds);
    }

    setMarkers(newMarkers);
  };

  const filterAndRender = () => {
    const filtered = selectedCategory
      ? reportsRef.current.filter(
          (r) => r.type?.toLowerCase() === selectedCategory,
        )
      : reportsRef.current;

    captureView();
    renderMarkers(filtered, { preserveView: true });
  };

  const zoomToReportIfNeeded = () => {
    if (!reportIdFromURL || !map || markers.length === 0) return;

    const targetReport = reportsRef.current.find(
      (r) => r.report_id === reportIdFromURL,
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
              targetReport.timestamp,
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
      if (!window?.google) return;

      const mapInstance = new window.google.maps.Map(
        document.getElementById("map"),
        {
          center: { lat: 40.7128, lng: -74.006 },
          zoom: 2,
          styles: softCivicHarmony,
          gestureHandling: "greedy",
          restriction: {
            latLngBounds: { north: 85, south: -85, west: -180, east: 179.9999 },
            strictBounds: true,
          },
        },
      );
      setMap(mapInstance);

      const input = document.getElementById("location-search");
      if (input) {
        const autocomplete = new window.google.maps.places.Autocomplete(input, {
          fields: ["geometry", "formatted_address"],
        });

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (!place?.geometry) return;

          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          const formatted = place.formatted_address;

          mapInstance.panTo({ lat, lng });
          mapInstance.setZoom(10);
          fetchTopIssues(formatted);
        });
      }
    });
  }, []);

  useEffect(() => {
    if (!map) return;
    const mode = showTestData ? "test" : "real";

    (async () => {
      try {
        captureView();

        const res = await fetch(`${API_ENDPOINT}?mode=${mode}`);
        if (!res.ok) {
          console.error("Fetch failed:", res.status, await res.text());
          reportsRef.current = [];
          renderMarkers([], { preserveView: true });
          return;
        }

        const data = await res.json();
        const list = Array.isArray(data.reports) ? data.reports : [];
        reportsRef.current = list;

        const filtered = selectedCategory
          ? list.filter((r) => r.type?.toLowerCase() === selectedCategory)
          : list;

        renderMarkers(filtered, { preserveView: true });
      } catch (err) {
        console.error("Network error fetching reports:", err);
        reportsRef.current = [];
        renderMarkers([], { preserveView: true });
      }
    })();
  }, [map, showTestData, selectedCategory]);

  useEffect(() => {
    if (markers.length > 0 && reportIdFromURL && map) {
      zoomToReportIfNeeded();
    }
  }, [markers, reportIdFromURL, map]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mapDiv = document.getElementById("map");
    const sidebar = document.getElementById("sidebar-panel");
    if (!mapDiv || !sidebar) return;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        mapDiv.style.height = `${entry.contentRect.height}px`;
      }
    });
    ro.observe(sidebar);
    mapDiv.style.height = `${sidebar.offsetHeight}px`;

    return () => ro.disconnect();
  }, []);

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
        setSearchedLocation(location);
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
      <h1 className="text-3xl font-bold text-[#064E65] mb-2 text-center">
        Map of Reported Needs
      </h1>
      <p className="text-center text-[#064E65] italic px-2 mb-6 max-w-2xl">
        Click a category to filter markers or click on a marker to see more.
      </p>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-5 items-start">
        {/* CATEGORY PANEL */}
        <div className=" w-full lg:w-[300px] bg-white border border-gray-200 shadow-md rounded-lg p-4 lg:h-[calc(100vh-6rem)] overflow-y-auto flex flex-col">
          {/* Location Search */}
          <input
            id="location-search"
            type="text"
            placeholder="Search for a location"
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Category Filter */}
          <h2 className="text-sm font-semibold text-[#064E65] mb-3">
            Filter by Category
          </h2>

          <div className="flex flex-wrap lg:flex-col gap-2">
            {Object.entries(categoryColors).map(([category, color]) => (
              <button
                key={category}
                type="button"
                onClick={() =>
                  setSelectedCategory((prev) =>
                    prev === category ? null : category,
                  )
                }
                className={`flex items-center gap-2 px-3 py-2 rounded-md border text-sm transition
              ${
                selectedCategory === category
                  ? "bg-gray-100 border-gray-400"
                  : "bg-white border-gray-200 hover:bg-gray-100"
              }`}
              >
                <span
                  className="inline-block w-4 h-4 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="capitalize">{category}</span>
              </button>
            ))}
          </div>
          {/* Test Data Toggle */}
          <div className="mt-auto pt-3 border-t border-gray-200 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Show test data</span>
            <button
              type="button"
              role="switch"
              aria-checked={showTestData}
              onClick={() => setShowTestData((v) => !v)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                showTestData ? "bg-[#064E65]" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  showTestData ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* MAP PANEL */}
        <div className="flex-1 h-[calc(100vh-6rem)] rounded-lg shadow-lg overflow-hidden">
          <div id="map" className="w-full h-full" />
        </div>
      </div>

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
