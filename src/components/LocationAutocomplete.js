import { useEffect, useRef, useState } from "react";
import loader from "../utils/googleMapsLoader";

export default function LocationAutocomplete({
  setLocation,
  setLatitude,
  setLongitude,
}) {
  const inputRef = useRef();
  const [manualMode, setManualMode] = useState(false);

  useEffect(() => {
    let autocomplete;

    const initAutocomplete = async () => {
      await loader.load();

      if (window.google && inputRef.current) {
        autocomplete = new window.google.maps.places.Autocomplete(
          inputRef.current,
          {
            types: ["geocode"],
          }
        );

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (place.geometry) {
            const formattedAddress = place.formatted_address || place.name;
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();

            setLocation(formattedAddress);
            setLatitude(lat);
            setLongitude(lng);
          }
        });
      }
    };

    if (!manualMode) initAutocomplete();

    return () => {
      if (autocomplete) {
        window.google.maps.event.clearInstanceListeners(autocomplete);
      }
    };
  }, [manualMode, setLocation, setLatitude, setLongitude]);

  const handleManualInput = (e) => {
    const value = e.target.value;
    setLocation(value);

    // Try to parse coordinates (simple pattern)
    const coordMatch = value.match(/(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)/);

    if (coordMatch) {
      const lat = parseFloat(coordMatch[1]);
      const lng = parseFloat(coordMatch[3]);

      if (!isNaN(lat) && !isNaN(lng)) {
        setLatitude(lat);
        setLongitude(lng);
      }
    }
  };

  return (
    <div className="w-full space-y-1">
      <input
        ref={inputRef}
        type="text"
        placeholder="Start typing an address."
        onChange={handleManualInput}
        onFocus={() => setManualMode(false)}
        className="w-full border-b-2 p-2 text-sm"
      />
      <p className="text-xs text-gray-500"></p>
    </div>
  );
}
