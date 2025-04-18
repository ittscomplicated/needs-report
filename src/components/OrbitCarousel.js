// components/OrbitCarousel.js

import { useState, useRef } from "react";
import { useSwipeable } from "react-swipeable";

const slides = [
  {
    title: "1. Share What You Need",
    emoji: "📣",
    content: [
      "See something your community needs? Whether it’s a broken streetlight, limited access to fresh food, healthcare gaps — we want to hear from you.",
      "You can share your report right here on the site, or simply text us. Your voice matters.",
    ],
  },
  {
    title: "2. Submit Online or Text Us",
    emoji: "💬",
    content: [
      "**Online:** Click 'Create Report' at the top right. Fill out the short form and hit submit.",
      "**By Text:** Send a message to [phone number] starting with a category (like: “Food”) and a brief description.",
      "_Example: “Food: Our local store ran out of produce again this week.”_",
    ],
  },
  {
    title: "3. See the Bigger Picture",
    emoji: "🗺️",
    content: [
      "Your report appears on our public map to highlight which areas are most impacted.",
      "The more people who share, the stronger our collective voice becomes.",
    ],
  },
];

export default function OrbitCarousel() {
  const [index, setIndex] = useState(0);
  const numSlides = slides.length;
  const containerRef = useRef();

  const goTo = (dir) => {
    setIndex((prev) => (prev + dir + numSlides) % numSlides);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => goTo(1),
    onSwipedRight: () => goTo(-1),
    trackMouse: true,
  });

  return (
    <div
      {...handlers}
      className="flex flex-col items-center justify-center relative"
    >
      <div className="w-full overflow-hidden">
        <div
          ref={containerRef}
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div
              key={i}
              className={`min-w-full flex-shrink-0 px-6 py-10 flex flex-col items-center justify-center 
              ${
                i === index
                  ? "border-4 border-[#A2D6F9] shadow-xl bg-white scale-105"
                  : "opacity-60 scale-95"
              } transition-all duration-500 rounded-lg`}
              style={{
                transform: `translateZ(${i === index ? "0px" : "-40px"})`,
              }}
            >
              <div className="text-4xl mb-2">{slide.emoji}</div>
              <h2 className="text-2xl font-bold text-[#064E65] mb-2 text-center">
                {slide.title}
              </h2>
              <ul className="text-gray-700 text-left max-w-md list-disc space-y-2">
                {slide.content.map((line, j) => (
                  <li key={j} className="leading-relaxed">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: line
                          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // bold
                          .replace(/_(.*?)_/g, "<em>$1</em>"), // italic
                      }}
                    />
                  </li>
                ))}
              </ul>

              <div className="text-4xl mt-4">{slide.emoji}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Nav Dots */}
      <div className="flex mt-4 space-x-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full ${
              i === index ? "bg-[#064E65]" : "bg-gray-300"
            }`}
          ></button>
        ))}
      </div>

      {/* Prev/Next */}
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
        <button
          onClick={() => goTo(-1)}
          className="text-2xl text-gray-700 hover:text-[#064E65]"
        >
          ←
        </button>
      </div>
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
        <button
          onClick={() => goTo(1)}
          className="text-2xl text-gray-700 hover:text-[#064E65]"
        >
          →
        </button>
      </div>
    </div>
  );
}
