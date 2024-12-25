import { FaUserAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';


const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Function to toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

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

  return (
    <nav className="navbar1">
      <header className="flex justify-between items-center w-full px-12 py-5 text-indigo-900 bg-white border-b"> {/* Increased padding */}
        {/* Make Logo Clickable */}
        <Link to="/" className="flex items-center">
          <img src="Logo2.png" alt="AuraX Logo" className="h-18" />
        </Link>

        <div className="flex items-center space-x-10 ml-8"> {/* Increased space for better alignment */}
          <Link to="/myprojects" className="hover:underline">
            My Projects
          </Link>
          <Link to="/help" className="hover:underline">
            Help
          </Link>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              aria-label="User Profile"
              onClick={toggleDropdown}
              className="flex items-center space-x-2 py-2 px-4 border rounded-md text-indigo-900 hover:bg-indigo-100"
            >
              {/* Display User Profile Icon */}
              <FaUserAlt className="text-lg" />
              <span className="hidden md:inline">Account</span>
            </button>
            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border">
                <button onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white transition duration-300 rounded-md">
                   
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </nav>
  );
};

export default Navbar;
