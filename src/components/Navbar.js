// components/Navbar.js
import React from "react";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-orange-400 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-orange-700">NEEDSLOGO</h1>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="text-orange-700 hover:text-orange-900 hover:underline text-lg transition duration-300">
              Home
            </Link>
            <Link href="/reports" className="text-orange-700 hover:text-orange-900 hover:underline text-lg transition duration-300">
              Create Report
            </Link>
            <Link href="/about" className="text-orange-700 hover:text-orange-900 hover:underline text-lg transition duration-300">
              About
            </Link>
            <Link href="/mapLanding" className="text-orange-700 hover:text-orange-900 hover:underline text-lg transition duration-300">
              Map
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
