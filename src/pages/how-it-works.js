// pages/how-it-works.js

import OrbitCarousel from "../components/OrbitCarousel";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF8F0] to-white px-6 py-16 text-[#064E65]">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
        How Needs Report Works
      </h1>
      <OrbitCarousel />
      <div className="text-center pt-10">
        <p className="text-lg font-medium text-[#0B4F6C]">
          💛 Every report makes a difference 💛
        </p>
        <p className="text-gray-600 mt-2">
          Let’s build a stronger, more caring community — together.
        </p>
      </div>
    </div>
  );
}
