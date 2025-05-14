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

const Reports = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [categoryNeed, setCategoryNeed] = useState("education"); // Default to 'education'
  const [needMessage, setNeedMessage] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [countryCode, setCountryCode] = useState("+1");
  const [customCode, setCustomCode] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setError(null);
        },
        (error) => {
          setError(error.message);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []); // Runs once on component mount

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Manual validation
    if (!needMessage.trim()) {
      alert("Please enter a message for your report.");
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
    const finalCode = countryCode !== "" ? countryCode : customCode;
    const cleanedPhone = phone.replace(/\D/g, "");

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          latitude,
          longitude,
          name: isAnonymous ? "" : name,
          email: isAnonymous ? "" : email,
          phone: isAnonymous ? "" : cleanedPhone,
          location,
          categoryNeed,
          needMessage,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      alert("Data stored successfully");
      setName("");
      setEmail("");
      setPhone("");
      setLocation("");
      setLatitude("");
      setLongitude("");
      setCategoryNeed("education");
      setNeedMessage("");
    } catch (error) {
      console.error("Error storing data:", error);
      setError("Failed to store data. Please try again.");
      alert("Failed to store data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section className="w-full min-h-screen flex items-center justify-center py-8 md:py-12">
        <div className="relative max-w-4xl w-full rounded-lg shadow-2xl p-6 hover:shadow-[8px_8px_24px_rgba(0,0,0,0.3)] transition-shadow bg-white grid grid-cols-1 gap-2">
          {/* Top Full-Width Quote */}
          <div className="flex items-center justify-center h-12 border-4 w-full rounded">
            <p className="text-gray-500 text-sm md:text-base italic text-center">
              "Every shared need plants the seed for a stronger, more caring
              community to grow"
            </p>
          </div>

          {/* Bottom Grid: Form + Image */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
            {/* Form Card */}
            <div className="w-full bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <form
                className="space-y-6 px-4 max-w-sm mx-auto font-[sans-serif]"
                onSubmit={handleSubmit}
              >
                {/* Message Field */}
                <div className="flex items-center space-x-4">
                  <label
                    htmlFor="report-message"
                    className="text-black-400 w-36 text-sm"
                  >
                    Message
                  </label>
                  <textarea
                    id="report-message"
                    value={needMessage}
                    onChange={(e) => {
                      setNeedMessage(e.target.value);
                      e.target.style.height = "auto";
                      e.target.style.height = `${e.target.scrollHeight}px`;
                    }}
                    className="px-3 py-2 w-full border-2 rounded-md focus:border-[#333] outline-none text-sm bg-white resize-none"
                    placeholder="Describe the need here..."
                  ></textarea>
                </div>

                {/* Category Field */}
                <div className="flex items-center">
                  <label className="text-black-400 w-36 text-sm">
                    Category
                  </label>
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

                {/* Location Field */}
                <div className="flex items-center">
                  <label className="text-black-400 w-36 text-sm">
                    Location
                  </label>
                  <LocationAutocomplete
                    setLocation={setLocation}
                    setLatitude={setLatitude}
                    setLongitude={setLongitude}
                  />
                </div>

                {/* Privacy Toggle */}
                <div className="flex items-center justify-between border-t border-gray-300 pt-4 mt-4">
                  <label className="text-black-400 text-sm flex items-center italic">
                    Stay Anonymous
                  </label>
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

                {/* Conditionally Rendered Fields */}
                {!isAnonymous && (
                  <>
                    {/* Name Field */}
                    <div className="flex items-center">
                      <label className="text-black-400 w-36 text-sm">
                        Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="px-2 py-2 w-full border-b-2 focus:border-[#333] outline-none text-sm bg-white"
                      />
                    </div>

                    {/* Email Field */}
                    <div className="flex items-center">
                      <label className="text-black-400 w-36 text-sm">
                        Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="px-2 py-2 w-full border-b-2 focus:border-[#333] outline-none text-sm bg-white"
                      />
                    </div>

                    {/* Phone Field */}
                    <div className="flex items-start sm:items-center">
                      <label className="text-black-400 w-36 text-sm pt-2">
                        Phone No.
                      </label>
                      <div className="flex flex-col sm:flex-row gap-2 w-full">
                        {/* Country Code */}
                        <div className="flex gap-2">
                          <select
                            value={countryCode}
                            onChange={(e) => {
                              setCountryCode(e.target.value);
                              if (e.target.value !== "") setCustomCode("");
                            }}
                            className="border border-gray-300 text-sm rounded-md py-2 px-2 bg-white w-[100px]"
                          >
                            <option value="+1">🇺🇸 +1</option>
                            <option value="+44">🇬🇧 +44</option>
                            <option value="+52">🇲🇽 +52</option>
                            <option value="+91">🇮🇳 +91</option>
                            <option value="">🌍 Other</option>
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
                              className="w-[80px] border border-gray-300 rounded-md py-2 px-2 text-sm"
                            />
                          )}
                        </div>

                        {/* Phone Number */}
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => {
                            const input = e.target.value.replace(/\D/g, "");
                            let formatted = input;

                            if (input.length > 6) {
                              formatted = `(${input.slice(0, 3)}) ${input.slice(
                                3,
                                6
                              )}-${input.slice(6)}`;
                            } else if (input.length > 3) {
                              formatted = `(${input.slice(0, 3)}) ${input.slice(
                                3
                              )}`;
                            } else if (input.length > 0) {
                              formatted = `(${input}`;
                            }

                            setPhone(formatted);
                          }}
                          placeholder="(123) 456-7890"
                          className="flex-grow px-2 py-2 border-b-2 focus:border-[#333] outline-none text-sm bg-white"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="!mt-8 px-6 py-2 w-full bg-[#064E65] text-sm text-white mx-auto block"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </form>
            </div>

            {/* Image on the right */}
            <div className="flex items-center justify-center">
              <img
                src="/images/handsDraw.png"
                alt="Illustration"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {error && <p className="text-red-500 text-center">{error}</p>}
    </div>
  );
};

export default Reports;
