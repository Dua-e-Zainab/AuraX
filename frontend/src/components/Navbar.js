import React, { useState, useEffect, useRef } from 'react';
import { FaChevronDown, FaUserCircle } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const productDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (productDropdownRef.current && !productDropdownRef.current.contains(event.target)) {
        setIsProductDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
  };

  const toggleUserDropdown = () => setIsDropdownOpen((prev) => !prev);
  const toggleProductDropdown = () => setIsProductDropdownOpen((prev) => !prev);

  return (
    <>
      {/* Navbar */}
      <header className="flex justify-between items-center w-full px-12 py-6 text-lg text-indigo-900 bg-white border-b">
        {/* Logo Section */}
        <div className="flex items-center">
          <img
            src="Logo2.png"
            alt="Logo"
            className="w-full h-full mr-6"
          />
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-10">
          <button
            className="text-violet-700 hover:text-indigo-700 transition duration-300 font-medium"
            onClick={() => navigate('/')}
          >
            Home
          </button>

          {/* Products Dropdown */}
          <div className="relative" ref={productDropdownRef}>
            <button
              onClick={toggleProductDropdown}
              className="flex items-center space-x-1 text-violet-700 hover:text-indigo-700 transition duration-300 font-medium"
            >
              <span>Products</span>
              <FaChevronDown className="text-sm" />
            </button>
            {isProductDropdownOpen && (
              <div className="absolute left-0 mt-2 w-52 bg-white border border-gray-200 shadow-lg rounded-md transition-transform duration-300 ease-out transform scale-y-100 origin-top">
                <ul>
                  {[
                    { label: 'Heatmaps', href: '/heatmap-page' },
                    { label: 'CSS Customization', href: '/css-customization-page' },
                    { label: 'Insights', href: '/insights-page' },
                  ].map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        className="block px-4 py-2 text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white transition duration-300 rounded-md"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Help Popup */}
          <button
            className="text-violet-700 hover:text-indigo-700 transition duration-300 font-medium"
            onClick={() => setIsHelpOpen(true)}
          >
            Help
          </button>

          {/* Auth Buttons */}
          {isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleUserDropdown}
                className="flex items-center space-x-10 text-violet-700 hover:text-indigo-700 transition duration-300"
              >
                <FaUserCircle className="text-4xl" />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 shadow-lg rounded-md transition-transform duration-300 ease-out transform scale-y-100 origin-top">
                  <ul>
                    <li>
                      <button
                        onClick={() => navigate('/myprojects')}
                        className="block px-8 py-2 text-gray-700  hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white transition duration-300 rounded-md"
                      >
                        My Projects
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="block px-11 py-2 text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white transition duration-300 rounded-md"
                      >
                        Sign Out
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/login')}
                className="px-7 py-2 text-lg text-indigo-600 border border-indigo-600 rounded hover:bg-indigo-50 transition duration-300"
              >
                LOGIN
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-7 py-2 text-lg text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded hover:from-blue-600 hover:to-purple-600 transition"
              >
                SIGNUP
              </button>
            </div>
          )}
        </nav>
      </header>

      {/* Help Modal */}
      {isHelpOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="relative bg-white rounded-lg shadow-2xl w-[500px] max-w-[90%] p-6 space-y-5">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600 transition"
              onClick={() => setIsHelpOpen(false)}
            >
              <IoMdClose className="text-2xl" />
            </button>

            <h2 className="text-xl font-semibold text-gray-800 mb-2">Help Topics</h2>

            {[
              "What is a heatmap, and how can it help my website?",
              "How do I interpret the heatmap data?",
              "What CSS changes should I consider based on my heatmap results?",
            ].map((question, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-3 h-3 mt-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                <p className="text-gray-800 text-sm">{question}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
