import { Link, useLocation } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, X, HelpCircle, Folder, LogOut, Menu } from 'lucide-react';

const Navbar = ({ isHelpModalOpen, setIsHelpModalOpen }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: 'User', email: 'user@example.com' });
  // const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Function to toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Check login status on component load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      // You can fetch user info here if needed
      fetchUserInfo();
    }
  }, []);

  // Update your signup form to include name field
  // In your signup component, make sure you have a name input field and update the submission:

  const handleSignup = async (formData) => {
      try {
          const response = await fetch('https://aura-x.up.railway.app/api/auth/signup', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  name: formData.name, // Add this line
                  email: formData.email,
                  password: formData.password
              }),
          });

          const data = await response.json();

          if (response.ok) {
              // Store user data in localStorage
              localStorage.setItem('token', data.token);
              localStorage.setItem('userEmail', data.user.email);
              localStorage.setItem('userName', data.user.name);
              
              // Update navbar state
              setIsLoggedIn(true);
              setUserInfo({
                  name: data.user.name,
                  email: data.user.email
              });
              
              // Redirect or show success message
              navigate('/dashboard'); // or wherever you want to redirect
          } else {
              // Handle error
              console.error('Signup failed:', data.message);
          }
      } catch (error) {
          console.error('Signup error:', error);
      }
  };

  // Update your login handler
  const handleLogin = async (formData) => {
      try {
          const response = await fetch('https://aura-x.up.railway.app/api/auth/login', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  email: formData.email,
                  password: formData.password,
                  rememberMe: formData.rememberMe
              }),
          });

          const data = await response.json();

          if (response.ok) {
              // Store user data in localStorage
              localStorage.setItem('token', data.token);
              localStorage.setItem('userEmail', data.user.email);
              localStorage.setItem('userName', data.user.name);
              
              // Update navbar state
              setIsLoggedIn(true);
              setUserInfo({
                  name: data.user.name,
                  email: data.user.email
              });
              
              // Redirect
              navigate('/dashboard');
          } else {
              console.error('Login failed:', data.message);
          }
      } catch (error) {
          console.error('Login error:', error);
      }
  };

  // Update your navbar's fetchUserInfo function to use the new endpoint
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


  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserInfo({ name: '', email: '' });
    navigate('/');
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Helper function to check if a path is active
  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Enhanced Navbar */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500  ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-lg shadow-gray-500/10' 
          : 'bg-white/90 backdrop-blur-md border-b border-gray-200/30'
      }`}>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            
            {/* Left Side - Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center transform hover:scale-105 transition-transform duration-300 -ml-28">
                <img src="Logo.png" alt="AuraX Logo" className="h-14 w-auto" />
              </Link>
            </div>

            {/* Right Side - Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8 -mr-24">
              
              {/* My Projects Link */}
              <NavButton 
                onClick={() => navigate('/myprojects')} 
                icon={Folder}
                isActive={isActivePath('/myprojects')}
              >
                My Projects
              </NavButton>

              {/* Help Button */}
              <NavButton 
                onClick={() => setIsHelpModalOpen(true)} 
                icon={HelpCircle}
                isActive={isHelpModalOpen} // Optional: highlights when modal is open
              >
                Help
              </NavButton>

              {/* User Profile Section */}
              {isLoggedIn ? (
                <div className="relative ml-4" ref={dropdownRef}>
                  <button
                    onClick={toggleDropdown}
                    className="group relative flex items-center space-x-3 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    {/* User Avatar */}
                    <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-semibold">
                      {getInitials(userInfo.name)}
                    </div>
                    <span className="font-medium">Account</span>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
                    
                    {/* Online indicator */}
                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                  </button>
                  
                  {/* Enhanced Dropdown Menu */}
                  <div className={`absolute right-0 mt-3 w-72 bg-white/95 backdrop-blur-xl border border-gray-200/30 shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 transform origin-top ${
                    dropdownOpen 
                      ? 'opacity-100 scale-100 translate-y-0' 
                      : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                  }`}>
                    
                    {/* User Info Section */}
                    <div className="px-4 py-4 border-b border-gray-200/50 bg-gradient-to-r from-purple-50/50 to-blue-50/50">
                      <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold">
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
                    
                    {/* Menu Items */}
                    <div className="py-2">
                      <DropdownItem 
                        icon={<LogOut className="h-5 w-5 text-red-500" />}
                        onClick={handleLogout}
                        variant="danger"
                      >
                        Sign Out
                      </DropdownItem>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3 ml-4">
                  <button
                    onClick={() => navigate('/login')}
                    className={`px-6 py-2.5 border-2 rounded-full transition-all duration-300 font-medium transform hover:scale-105 ${
                      isActivePath('/login')
                        ? 'text-white bg-purple-500 border-purple-500'
                        : 'text-purple-600 border-purple-300 hover:bg-purple-50 hover:border-purple-400'
                    }`}
                  >
                    LOGIN
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className={`relative px-6 py-2.5 text-white rounded-full font-medium transform hover:scale-105 transition-all duration-300 overflow-hidden group ${
                      isActivePath('/register') ? 'ring-2 ring-purple-300 ring-offset-2' : ''
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 transition-all duration-300 group-hover:from-purple-600 group-hover:via-blue-600 group-hover:to-indigo-600"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                    <span className="relative z-10">SIGNUP</span>
                  </button>
                </div>
              )}
            </nav>

            {/* Right Side - Mobile Menu Button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={toggleMobileMenu}
                className="relative p-3 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-300"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-500 ease-in-out ${
          isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="px-4 py-6 space-y-2 bg-white/95 backdrop-blur-xl border-t border-gray-200/30">
            
            {/* Mobile Navigation Items */}
            <MobileNavItem 
              onClick={() => navigate('/myprojects')} 
              icon={Folder}
              isActive={isActivePath('/myprojects')}
            >
              My Projects
            </MobileNavItem>

            <MobileNavItem 
              onClick={() => navigate('/help')} 
              icon={HelpCircle}
              isActive={isActivePath('/help')}
            >
              Help
            </MobileNavItem>

            {/* Mobile Auth Section */}
            {isLoggedIn ? (
              <div className="space-y-2 pt-4 border-t border-gray-200/50">
                {/* Mobile User Info */}
                <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl">
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
                
                <MobileNavItem onClick={handleLogout} icon={LogOut} variant="danger">
                  Sign Out
                </MobileNavItem>
              </div>
            ) : (
              <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200/50">
                <button
                  onClick={() => navigate('/login')}
                  className={`px-4 py-3 border-2 rounded-xl transition-all duration-300 font-medium ${
                    isActivePath('/login')
                      ? 'text-white bg-purple-500 border-purple-500'
                      : 'text-purple-600 border-purple-300 hover:bg-purple-50'
                  }`}
                >
                  LOGIN
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className={`px-4 py-3 text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 font-medium shadow-lg ${
                    isActivePath('/register') ? 'ring-2 ring-purple-300 ring-offset-2' : ''
                  }`}
                >
                  SIGNUP
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className="h-16 lg:h-20"></div>
    </>
  );
};

