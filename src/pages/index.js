import Image from "next/image";
import { useEffect, useRef } from "react";
import OrbitCarousel from "../components/OrbitCarousel";

export default function HomePage() {
  const sectionsRef = useRef([]);
  const heroRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-8");
          }
        });
      },
      { threshold: 0.15 }
    );

    sectionsRef.current.forEach(
      (section) => section && observer.observe(section)
    );
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    const onScroll = () => {
      const heroHeight = window.innerHeight; // since your hero is h-screen
      const y = window.scrollY;

      // progress: 0 at top, 1 when you scroll one full screen
      const progress = Math.min(Math.max(y / heroHeight, 0), 1);

      // fade out as you scroll down
      const opacity = 1 - progress;

      // move up slightly as it fades out (optional, looks nice)
      const translateY = -progress * 30; // px

      el.style.opacity = String(opacity);
      el.style.transform = `translateY(${translateY}px)`;
    };

    onScroll(); // run once on load
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToHowItWorks = () => {
    const el = document.getElementById("how-it-works");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#A2D6F9] to-[#FAF8F0] text-[#064E65]">
      {/* 1) HERO SECTION */}
      <section
        ref={heroRef}
        className="relative h-screen bg-[url('/images/map.png')] bg-cover bg-center"
      >
        <div className="absolute inset-0 bg-[#FFFEED] bg-opacity-50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <h2
            className="text-6xl md:text-7xl mb-4 tracking-tight leading-tight text-[#064E65]"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              textShadow: "0 2px 6px rgba(6,78,101,0.12)",
            }}
          >
            Report To Rebuild
          </h2>

          <div className="mb-8 bg-blue/20 backdrop-blur-sm rounded-2xl p-6 text-center">
            <p
              className="text-lg italic text-gray-700"
              style={{ fontFamily: "'Poppins', Arial, sans-serif" }}
            >
              The Needs Report helps people report local issues and explore what
              communities are asking for around the world.
            </p>
          </div>

          <button
            type="button"
            onClick={scrollToHowItWorks}
            className="px-10 py-3 bg-[#C8C000] text-[#064E65] rounded-full text-lg shadow-lg hover:bg-[#A2D6F9] transition font-semibold"
            style={{ fontFamily: "'Poppins', Arial, sans-serif" }}
          >
            How It Works
          </button>
        </div>
      </section>

      {/* 2) WHAT IS SECTION */}
      <section
        ref={(el) => (sectionsRef.current[0] = el)}
        className="max-w-4xl mx-auto px-6 md:px-12 py-16 transform transition duration-1000 opacity-0 translate-y-8"
      >
      </section>

      {/* 3) HOW IT WORKS SECTION */}
      <section
        id="how-it-works"
        ref={(el) => (sectionsRef.current[1] = el)}
        className="transform transition duration-1000 opacity-0 translate-y-8"
      >
        {/* How It Works hero */}
        <div className="pt-10 pb-10 px-6 md:px-12">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2 space-y-4">
              <h1 className="text-5xl font-bold text-[#064E65]">
                How It Works
              </h1>
              <p className="text-lg text-gray-700 italic">
                Discover how to submit a report, explore the map and see what
                your community needs most.
              </p>
            </div>

            {/* if you do NOT want logo here later, remove this Image block */}
            <div className="md:w-1/2 flex justify-center">
              <Image
                src="/images/The Needs.png"
                width={320}
                height={100}
                alt="The Needs"
              />
            </div>
          </div>
        </div>

        <hr className="mb-10 border-t-4 border-[#064E65] rounded-full w-1/5 mx-auto" />

        {/* Carousel */}
        <div className="px-6 md:px-12 pb-16">
          <OrbitCarousel />
        </div>
      </section>
    </div>
  );
}
