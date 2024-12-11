import CardSection from "@/components/CardSection"; 


const HomePage = ({ backgroundOpacity = 0.3 }) => {
  return (
    <div className="relative w-full h-screen">
      {/* Background Map */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/images/map.png')`,
          opacity: backgroundOpacity,
        }}
      ></div>

      {/* Overlay Content */}
      <div className="absolute inset-0 flex gap-y-4 flex-col items-center justify-center text-white">
       
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg text-blue-900 leading-tight">
            <span>Report and Improve</span>
            <br />
            <span>Your Community</span>
          </h1>
        </div>

        {/* Subtitle
        <p className="text-lg md:text-2xl mb-8 drop-shadow-md text-center text-black-400">
          Help us improve your community by reporting issues and concerns
        </p> */}

        {/* Search Bar */}
        <div className="w-11/12 md:w-2/3 lg:w-1/2 bg-teal-600 rounded-lg shadow-lg flex items-center overflow-hidden">
          <input
            type="text"
            placeholder="Search for resources"
            className="w-full px-4 py-3 text-gray-800 bg-white focus:outline-none rounded-l-lg"
          />
          <button
            className="bg-green-600 text-white px-6 py-3 font-medium hover:bg-green-700 hover:scale-105 transition-transform transition-colors duration-200"
          >
            Search
          </button>
        </div>

        {/* Cards Section */}
        <div class="pt-10">
          <CardSection />
        </div>
        

      </div>
    </div>
  );
};

export default HomePage;
