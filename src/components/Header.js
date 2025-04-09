import Link from "next/link";

function Header() {
  return (
    <>
      {/* Top Banner */}
      <div className="bg-red-600 text-white text-center py-2 text-xs md:text-sm font-semibold">
        Site Still Under Construction, Please Excuse the Mess :)
      </div>

      <nav className="bg-[#C3CD00] shadow-md px-4 py-3">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo */}
          <div className="flex justify-center md:justify-start">
            <Link href="/">
              <img
                src="/images/needsTransparent.png"
                alt="Needs Report Logo"
                className="h-10 object-contain"
              />
            </Link>
          </div>

          {/* Nav Links */}
          <div className="flex justify-center space-x-4 text-base font-medium text-gray-700">
            <Link href="/about" className="hover:text-blue-600 transition">About</Link>
            <span className="text-gray-400">|</span>
            <Link href="/map" className="hover:text-blue-600 transition">Map</Link>
          </div>

          {/* Button */}
          <div className="flex justify-center md:justify-end">
            <Link
              href="/reports"
              className="bg-[#064E65] text-white px-4 py-2 rounded-full text-base font-semibold hover:bg-[#043B4D] transition"
            >
              Create Report
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Header;
