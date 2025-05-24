import { useState } from "react";

const STATUSES = ["Submitted", "Reviewed", "In Progress", "Resolved"];

export default function TrackPage() {
  const [receipt, setReceipt] = useState("");
  const [currentStep, setCurrentStep] = useState(null); // start as null until searched

  const handleSearch = () => {
    const fakeProgress = Math.floor(Math.random() * STATUSES.length);
    setCurrentStep(fakeProgress);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#A2D6F9] to-[#FAF8F0] text-[#064E65]">
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-6 md:px-12">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-6 text-center">
          <h1 className="text-5xl font-bold text-[#064E65]">
            Find Your Report
          </h1>
          <p className="text-lg text-gray-700 italic max-w-xl">
            Enter your receipt number to track the status of your submitted
            need.
          </p>
        </div>
      </section>

      <hr className="mb-12 border-t-4 border-[#064E65] rounded-full w-1/5 mx-auto" />

      {/* Form + Result */}
      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-lg p-6 space-y-6">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter your receipt number"
            value={receipt}
            onChange={(e) => setReceipt(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded text-sm"
          />
          <button
            onClick={handleSearch}
            className="w-full bg-[#064E65] text-white py-2 rounded hover:bg-[#053847] transition"
          >
            Check Status
          </button>
        </div>

        {/* Progress Tracker */}
        {currentStep !== null && (
          <div className="flex items-center justify-between gap-2">
            {STATUSES.map((step, idx) => (
              <div
                key={step}
                className="flex-1 flex flex-col items-center text-center text-xs font-medium"
              >
                <div
                  className={`w-full h-2 rounded transition-all ${
                    idx <= currentStep ? "bg-[#064E65]" : "bg-gray-200"
                  }`}
                ></div>
                <span
                  className={`mt-1 ${
                    idx <= currentStep ? "text-[#064E65]" : "text-gray-400"
                  }`}
                >
                  {step}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
