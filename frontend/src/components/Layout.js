// src/components/Layout.js
import React from 'react';
import Navbar from './Navbar';  // Import Navbar
import Footer from './Footer';  // Import Footer

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main>
        {children}  {/* This will render the nested route content */}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
