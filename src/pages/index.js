import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

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
      { threshold: 0.15 },
    );

    sectionsRef.current.forEach(
      (section) => section && observer.observe(section),
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
  <div className="min-h-screen bg-[#f7cb98] text-[#064E65]">
    {/* HERO */}
    <section
      ref={heroRef}
      className="relative h-screen bg-[url('/images/map.png')] bg-cover bg-center"
    >
      <div className="absolute inset-0 bg-[#C17A2A] bg-opacity-15" />
      <div className="text-[#064E65] absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <div
          className="rounded-3xl px-16 py-20 max-w-4xl flex flex-col items-center gap-4"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(251, 217, 163, 0.85) 0%, rgba(250,240,220,0) 85%)",
          }}
        >
          <h2
            className="text-7xl md:text-8xl tracking-tight leading-tight"
            style={{ fontFamily: "'Radley', Georgia, serif" }}
          >
            Report To Rebuild
          </h2>
          <p
            className="text-lg text-[#064E65] max-w-md text-center font-semibold"
            style={{ fontFamily: "Arial, sans-serif" }}
          >
            See something your community needs? Report it. Every voice matters.
          </p>
          <Link
            href="/reports"
            className="bg-[#abdfff] text-[#004989] px-8 py-3 rounded-full text-base font-semibold hover:opacity-90 transition"
          >
            Share a Need
          </Link>
        </div>
        <button
          onClick={scrollToHowItWorks}
          className="absolute bottom-20 left-0 right-0 mx-auto w-fit flex flex-col items-center gap-1 text-[#004989] hover:opacity-80 transition animate-bounce"
        >
          <span className="text-base font-bold tracking-wide bg-[#de9571] bg-opacity-70 px-4 py-1 rounded-full">
            Learn More
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        <div className="absolute bottom-0 left-0 w-full h-1 bg-[#C3CD00]">
          <hr className="border-t-4 border-[#064E65] opacity-20" />
        </div>
      </div>
    </section>

    {/* HOW IT WORKS */}
    <section
      id="how-it-works"
      ref={(el) => (sectionsRef.current[0] = el)}
      className="transform transition duration-1000 opacity-0 translate-y-8 py-20 px-6 md:px-12"
    >
      {/* Section Header */}
      <div className="max-w-6xl mx-auto text-center mb-14">
        <h2
          className="text-5xl md:text-6xl font-bold text-[#064E65] mb-4"
          style={{ fontFamily: "'Radley', Georgia, serif" }}
        >
          How It Works
        </h2>
        <p className="text-lg text-gray-600 max-w-xl mx-auto">
          Submit a report, explore the map and see what your community needs
          most.
        </p>
      </div>

      {/* Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col items-center text-center gap-4 p-10 bg-white rounded-2xl shadow-sm border-4 border-[#C3CD00]">
          <Image src="/images/share.svg" width={80} height={80} alt="Share" />
          <h3
            className="text-2xl font-bold text-[#064E65]"
            style={{ fontFamily: "'Radley', Georgia, serif" }}
          >
            1. Share What You Need
          </h3>
          <p className="text-gray-600 text-base">
            See something your community needs? Whether it's a broken
            streetlight, food access gaps or healthcare concerns; we want to
            hear from you.
          </p>
        </div>

        <div className="flex flex-col items-center text-center gap-4 p-10 bg-white rounded-2xl shadow-sm border-4 border-[#C3CD00]">
          <Image
            src="/images/pointer.svg"
            width={80}
            height={80}
            alt="Submit"
          />
          <h3
            className="text-2xl font-bold text-[#064E65]"
            style={{ fontFamily: "'Radley', Georgia, serif" }}
          >
            2. Submit Online or by Text
          </h3>
          <p className="text-gray-600 text-base">
            Click Share a Need and fill out the short form. Or text us directly.
            No account needed, anyone can report from any device.
          </p>
        </div>

        <div className="flex flex-col items-center text-center gap-4 p-10 bg-white rounded-2xl shadow-sm border-4 border-[#C3CD00]">
          <Image
            src="/images/signalplace.svg"
            width={80}
            height={80}
            alt="Map"
          />
          <h3
            className="text-2xl font-bold text-[#064E65]"
            style={{ fontFamily: "'Radley', Georgia, serif" }}
          >
            3. See the Bigger Picture
          </h3>
          <p className="text-gray-600 text-base">
            Your report appears on our public map. The more people who share,
            the stronger our collective voice becomes.
          </p>
        </div>
      </div>
    </section>
  </div>
);
}
