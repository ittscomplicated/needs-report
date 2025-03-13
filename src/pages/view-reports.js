import { useEffect, useState } from "react";

const ViewReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(`${API_ENDPOINT}/fetchReports`);
        if (!response.ok) throw new Error("Failed to fetch reports");
        const data = await response.json();
        setReports(data.items);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-100">
      <h1 className="text-4xl font-bold text-[#064E65] mb-6">Community Reports</h1>

      {loading && <p className="text-lg text-gray-600">Loading reports...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && reports.length === 0 && (
        <p className="text-gray-600">No reports available yet.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {reports.map((report, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-[#064E65]">
              {report.name?.S || "Anonymous"}
            </h2>
            <p className="text-gray-600">{report.location?.S || "Location not provided"}</p>
            <p className="text-gray-700 mt-2">{report.needMessage?.S || "No message provided"}</p>
            <p className="mt-4 text-sm text-gray-500">
              Category: {report.categoryNeed?.L?.map((c) => c.S).join(", ") || "N/A"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewReportsPage;