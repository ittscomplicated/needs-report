//components/CardSection.js
import React from "react";

const CardSection = () => {
  const cards = [
    {
      title: "Submit Reports",
      description: "Quickly and easily report issues or concerns in your community. Help us create a better environment for everyone.",
    },
    {
      title: "Track Progress",
      description: "Stay updated on the progress of reported issues. See how your contributions make a real difference.",
    },
    {
      title: "Collaborate Locally",
      description: "Join forces with neighbors and organizations to find solutions and strengthen your community bonds.",
    },
  ];

  return (
    <div >
  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
    {cards.map((card, index) => (
      <div
        key={index}
        className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300"
      >
        <h2 className="text-xl font-bold text-teal-600 mb-4 text-center">
          {card.title}
        </h2>
        <ul className="text-gray-600 text-center list-disc list-inside">
          {card.description.split('. ').map((sentence, i) => (
            <li key={i}>{sentence.trim()}{sentence.trim().endsWith('.') ? '' : '.'}</li>
          ))}
        </ul>
                  <button
            className="bg-green-600 text-white px-6 py-3 font-medium hover:bg-green-700 hover:scale-105 transition-transform transition-colors duration-200"
          >
            See more
          </button>
      </div>
    ))}
  </div>
</div>

  );
};

export default CardSection;
