import { useState } from "react";
import Image from "next/image";

function AboutPage() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`transition-all duration-700 ${isExpanded ? "min-h-[200vh]" : "min-h-screen"}`}>
      {/* Hero Section - Takes Full Screen */}
      <section className="h-screen bg-[#A2D6F9] shadow-md flex flex-col justify-center relative">
        <div className="container mx-auto flex flex-col md:flex-row items-center px-6 md:px-12">
          <div className="md:w-1/2 text-left">
            <h1 className="text-5xl font-bold text-[#064E65]">About Us</h1>
            <p className="text-lg text-gray-700 mt-4 italic">
              We are committed to providing accurate and insightful reports to empower decision-makers.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <Image
              src="/images/The Needs.png"
              width={320}
              height={100}
              alt="About Us"
              className="rounded-lg shadow-sm"
            />
          </div>
        </div>

        {/* Expand Arrow */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
          <button 
            onClick={() => setIsExpanded(!isExpanded)} 
            className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-200 transition"
          >
            {isExpanded ? "▲" : "▼"} {/* Toggle between up/down arrow */}
          </button>
        </div>
      </section>

      {/* Expandable Value Section */}
      <section className={`container mx-auto px-6 md:px-12 py-16 transition-all duration-700 ${isExpanded ? "opacity-100 scale-100" : "opacity-0 scale-95 h-0 overflow-hidden"}`}>
        <div className="space-y-6">
          {/* Value 1 */}
          <div className="bg-white p-6 shadow-md rounded-lg flex flex-col md:flex-row items-center justify-center text-center">
            <div className="w-full md:w-1/3 flex items-center justify-center">
              <h3 className="text-2xl font-semibold text-[#064E65]">Who We Are</h3>
            </div>
            <div className="hidden md:block w-px h-24 bg-black mx-6"></div>
            <div className="w-full md:w-2/3 flex items-center justify-center">
              <p className="text-gray-600">
                We are a team of individuals who believe in the power of community voices. 
                We care deeply about ensuring everyone’s opinions are heard and valued.
              </p>
            </div>
          </div>

          {/* Value 2 */}
          <div className="bg-white p-6 shadow-md rounded-lg flex flex-col md:flex-row items-center justify-center text-center">
            <div className="w-full md:w-1/3 flex items-center justify-center">
              <h3 className="text-2xl font-semibold text-[#064E65]">Why We Are Doing This</h3>
            </div>
            <div className="hidden md:block w-px h-24 bg-black mx-6"></div>
            <div className="w-full md:w-2/3 flex items-center justify-center">
              <p className="text-gray-600">
                We know that every voice matters. By amplifying concerns and ideas, we can create meaningful change and build a community where everyone feels seen.
              </p>
            </div>
          </div>

          {/* Value 3 */}
          <div className="bg-white p-6 shadow-md rounded-lg flex flex-col md:flex-row items-center justify-center text-center">
            <div className="w-full md:w-1/3 flex items-center justify-center">
              <h3 className="text-2xl font-semibold text-[#064E65]">What We Want to Provide</h3>
            </div>
            <div className="hidden md:block w-px h-24 bg-black mx-6"></div>
            <div className="w-full md:w-2/3 flex items-center justify-center">
              <p className="text-gray-600">
                Our mission is to provide a platform where your voice is not only heard but acted 
                upon, fostering a stronger, more connected community.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
