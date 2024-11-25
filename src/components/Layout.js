// components/Layout.js
import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    // Layout Component
    <div className="min-h-screen bg-orange-50 flex flex-col">
      
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <footer className="bg-orange-100 text-center py-4">
        <p className="text-gray-600 text-sm">&copy; 2024 NeedsReport. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;