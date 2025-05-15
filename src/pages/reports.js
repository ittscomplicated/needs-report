import { useRouter } from "next/router";
import LocationAutocomplete from "../components/LocationAutocomplete";
import { useEffect, useState } from "react";

const countryCodes = [
  { label: "🇺🇸 +1", value: "+1" },
  { label: "🇬🇧 +44", value: "+44" },
  { label: "🇲🇽 +52", value: "+52" },
  { label: "🇨🇦 +1", value: "+1" },
  { label: "🇮🇳 +91", value: "+91" },
  { label: "🌍 Other", value: "" },
];

export default function Reports() {
  const router = useRouter();
  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [categoryNeed, setCategoryNeed] = useState("education");
  const [needMessage, setNeedMessage] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [customCode, setCustomCode] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
      },
      (err) => setError(err.message)
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!needMessage.trim()) {
      alert("Please enter a message for your report.");
      return;
    }
    if (!location) {
      alert("Please select a location.");
      return;
    }
    if (!categoryNeed) {
      alert("Please select a category.");
      return;
    }

    if (!isAnonymous) {
      if (!name.trim()) {
        alert("Please enter your name.");
        return;
      }
      if (!email.trim()) {
        alert("Please enter your email.");
        return;
      }
    }

    setLoading(true);

    try {
      const cleanedPhone = phone.replace(/\D/g, "");
      const finalCode = countryCode !== "" ? countryCode : customCode;

      const res = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latitude,
          longitude,
          location,
          categoryNeed,
          needMessage,
          isAnonymous,
          name: isAnonymous ? "" : name,
          email: isAnonymous ? "" : email,
          phone: isAnonymous ? "" : finalCode + cleanedPhone,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to submit");

      router.push(`/report-confirmation?reportId=${data.report_id}`);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to submit report.");
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneFormat = (e) => {
    const input = e.target.value.replace(/\D/g, "");
    let formatted = input;
    if (input.length > 6) {
      formatted = `(${input.slice(0, 3)}) ${input.slice(3, 6)}-${input.slice(
        6
      )}`;
    } else if (input.length > 3) {
      formatted = `(${input.slice(0, 3)}) ${input.slice(3)}`;
    } else if (input.length > 0) {
      formatted = `(${input}`;
    }
    setPhone(formatted);
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center py-8 md:py-12 overflow-y-auto">
      <div className="relative max-w-4xl w-full rounded-lg shadow-2xl p-6 bg-white grid grid-cols-1 gap-2">
        <div className="flex items-center justify-center h-12 border-4 rounded">
          <p className="text-gray-500 text-sm md:text-base italic text-center">
            "Every shared need plants the seed for a stronger, more caring
            community to grow"
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
          <div className="w-full bg-white rounded-lg shadow-lg p-6">
            <form
              className="space-y-6 px-4 max-w-sm mx-auto"
              onSubmit={handleSubmit}
            >
              {/* Message */}
              <div className="flex items-center space-x-4">
                <label className="w-36 text-sm">Message</label>
                <textarea
                  value={needMessage}
                  onChange={(e) => {
                    setNeedMessage(e.target.value);
                    e.target.style.height = "auto";
                    e.target.style.height = `${e.target.scrollHeight}px`;
                  }}
                  className="w-full border-2 rounded-md p-2 text-sm resize-none"
                  placeholder="Describe the need here..."
                />
              </div>

              {/* Category */}

              {/* Category Field */}
              <div className="flex items-center">
                <label className="text-black-400 w-36 text-sm">Category</label>
                <select
                  value={categoryNeed}
                  onChange={(e) => setCategoryNeed(e.target.value)}
                  className="px-3 py-2 w-full text-sm font-medium border-2 border-black-300 rounded-md shadow-md h-10 focus:border-blue-600 focus:ring-2 focus:ring-inset focus:ring-blue-600 bg-white"
                >
                  <option value="education">Education</option>
                  <option value="energy">Energy</option>
                  <option value="equality">Equality</option>
                  <option value="financial">Financial</option>
                  <option value="food">Food</option>
                  <option value="health">Health</option>
                  <option value="infrastructure">Infrastructure</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Location */}
              <div className="flex items-center">
                <label className="w-36 text-sm">Location</label>
                <LocationAutocomplete
                  setLocation={setLocation}
                  setLatitude={setLatitude}
                  setLongitude={setLongitude}
                />
              </div>

              {/* Anonymous Toggle */}
              <div className="flex justify-between border-b border-gray-300 pb-2 mb-4">
                <label className="text-sm italic">Stay Anonymous</label>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isAnonymous}
                  onClick={() => setIsAnonymous(!isAnonymous)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    isAnonymous ? "bg-[#064E65]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      isAnonymous ? "translate-x-5" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Name, Email, Phone */}
              {!isAnonymous && (
                <>
                  <div className="flex items-center">
                    <label className="w-36 text-sm">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border-b-2 p-2 text-sm"
                    />
                  </div>

                  <div className="flex items-center">
                    <label className="w-36 text-sm">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border-b-2 p-2 text-sm"
                    />
                  </div>

                  <div className="flex items-start sm:items-center">
                    <label className="w-36 text-sm pt-2">Phone No.</label>
                    <div className="flex flex-col sm:flex-row gap-2 w-full">
                      <div className="flex gap-2">
                        <select
                          value={countryCode}
                          onChange={(e) => {
                            setCountryCode(e.target.value);
                            if (e.target.value !== "") setCustomCode("");
                          }}
                          className="border rounded-md p-2 text-sm w-[100px]"
                        >
                          {countryCodes.map(({ label, value }) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                        {countryCode === "" && (
                          <input
                            type="text"
                            value={customCode}
                            onChange={(e) =>
                              setCustomCode(
                                e.target.value.replace(/[^\d+]/g, "")
                              )
                            }
                            placeholder="+__"
                            className="w-[80px] border rounded-md p-2 text-sm"
                          />
                        )}
                      </div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={handlePhoneFormat}
                        placeholder="(123) 456-7890"
                        className="flex-grow border-b-2 p-2 text-sm"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full bg-[#064E65] text-white py-2 rounded-md shadow hover:bg-[#053847]"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>

          {/* Right Image */}
          <div className="flex items-center justify-center">
            <img
              src="/images/handsDraw.png"
              alt="Illustration"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>
    </div>
  );
}