import Image from "next/image";
import OrbitCarousel from "../components/OrbitCarousel";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#A2D6F9] to-[#FAF8F0] text-[#064E65]">
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-6 md:px-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2 space-y-4">
            <h1 className="text-5xl font-bold text-[#064E65]">How It Works</h1>
            <p className="text-lg text-gray-700 italic">
              Discover how to submit a report, explore the map and see what your
              community needs most.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <Image
              src="/images/The Needs.png"
              width={320}
              height={100}
              alt="About Us"
            />
          </div>
        </div>
      </section>

      <hr className="mb-12 border-t-4 border-[#064E65] rounded-full w-1/5 mx-auto" />

      {/* Carousel */}
      <div className="px-6 md:px-12">
        <OrbitCarousel />
      </div>
    </div>
  );
}
