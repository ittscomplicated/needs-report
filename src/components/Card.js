// src/components/Card.js
import React from 'react';
import PropTypes from 'prop-types';

function Card({ title, description, imageUrl }) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {imageUrl && (
        <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
      )}
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}

Card.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  imageUrl: PropTypes.string,
};

export default Card;
