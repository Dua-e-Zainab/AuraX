import { FaUserAlt } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

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

  return (
    <>
      <nav className="navbar1">
        <header className="flex justify-between items-center w-full px-12 py-5 text-indigo-900 bg-white border-b">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="Logo2.png" alt="AuraX Logo" className="h-18" />
          </Link>

          <div className="flex items-center space-x-10 ml-8">
            <Link to="/myprojects" className="hover:underline">
              My Projects
            </Link>

            {/* Changed from Link to Button for Help */}
            <button
              onClick={() => setIsHelpOpen(true)}
              className="hover:underline text-indigo-900 focus:outline-none"
            >
              Help
            </button>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                aria-label="User Profile"
                onClick={toggleDropdown}
                className="flex items-center space-x-2 py-2 px-4 border rounded-md text-indigo-900 hover:bg-indigo-100"
              >
                <FaUserAlt className="text-lg" />
                <span className="hidden md:inline">Account</span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white transition duration-300 rounded-md"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
      </nav>

      {/* Help Modal */}
      {isHelpOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="relative bg-white rounded-lg shadow-2xl w-[500px] max-w-[90%] p-6 space-y-5">
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
