import { useEffect, useRef } from "react";

const LocationAutocomplete = ({ setLocation, setLatitude, setLongitude }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (!window.google || !window.google.maps || !window.google.maps.places) return;

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ["geocode"],
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) return;

      const locationName = place.formatted_address || place.name;
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      setLocation(locationName);
      setLatitude(lat);
      setLongitude(lng);

      console.log("Selected location:", locationName, "Lat:", lat, "Lng:", lng);

//       console.log("Google Maps available?", !!window.google?.maps?.places);
// document.querySelectorAll(".pac-container");

    });
  }, []);

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder="Start typing an address..."
      className="px-2 py-2 w-full border-b-2 focus:border-[#333] outline-none text-sm bg-white"
    />
  );
};

export default LocationAutocomplete;