// Navigation Button Component
const NavButton = ({ children, onClick, icon: Icon, isActive = false }) => (
  <button
    onClick={onClick}
    className={`group relative flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 font-medium ${
      isActive 
        ? 'text-purple-600 bg-gradient-to-r from-purple-100/80 to-blue-100/80' 
        : 'text-gray-700 hover:text-purple-600'
    }`}
  >
    {Icon && <Icon className="h-4 w-4" />}
    <span>{children}</span>
    {!isActive && (
      <div className="absolute inset-0 bg-gradient-to-r from-purple-100/0 to-blue-100/0 group-hover:from-purple-100/50 group-hover:to-blue-100/50 rounded-xl transition-all duration-300 -z-10"></div>
    )}
    <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300 ${
      isActive ? 'w-8' : 'w-0 group-hover:w-8'
    }`}></div>
  </button>
);

// Dropdown Item Component
const DropdownItem = ({ children, icon, onClick, variant = 'default' }) => {
  const baseClasses = "flex items-center space-x-3 px-4 py-3 transition-all duration-300 cursor-pointer group";
  const variantClasses = variant === 'danger' 
    ? "text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600"
    : "text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:text-purple-600";

  return (
    <div className={`${baseClasses} ${variantClasses}`} onClick={onClick}>
      <div className="flex-shrink-0 p-1 bg-gray-100 rounded-lg group-hover:bg-white transition-colors duration-300">
        {icon}
      </div>
      <span className="font-medium">{children}</span>
    </div>
  );
};

// Mobile Navigation Components
const MobileNavItem = ({ children, onClick, icon: Icon, variant = 'default', isActive = false }) => {
  const baseClasses = "flex items-center space-x-3 w-full px-4 py-3 rounded-xl font-medium transition-all duration-300";
  const variantClasses = variant === 'danger'
    ? "text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600"
    : isActive
    ? "text-purple-600 bg-gradient-to-r from-purple-100/80 to-blue-100/80"
    : "text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:text-purple-600";

  return (
    <button className={`${baseClasses} ${variantClasses}`} onClick={onClick}>
      {Icon && <Icon className="h-5 w-5" />}
      <span>{children}</span>
    </button>
  );
};

export default Navbar;