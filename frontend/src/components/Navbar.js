import React, { useState, useEffect, useRef } from 'react';
import { FaChevronDown, FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false); // For Products dropdown
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const productDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        productDropdownRef.current &&
        !productDropdownRef.current.contains(event.target)
      ) {
        setIsProductDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Check login status on component load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
  };

  // Toggle dropdowns
  const toggleUserDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const toggleProductDropdown = () => {
    setIsProductDropdownOpen((prev) => !prev);
  };

  return (
    <header className="flex justify-between items-center w-full px-12 py-6 text-indigo-900 bg-white border-b">
      {/* Logo Section */}
      <div className="flex items-center">
        <img
          src="Logo2.png"
          alt="Logo"
          className="w-full h-full mr-6"
        />
      </div>

      {/* Navigation Links */}
      <nav className="flex items-center space-x-8">
        <button
          className="text-violet-700 hover:text-indigo-700 transition duration-300"
          onClick={() => navigate('/')}
        >
          Home
        </button>

        {/* Products Dropdown */}
        <div className="relative" ref={productDropdownRef}>
          <button
            onClick={toggleProductDropdown}
            className="flex items-center space-x-1 text-violet-700 hover:text-indigo-700 transition duration-300"
          >
            <span>Products</span>
            <FaChevronDown className="text-sm" />
          </button>
          {isProductDropdownOpen && (
            <div
              className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-md transition-transform duration-300 ease-out transform scale-y-100 origin-top"
            >
              <ul>
                <li>
                  <a
                    href="/heatmaps"
                    className="block px-4 py-2 text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white transition duration-300 rounded-md"
                  >
                    Heatmaps
                  </a>
                </li>
                <li>
                  <a
                    href="/css-customization-page"
                    className="block px-4 py-2 text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white transition duration-300 rounded-md"
                  >
                    CSS Customization
                  </a>
                </li>
                <li>
                  <a
                    href="/insights"
                    className="block px-4 py-2 text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white transition duration-300 rounded-md"
                  >
                    Insights
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>

        <button
          className="text-violet-700 hover:text-indigo-700 transition duration-300"
          onClick={() => navigate('/help')}
        >
          Help
        </button>

        {/* Conditional Buttons: Login / Signup vs User Profile */}
        {isLoggedIn ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleUserDropdown}
              className="flex items-center space-x-2 text-violet-700 hover:text-indigo-700 transition duration-300"
            >
              <FaUserCircle className="text-3xl" /><span>       </span>
              
            </button>
            {isDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 shadow-lg rounded-md transition-transform duration-300 ease-out transform scale-y-100 origin-top"
              >
                <ul>
                <li>
                    <button
                      onClick={() => navigate('/myprojects')}
                      className="block px-4 py-2 text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white transition duration-300 rounded-md"
                    >
                      My Projects
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="block px-4 py-2 text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white transition duration-300 rounded-md"
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
              className="px-7 py-2 text-indigo-600 border border-indigo-600 rounded hover:bg-indigo-50 transition duration-300"
            >
              LOGIN
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-7 py-2 text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded hover:from-blue-600 hover:to-purple-600 transition"
            >
              SIGNUP
            </button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
