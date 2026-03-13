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

const buildInfoWindowContent = (report, color) => {
  const locationName = report.locationName || "Unknown";
  const details = report.details || "No message";
  const formattedDate = new Date(report.timestamp).toLocaleDateString(
    "en-US",
    { month: "long", day: "numeric", year: "numeric" }
  );

  return `
          <div style="font-family:Arial,sans-serif;width:260px;overflow:hidden;">
            <div style="background:#064E65;padding:14px 16px 12px;display:flex;align-items:center;gap:8px;">
              <span style="display:inline-block;width:11px;height:11px;border-radius:50%;background:${color};flex-shrink:0;box-shadow:0 0 0 2px rgba(255,255,255,0.3);"></span>
              <span style="font-size:15px;font-weight:700;color:#C3CD00;text-transform:capitalize;letter-spacing:0.02em;">${report.type}</span>
            </div>
            <div style="padding:12px 16px 14px;background:#fff;">
              <div style="margin-bottom:10px;">
                <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#9ca3af;margin-bottom:2px;">Location</div>
                <div style="font-size:13px;color:#1f2937;">${locationName}</div>
              </div>
              <div style="margin-bottom:10px;">
                <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#9ca3af;margin-bottom:2px;">Message</div>
                <div style="font-size:13px;color:#1f2937;line-height:1.5;">${details}</div>
              </div>
              <div style="font-size:11px;color:#9ca3af;border-top:1px solid #f3f4f6;padding-top:8px;">
                ${formattedDate}
              </div>
            </div>
          </div>
        `;
};

