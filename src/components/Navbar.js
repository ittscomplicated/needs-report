// components/Navbar.js
import React from "react";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/reports">Create Report</Link></li>
        <li><Link href="/about">About</Link></li>
        <li><Link href="/mapLanding">Map</Link></li>
      </ul>
    </nav>
  );

};

export default Navbar;
