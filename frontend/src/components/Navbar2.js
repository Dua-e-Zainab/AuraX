import React, { useState, useRef, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBriefcase,
  faHome,
  faFire,
  faPalette,
  faChartBar,
  faBars,
  faTimes,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

const Navbar2 = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: 'User', email: 'user@example.com' });
  const navigate = useNavigate();
  const location = useLocation();

  // Check authentication status on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      fetchUserInfo();
    }
  }, []);

  // Fetch user info function from Navbar1
  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Try to get user info from localStorage first
      const userEmail = localStorage.getItem('userEmail');
      const userName = localStorage.getItem('userName');
      
      // If we have stored data, use it immediately
      if (userEmail && userName) {
        setUserInfo({
          name: userName,
          email: userEmail
        });
      }

      // Then try to get fresh data from API
      const response = await fetch('https://aura-x.up.railway.app/api/auth/user/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        console.log('User data received:', userData);
        
        // Update with fresh data from API
        setUserInfo({
          name: userData.name,
          email: userData.email
        });
        
        // Update localStorage with fresh data
        localStorage.setItem('userEmail', userData.email);
        localStorage.setItem('userName', userData.name);
      } else if (response.status === 404) {
        console.log('Profile endpoint not found, using stored data');
        // Keep using localStorage data
      } else {
        console.error('Failed to fetch profile:', response.status);
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      
      // Fallback to localStorage
      const userEmail = localStorage.getItem('userEmail');
      const userName = localStorage.getItem('userName');
      
      if (userEmail || userName) {
        setUserInfo({
          name: userName || 'User',
          email: userEmail || 'user@example.com'
        });
      }
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    try {
      // Clear authentication data
      localStorage.removeItem("token");
      localStorage.removeItem("projectId");
      localStorage.removeItem("userId");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");
      
      // Clear any other session data
      sessionStorage.clear();
      
      // Update state
      setIsLoggedIn(false);
      setUserInfo({ name: '', email: '' });
      setDropdownOpen(false);
      setMobileMenuOpen(false);
      
      // Navigate to login/home page
      navigate("/", { replace: true });
      
      console.log("Logged out successfully");
      
    } catch (error) {
      console.error("Error during logout:", error);
    }
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

  // Get initials function from Navbar1
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get current project ID from localStorage or state
  const projectId = localStorage.getItem("projectId") || "demo-project";

  // Detect if overview route is active
  const isOverviewActive = location.pathname.startsWith("/overview");

  const navItems = [
    { to: `/overview/${projectId || ""}`, icon: faBriefcase, label: "Overview", isSpecial: true },
    { to: "/dashboard", icon: faHome, label: "Dashboard" },
    { to: "/heatmap", icon: faFire, label: "Heatmaps" },
    { to: "/css-customization", icon: faPalette, label: "CSS Customization" },
    { to: "/insights", icon: faChartBar, label: "Insights" },
  ];

  return (
    <>
      {/* Slim Enhanced Navbar */}
      <nav className="bg-white/90 backdrop-blur-lg shadow-lg border-b border-gray-100 py-3 px-6 fixed top-0 w-full z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo Section - Left */}
          <div className="flex items-center">
            <NavLink
              to="/"
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-300 group"
            >
              <img 
                src="/Logo.png" 
                alt="AuraX Logo" 
                className="h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </NavLink>
          </div>

          {/* Desktop Navigation - Center */}
          <div className="hidden lg:block">
            <ul className="flex items-center space-x-8 text-gray-500 text-sm font-medium">
              {navItems.map((item, index) => (
                <li key={index} className="relative group">
                  <NavLink
                    to={item.to}
                    className={({ isActive }) => {
                      const isActiveItem = item.isSpecial ? isOverviewActive : isActive;
                      return `flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                        isActiveItem
                          ? "text-white bg-gradient-to-r from-purple-600 to-blue-600 shadow-md shadow-purple-500/25"
                          : "text-gray-500 hover:text-purple-600 hover:bg-purple-50"
                      }`;
                    }}
                  >
                    <FontAwesomeIcon 
                      icon={item.icon} 
                      className="text-sm transition-all duration-300 group-hover:rotate-6 group-hover:scale-110" 
                    />
                    <span className="text-sm">{item.label}</span>
                  </NavLink>
                  
                  {/* Hover effect line */}
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full transition-all duration-300 group-hover:w-full"></div>
                </li>
              ))}
            </ul>
          </div>

          {/* Profile Dropdown & Mobile Menu - Right */}
          <div className="flex items-center space-x-4">
            {/* Show profile dropdown only if logged in */}
            {isLoggedIn && (
              <div className="hidden lg:block relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-500 hover:text-purple-600 hover:bg-purple-50 transition-all duration-300 transform hover:scale-105 group font-medium"
                >
                  {/* User Avatar with initials */}
                  <div className="relative">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-semibold">
                      {getInitials(userInfo.name)}
                    </div>
                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full border border-white shadow-sm"></div>
                  </div>
                  <span className="text-sm">Account</span>
                  <div className={`w-1 h-1 border-r border-b border-gray-400 transform transition-all duration-300 ${dropdownOpen ? 'rotate-45 scale-110' : '-rotate-45'}`}></div>
                </button>

                {/* Enhanced Dropdown Menu with User Info */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl shadow-xl rounded-2xl border border-gray-100 overflow-hidden transform transition-all duration-200 animate-in slide-in-from-top-2">
                    {/* User Info Section */}
                    <div className="px-4 py-4 border-b border-gray-200/50 bg-gradient-to-r from-purple-50/50 to-blue-50/50">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                          {getInitials(userInfo.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {userInfo.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {userInfo.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-2">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-500 hover:text-white transition-all duration-300 rounded-xl font-medium flex items-center space-x-3 group transform hover:scale-105"
                      >
                        <div className="w-8 h-8 bg-red-100 group-hover:bg-white/20 rounded-lg flex items-center justify-center transition-all duration-300 shadow-sm">
                          <FontAwesomeIcon 
                            icon={faSignOutAlt} 
                            className="text-red-500 group-hover:text-white transition-colors duration-300 text-xs" 
                          />
                        </div>
                        <span className="text-sm">Sign Out</span>
                      </button>
                      <button
                        onClick={() => {
                          navigate("/");
                          setDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500 hover:text-white transition-all duration-300 rounded-xl font-medium flex items-center space-x-3 group mt-1 transform hover:scale-105"
                      >
                        <div className="w-8 h-8 bg-purple-100 group-hover:bg-white/20 rounded-lg flex items-center justify-center transition-all duration-300 shadow-sm">
                          <FontAwesomeIcon 
                            icon={faHome} 
                            className="text-purple-500 group-hover:text-white transition-colors duration-300 text-xs" 
                          />
                        </div>
                        <span className="text-sm">Home</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-xl text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-all duration-300 transform hover:scale-110"
            >
              <FontAwesomeIcon 
                icon={mobileMenuOpen ? faTimes : faBars} 
                className="text-lg transition-transform duration-300" 
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="fixed top-0 right-0 w-80 max-w-[85vw] h-full bg-white/95 backdrop-blur-xl shadow-2xl transform transition-transform duration-300 ease-out">
            <div className="p-6 pt-16">
              {/* Mobile Close Button */}
              <button
                onClick={toggleMobileMenu}
                className="absolute top-4 right-4 p-2 rounded-xl text-gray-600 hover:text-red-500 hover:bg-red-50 transition-all duration-300"
              >
                <FontAwesomeIcon icon={faTimes} className="text-lg" />
              </button>

              {/* Mobile Navigation Items */}
              <ul className="space-y-3">
                {navItems.map((item, index) => (
                  <li key={index}>
                    <NavLink
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) => {
                        const isActiveItem = item.isSpecial ? isOverviewActive : isActive;
                        return `flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                          isActiveItem
                            ? "text-white bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg"
                            : "text-gray-700 hover:text-purple-600 hover:bg-purple-50"
                        }`;
                      }}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 shadow-sm ${
                        (item.isSpecial && isOverviewActive) || (!item.isSpecial && location.pathname === item.to)
                          ? "bg-white/20" 
                          : "bg-purple-100"
                      }`}>
                        <FontAwesomeIcon 
                          icon={item.icon} 
                          className={`text-sm transition-colors duration-300 ${
                            (item.isSpecial && isOverviewActive) || (!item.isSpecial && location.pathname === item.to)
                              ? "text-white" 
                              : "text-purple-600"
                          }`}
                        />
                      </div>
                      <span className="text-base">{item.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>

              {/* Mobile Account Section - Only show if logged in */}
              {isLoggedIn && (
                <div className="mt-8 pt-6 border-t border-gray-200/50">
                  {/* Mobile User Info */}
                  <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                        {getInitials(userInfo.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {userInfo.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {userInfo.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-500 hover:text-white transition-all duration-300 rounded-xl font-medium group transform hover:scale-105"
                    >
                      <div className="w-10 h-10 bg-red-100 group-hover:bg-white/20 rounded-lg flex items-center justify-center transition-all duration-300 shadow-sm">
                        <FontAwesomeIcon 
                          icon={faSignOutAlt} 
                          className="text-red-500 group-hover:text-white transition-colors duration-300 text-sm" 
                        />
                      </div>
                      <span className="text-base">Sign Out</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate("/");
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500 hover:text-white transition-all duration-300 rounded-xl font-medium group transform hover:scale-105"
                    >
                      <div className="w-10 h-10 bg-purple-100 group-hover:bg-white/20 rounded-lg flex items-center justify-center transition-all duration-300 shadow-sm">
                        <FontAwesomeIcon 
                          icon={faHome} 
                          className="text-purple-500 group-hover:text-white transition-colors duration-300 text-sm" 
                        />
                      </div>
                      <span className="text-base">Home</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Spacer for fixed navbar - reduced height */}
      <div className="h-16"></div>
    </>
  );
};

export default Navbar2;