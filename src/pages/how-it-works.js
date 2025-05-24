import OrbitCarousel from "../components/OrbitCarousel";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#A2D6F9] to-[#FAF8F0] text-[#064E65]">
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-6 md:px-12">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-6 text-center">
          <h1 className="text-5xl font-bold text-[#064E65]">
            How Needs Report Works
          </h1>
          <p className="text-lg text-gray-700 italic max-w-xl">
            See how your voice turns into real community change.
          </p>
        </div>
      </section>

      <hr className="mb-12 border-t-4 border-[#064E65] rounded-full w-1/5 mx-auto" />

      {/* Carousel */}
      <div className="px-6 md:px-12">
        <OrbitCarousel />
      </div>

      {/* Closing Message */}
      <div className="text-center pt-12 pb-16 px-4">
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
