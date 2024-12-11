// components/Navbar.js
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const Navbar = () => {
  const router = useRouter();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/reports", label: "Create Report" },
    { href: "/about", label: "About" },
    { href: "/mapLanding", label: "Map" },
  ];

  return (
    <nav className="bg-orange-400 shadow-md">
      <div className=" mx-left px-4 sm:px-6 lg:px-8 flex justify-between items-center h-10">
        {/* Logo */}
        <img src="/images/logo.jpg" alt="Logo" className="h-10 w-auto flex-shrink-0" />

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-9">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-lg transition duration-300 ${
                // If the current path matches the link href, add text-orange-900
                router.pathname === link.href
                  ? "text-orange-900 underline"
                  : "text-orange-700 hover:text-orange-900 hover:underline"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
