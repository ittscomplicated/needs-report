import { useState } from "react";
import { useSwipeable } from "react-swipeable";
import ReactMarkdown from "react-markdown";


import Image from "next/image";

const slides = [
  {
    title: "1. Share What You Need",
    description: `
See something your community needs? Whether it’s a broken streetlight, limited access to fresh food, healthcare gaps, we want to hear from you.


You can share your report right here on the site, or simply text us. Your voice matters.
    `,
    image: "/images/Share.svg",
  },
  {
    title: "2. Submit Online or Text Us",
    description: `
**Online:** Click 'Create Report' at the top right. Fill out the short form and hit submit.

**By Text:** Send a message to [phone number] starting with a category (like: “Food”) and a brief description.

_Example: “Food: Our local store ran out of produce again this week.”_
    `,
    image: "/images/pointer.svg",
  },
  {
    title: "3. See the Bigger Picture",
    description: `
Your report appears on our public map to highlight which areas are most impacted.

The more people who share, the stronger our collective voice becomes.
    `,
    image: "/images/signalPlace.svg",
  },
];


export default function OrbitCarousel() {
  const [index, setIndex] = useState(0);

  const prevSlide = () =>
    setIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  const nextSlide = () =>
    setIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));

  const swipeHandlers = useSwipeable({
    onSwipedLeft: nextSlide,
    onSwipedRight: prevSlide,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  return (
    <div
      {...swipeHandlers}
      className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center text-[#064E65]"
    >
      <div className="relative w-full flex flex-col md:flex-row items-center gap-6">
        <div className="md:w-1/2 flex justify-center">
          <div className="relative w-60 h-60">
            <Image
              src={slides[index].image}
              alt={slides[index].title}
              fill
              className="rounded-lg object-contain"
            />
          </div>
        </div>
        <div className="md:w-1/2 text-center md:text-left space-y-2">
          <h3 className="text-2xl font-bold">{slides[index].title}</h3>
          <div className="prose prose-sm text-gray-600">
            <ReactMarkdown>{slides[index].description}</ReactMarkdown>
          </div>

          <p className="text-sm text-gray-400">
            {index + 1}/{slides.length}
          </p>
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        <button
          onClick={prevSlide}
          aria-label="Previous"
          className="bg-[#064E65] text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#053847] transition"
        >
          &#10094;
        </button>
        <button
          onClick={nextSlide}
          aria-label="Next"
          className="bg-[#064E65] text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#053847] transition"
        >
          &#10095;
        </button>
      </div>
    </div>
  );
}
