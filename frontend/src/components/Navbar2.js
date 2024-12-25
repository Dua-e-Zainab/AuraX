import React, { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBriefcase,
  faHome,
  faFire,
  faPalette,
  faChartBar,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';

const Navbar2 = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
  };


  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white shadow-sm py-8 flex items-center h-100 w-full">
      <ul className="flex justify-center space-x-20 text-gray-400 text-lg font-medium w-full mx-auto">
        {/* Overview */}
        <li>
          <NavLink
            to="/overview/:id"
            className={({ isActive }) =>
              isActive
                ? "text-purple-600 flex items-center"
                : "hover:text-purple-600 flex items-center"
            }
          >
            <FontAwesomeIcon icon={faBriefcase} className="text-2xl mr-2" />
            Overview
          </NavLink>
        </li>

        {/* Dashboard */}
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive
                ? "text-purple-600 flex items-center"
                : "hover:text-purple-600 flex items-center"
            }
          >
            <FontAwesomeIcon icon={faHome} className="text-2xl mr-2" />
            Dashboard
          </NavLink>
        </li>

        {/* Heatmaps */}
        <li>
          <NavLink
            to="/heatmap"
            className={({ isActive }) =>
              isActive
                ? "text-purple-600 flex items-center"
                : "hover:text-purple-600 flex items-center"
            }
          >
            <FontAwesomeIcon icon={faFire} className="text-2xl mr-2" />
            Heatmaps
          </NavLink>
        </li>

        {/* CSS Customization */}
        <li>
          <NavLink
            to="/css-customization"
            className={({ isActive }) =>
              isActive
                ? "text-purple-600 flex items-center"
                : "hover:text-purple-600 flex items-center"
            }
          >
            <FontAwesomeIcon icon={faPalette} className="text-2xl mr-2" />
            CSS Customization
          </NavLink>
        </li>

        {/* Insights */}
        <li>
          <NavLink
            to="/insights"
            className={({ isActive }) =>
              isActive
                ? "text-purple-600 flex items-center"
                : "hover:text-purple-600 flex items-center"
            }
          >
            <FontAwesomeIcon icon={faChartBar} className="text-2xl mr-2" />
            Insights
          </NavLink>
        </li>

        {/* Profile */}
        <li className="relative" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="flex items-center space-x-2 text-gray-400 hover:text-purple-600 transition duration-300"
          >
            <FontAwesomeIcon icon={faUser} className="text-2xl mr-2" />
            Account
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white transition duration-300 rounded-md"
              >
                Sign Out
              </button>
              <button
                onClick={() => navigate('/')}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white transition duration-300 rounded-md"
              >
                AuraX
              </button>
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar2;
