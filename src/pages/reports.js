import { useState, useEffect } from 'react';

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

  const API_ENDPOINT = "https://3jvbo1tb1f.execute-api.us-west-2.amazonaws.com/dev/StoreCoordinatesFunction";

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
      setError('Geolocation is not supported by this browser.');
    }
  }, []); // Runs once on component mount

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latitude, longitude, name, email, phone, location, categoryNeed, needMessage }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      alert('Data stored successfully');
      setName("");
      setEmail("");
      setPhone("");
      setLocation("");
      setLatitude("");
      setLongitude("");
      setCategoryNeed("education");
      setNeedMessage("");
    } catch (error) {
      console.error('Error storing data:', error);
      setError("Failed to store data. Please try again.");
      alert('Failed to store data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section className="w-full lg:h-screen flex items-center justify-center">
        <div className="max-w-4xl w-full rounded-lg shadow-2xl p-6 hover:shadow-[8px_8px_24px_rgba(0,0,0,0.3)] transition-shadow grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="mx-auto max-w-lg text-center">
              <p className="mt-4 text-gray-500">
                "Every shared need plants the seed for a stronger, more caring community to grow"
              </p>
              <br />
            </div>

            <form className="space-y-6 px-4 max-w-sm mx-auto font-[sans-serif]" onSubmit={handleSubmit}>
              <div className="flex items-center">
                <label className="text-black-400 w-36 text-sm">Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="px-2 py-2 w-full border-b-2 focus:border-[#333] outline-none text-sm bg-white" />
              </div>
              <div className="flex items-center">
                <label className="text-black-400 w-36 text-sm">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="px-2 py-2 w-full border-b-2 focus:border-[#333] outline-none text-sm bg-white" />
              </div>
              <div className="flex items-center">
                <label className="text-black-400 w-36 text-sm">Phone No.</label>
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required className="px-2 py-2 w-full border-b-2 focus:border-[#333] outline-none text-sm bg-white" />
              </div>
              <div className="flex items-center">
                <label className="text-black-400 w-36 text-sm">Location</label>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required className="px-2 py-2 w-full border-b-2 focus:border-[#333] outline-none text-sm bg-white" />
              </div>
              <div className="flex items-center">
                <label className="text-black-400 w-36 text-sm">Category Need</label>
                <select value={categoryNeed} onChange={(e) => setCategoryNeed(e.target.value)} className="px-3 py-2 w-full text-sm font-medium border-2 border-black-300 rounded-md shadow-md h-10 focus:border-blue-600 focus:ring-2 focus:ring-inset focus:ring-blue-600 bg-white">
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
              <div className="flex items-center space-x-4">
                <label htmlFor="report-message" className="text-black-400 w-36 text-sm">Report Message</label>
                <textarea id="report-message" value={needMessage} onChange={(e) => setNeedMessage(e.target.value)} required className="px-3 py-2 w-full h-32 border-2 rounded-md focus:border-[#333] outline-none text-sm bg-white resize-none"></textarea>
              </div>
              <button type="submit" className="!mt-8 px-6 py-2 w-full bg-[#064E65] text-sm text-white mx-auto block" disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>
          <div className="flex items-center rounded-lg p-6">
            <img alt="" src="/images/handsDraw.png" />
          </div>
        </div>
      </section>
      {error && <p className="text-red-500 text-center">{error}</p>}
    </div>
  );
};

export default Reports;
