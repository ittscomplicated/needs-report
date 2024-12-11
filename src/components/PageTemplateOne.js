// components/PageTemplateOne.js

const PageTemplateOne = ({ title, content, images }) => {
  return (
    <div className="flex flex-col items-center text-center px-6 py-12 bg-orange-200	">
      {/* Title */}
      <h1 className="text-4xl font-bold text-orange-700 mb-4">{title}</h1>

      {/* Content */}
      <p className="text-lg text-gray-700 leading-relaxed mb-6">{content}</p>

      {/* Images (Horizontal Layout) */}
      <div className="flex space-x-4">
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Visual ${index + 1}`}
            className="w-1/3 rounded-lg shadow-lg"
          />
        ))}
      </div>
    </div>
  );
};

export default PageTemplateOne;