const baseStyles = [
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

const softCivicHarmony = [
  {
    featureType: "all",
    elementType: "labels.text.fill",
    stylers: [{ color: "#064E65" }],
  },
  {
    featureType: "all",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#ffffff" }, { weight: 2 }],
  },
  ...baseStyles,
];

const softCivicHarmonySatellite = [
  {
    featureType: "all",
    elementType: "labels.text.fill",
    stylers: [{ color: "#ffffff" }],
  },
  {
    featureType: "all",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#064E65" }, { weight: 3 }],
  },
  ...baseStyles,
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

const normalizeLng = (lng) => {
  let x = Number(lng);
  while (x > 180) x -= 360;
  while (x < -180) x += 360;
  return x;
};

const normalizeLatLng = (lat, lng) => ({
  lat: Number(lat),
  lng: normalizeLng(lng),
});

export default function MapLanding() {
  const router = useRouter();
  const { report: reportIdFromURL } = router.query;

  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const activeInfoWindowRef = useRef(null);
  const [topIssues, setTopIssues] = useState([]);
  const [searchedLocation, setSearchedLocation] = useState("");
  const [showTestData, setShowTestData] = useState(false);

  const reportsRef = useRef([]);
  const lastCenterRef = useRef({ lat: 20, lng: 0 });
  const lastZoomRef = useRef(2);
  const didInitRef = useRef(false);
  const applyingPlaceRef = useRef(false);
  const mapInstanceRef = useRef(null);
  const autocompleteRef = useRef(null);
  const placeListenerRef = useRef(null);

  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_FETCH_ENDPOINT;

  const panToShowInfoWindow = (iw, mapInst) => {
    window.google.maps.event.addListenerOnce(iw, "domready", () => {
      const iwEl = document.querySelector(".gm-style-iw-c");
      const mapEl = document.getElementById("map");
      if (!iwEl || !mapEl) return;
      const iwRect = iwEl.getBoundingClientRect();
      const mapRect = mapEl.getBoundingClientRect();
      // Add buffer for the Map/Satellite controls that sit at the top of the map
      const controlsHeight = 60;
      const clearanceTop = mapRect.top + controlsHeight;
      if (iwRect.top < clearanceTop) {
        mapInst.panBy(0, clearanceTop - iwRect.top + 16);
      }
    });
  };

  useEffect(() => {
    if (!router.isReady) return;
    const urlMode = (router.query.mode || "real").toLowerCase();
    setShowTestData(urlMode === "test");
  }, [router.isReady, router.query.mode]);

  const clearMarkers = () => {
    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);
  };

  const renderMarkers = (reports, { preserveView = false } = {}) => {
    clearMarkers();
    if (!map) return;

    if (!Array.isArray(reports) || reports.length === 0) {
      if (
        preserveView &&
        lastCenterRef.current &&
        lastZoomRef.current != null
      ) {
        const c = map.getCenter?.();
        const currentCenter = c ? { lat: c.lat(), lng: c.lng() } : null;

        // Only restore if we're not at default position or if current position might be user-set
        if (
          currentCenter &&
          (currentCenter.lat !== 20 || currentCenter.lng !== 0)
        ) {
          // Keep current position
          return;
        }
        map.setCenter(
          normalizeLatLng(lastCenterRef.current.lat, lastCenterRef.current.lng),
        );
        map.setZoom(lastZoomRef.current);
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
        content: buildInfoWindowContent(report, color),
      });

      marker.addListener("click", () => {
        if (activeInfoWindowRef.current) activeInfoWindowRef.current.close();
        infoWindow.open(map, marker);
        activeInfoWindowRef.current = infoWindow;
        panToShowInfoWindow(infoWindow, map);
      });

      newMarkers.push(marker);
      bounds.extend(marker.getPosition());
    }

    if (preserveView) {
      // Don't change the map view at all - keep whatever the user has set
      // This is important after autocomplete selection
    } else if (newMarkers.length > 0) {
      map.fitBounds(bounds);
    }

    setMarkers(newMarkers);
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

      const targetColor =
        categoryColors[targetReport.type?.toLowerCase()] || categoryColors.other;
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="font-family:Arial,sans-serif;width:260px;overflow:hidden;">
            <div style="background:#064E65;padding:14px 16px 12px;display:flex;align-items:center;gap:8px;">
              <span style="display:inline-block;width:11px;height:11px;border-radius:50%;background:${targetColor};flex-shrink:0;box-shadow:0 0 0 2px rgba(255,255,255,0.3);"></span>
              <span style="font-size:15px;font-weight:700;color:#C3CD00;text-transform:capitalize;letter-spacing:0.02em;">${targetReport.type}</span>
            </div>
            <div style="padding:12px 16px 14px;background:#fff;">
              <div style="margin-bottom:10px;">
                <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#9ca3af;margin-bottom:2px;">Location</div>
                <div style="font-size:13px;color:#1f2937;">${targetReport.locationName || "Unknown"}</div>
              </div>
              <div style="margin-bottom:10px;">
                <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#9ca3af;margin-bottom:2px;">Message</div>
                <div style="font-size:13px;color:#1f2937;line-height:1.5;">${targetReport.details || "No message"}</div>
              </div>
              <div style="font-size:11px;color:#9ca3af;border-top:1px solid #f3f4f6;padding-top:8px;">
                ${new Date(targetReport.timestamp).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}
              </div>
            </div>
          </div>
        `,
      });

      if (activeInfoWindowRef.current) activeInfoWindowRef.current.close();
      infoWindow.open(map, targetMarker);
      activeInfoWindowRef.current = infoWindow;
      panToShowInfoWindow(infoWindow, map);
    }
  };

  const fetchTopIssues = async (location) => {
    const locationFragment = location.toLowerCase().trim().replace(/\s+/g, "-");

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_ISSUE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locationFragment }),
      });

      if (!res.ok) {
        setTopIssues([]);
        setSearchedLocation("");
        return;
      }

      const data = await res.json();

      if (Array.isArray(data.topIssues) && data.topIssues.length > 0) {
        setTopIssues(data.topIssues);
        setSearchedLocation(location);
      } else {
        setTopIssues([]);
        setSearchedLocation("");
      }
    } catch (error) {
      console.error("Error fetching top issues:", error);
      setTopIssues([]);
      setSearchedLocation("");
    }
  };

  // Initialize map
  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;

    let placeListener;
    let mapTypeIdListener;
    let mapClickListener;

    loader.load().then(() => {
      if (!window?.google) return;

      const mapEl = document.getElementById("map");
      if (!mapEl) return;

      const mapInstance = new window.google.maps.Map(mapEl, {
        center: { lat: 20, lng: 0 },
        zoom: 2,
        styles: softCivicHarmony,
        gestureHandling: "greedy",
        streetViewControl: false,
        restriction: {
          latLngBounds: { north: 85, south: -85, west: -180, east: 180 },
          strictBounds: true,
        },
      });

      setMap(mapInstance);

      mapClickListener = mapInstance.addListener("click", () => {
        if (activeInfoWindowRef.current) {
          activeInfoWindowRef.current.close();
          activeInfoWindowRef.current = null;
        }
      });

      mapTypeIdListener = mapInstance.addListener("maptypeid_changed", () => {
        const isSatellite = mapInstance.getMapTypeId() !== "roadmap";
        mapInstance.setOptions({
          styles: isSatellite ? softCivicHarmonySatellite : softCivicHarmony,
        });
      });

      // Setup autocomplete
      const input = document.getElementById("location-search");
      if (!input) return;

      const autocomplete = new window.google.maps.places.Autocomplete(input, {
        fields: ["geometry", "formatted_address"],
      });

      placeListener = autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        const loc = place?.geometry?.location;

        if (!loc) return;
        if (applyingPlaceRef.current) return;

        applyingPlaceRef.current = true;

        const formatted = place.formatted_address || "";
        const target = normalizeLatLng(loc.lat(), loc.lng());

        // Use setCenter + setZoom (more deterministic than panTo)
        mapInstance.setCenter(target);
        mapInstance.setZoom(10);

        // Save immediately
        lastCenterRef.current = target;
        lastZoomRef.current = 10;

        // Force-center again after the map settles (handles resize/layout side effects)
        window.google.maps.event.addListenerOnce(mapInstance, "idle", () => {
          // Re-apply target in case Google shifted it
          mapInstance.setCenter(target);

          // Update refs from what we want, not what Google drifted to
          lastCenterRef.current = target;
          lastZoomRef.current = mapInstance.getZoom?.() ?? 10;

          applyingPlaceRef.current = false;
        });

        fetchTopIssues(formatted);
      });
    });

    return () => {
      if (mapClickListener) {
        window.google?.maps?.event?.removeListener(mapClickListener);
      }
      if (mapTypeIdListener) {
        window.google?.maps?.event?.removeListener(mapTypeIdListener);
      }
      if (placeListener) {
        window.google?.maps?.event?.removeListener(placeListener);
      }
    };
  }, []);

  // Fetch and render reports
  useEffect(() => {
    if (!map) return;
    const mode = showTestData ? "test" : "real";

    (async () => {
      try {
        const res = await fetch(`${API_ENDPOINT}?mode=${mode}`);
        if (!res.ok) {
          console.error("Fetch failed:", res.status);
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

  // Zoom to specific report from URL
  useEffect(() => {
    if (markers.length > 0 && reportIdFromURL && map) {
      zoomToReportIfNeeded();
    }
  }, [markers, reportIdFromURL, map]);

  // Notify Google Maps when the map panel resizes so it re-measures correctly
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!map) return;

    const mapPanel = document.getElementById("map-panel");
    if (!mapPanel) return;

    const ro = new ResizeObserver(() => {
      if (applyingPlaceRef.current) return;
      window.google?.maps?.event?.trigger(map, "resize");
      const c = lastCenterRef.current;
      const z = lastZoomRef.current;
      if (c && typeof z === "number") {
        map.setCenter(c);
        map.setZoom(z);
      }
    });

    ro.observe(mapPanel);

    // Initial trigger
    window.google?.maps?.event?.trigger(map, "resize");
    if (lastCenterRef.current && typeof lastZoomRef.current === "number") {
      map.setCenter(lastCenterRef.current);
      map.setZoom(lastZoomRef.current);
    }

    return () => ro.disconnect();
  }, [map]);

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
        <div
          id="sidebar-panel"
          className="w-full lg:w-[300px] bg-white border border-gray-200 shadow-md rounded-lg p-4 lg:h-[70vh] lg:max-h-[800px] overflow-y-auto flex flex-col"
        >
          {/* Location Search */}
          <input
            id="location-search"
            type="text"
            placeholder="Search for a location"
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#C3CD00]"
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
                className={`flex items-center gap-2 px-3 py-2 rounded-md border text-sm transition ${
                  selectedCategory === category
                    ? "bg-[#EEF7F9] border-[#064E65] border-2"
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
            <span className="text-sm font-medium text-gray-700">
              Show test data
            </span>
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
        <div id="map-panel" className="flex-1 rounded-lg shadow-lg overflow-hidden h-[70vh] min-h-[420px] max-h-[800px]">
          <div id="map" className="w-full h-full" />
        </div>
      </div>

      {/* Top Issues */}
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
