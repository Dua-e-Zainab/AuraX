import React from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <header className="flex justify-between items-center px-8 py-4 bg-white shadow-md">
      {/* Logo Section */}
      <div className="flex items-center">
        <img
          src={`${process.env.PUBLIC_URL}/Logo - AuraX 22.png`}
          alt="Logo"
          className="w-full h-full mr-6"
        />
      </div>

      {/* Navigation Links */}
      <nav className="flex items-center space-x-8">
        <button
          onClick={() => navigate('/')}
          className="text-violet-700 hover:text-indigo-700 transition duration-300"
        >
          Home
        </button>

        {/* Products with Dropdown Icon */}
        <button
          className="flex items-center space-x-1 text-violet-700 hover:text-indigo-700 transition duration-300"
        >
          <span>Products</span>
          <FaChevronDown className="text-sm" />
        </button>

        <button
          className="text-violet-700 hover:text-indigo-700 transition duration-300"
        >
          Help
        </button>

        {/* Login and Signup Buttons */}
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
      </nav>
    </header>
  );
};

export default Navbar;
