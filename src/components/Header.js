import Link from "next/link";

function Header() {
  return (
    <nav className="relative bg-[#C3CD00] shadow-md p-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo - Stays on the left */}
        <div className="flex items-center">
          <Link href="/">
            <img
              src="/images/needsTransparent.png"
              alt="Needs Report Logo"
              className="w-13 h-10 object-fill"
            />
          </Link>
        </div>

        {/* Centered Navigation Links with Separator */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-4 text-lg">
          <Link href="/about" className="text-gray-700 hover:text-blue-600 transition">
            About
          </Link>
          <span className="text-gray-400">|</span> {/* Separator */}
          <Link href="/map" className="text-gray-700 hover:text-blue-600 transition">
            Map
          </Link>
        </div>

        {/* Right-Aligned Create Report Button */}
        <div className="ml-auto">
          <Link
            href="/reports"
            className="bg-[#064E65] text-white px-5 py-2 rounded-full text-lg font-semibold hover:bg-[#043B4D] transition"
          >
            Create Report
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Header;
