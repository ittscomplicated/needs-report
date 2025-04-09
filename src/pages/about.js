import { useEffect, useRef } from "react";
import Image from "next/image";

function AboutPage() {
  const sectionsRef = useRef([]);

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
      { threshold: 0.2 }
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const sections = [
    {
      title: "Who We Are",
      text: "We are a team of individuals who believe in the power of community voices. We care deeply about ensuring everyone’s opinions are heard and valued.",
    },
    {
      title: "Why We Are Doing This",
      text: "We know that every voice matters. By amplifying concerns and ideas, we can create meaningful change and build a community where everyone feels seen.",
    },
    {
      title: "What We Want to Provide",
      text: "Our mission is to provide a platform where your voice is not only heard but acted upon, fostering a stronger, more connected community.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#A2D6F9] to-[#FAF8F0]">
      {/* Hero Section */}
<section className="pt-24 pb-12 px-6 md:px-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2 space-y-4">
            <h1 className="text-5xl font-bold text-[#064E65]">About Us</h1>
            <p className="text-lg text-gray-700 italic">
              We are committed to providing accurate and insightful reports to empower decision-makers.
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
<hr className="my-12 border-t-4 border-[#064E65] rounded-full w-1/5 mx-auto" />

      {/* Values Section */}
<section className="max-w-6xl mx-auto px-6 md:px-12 pt-8 pb-16 space-y-12">
        {sections.map((section, i) => (
          <div
            key={i}
            ref={(el) => (sectionsRef.current[i] = el)}
            className="bg-white p-6 shadow-md rounded-lg flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6 transform transition duration-1000 opacity-0 translate-y-8"
          >
            <h3 className="text-2xl font-semibold text-[#064E65] md:w-1/3">{section.title}</h3>
            <div className="hidden md:block w-px h-24 bg-black" />
            <p className="text-gray-600 md:w-2/3">{section.text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

export default AboutPage;
