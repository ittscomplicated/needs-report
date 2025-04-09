import Link from "next/link";

function HomePage() {
  return (
    <div className="relative h-screen bg-[url('/images/map.png')] bg-cover bg-center">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-[#FFFEED] bg-opacity-50"></div>

      {/* Centered Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <h2 className="text-7xl mb-4 radley-font text-[#064E65]">Report To Rebuild</h2>
       <Link href="/how-it-works" passHref>
  <button className="px-10 py-2 bg-[#C8C000] text-[#064E65] rounded-full text-lg shadow-md hover:bg-[#A2D6F9] transition">
    How It Works?
  </button>
</Link>
      </div>
    </div>
  );
}

export default HomePage;
