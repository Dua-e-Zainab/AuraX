import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, User, Menu, X, HelpCircle, Flame, Palette, BarChart3, Home, Folder, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: '', email: '' });

  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const productDropdownRef = useRef(null);

  // Function to check if current path matches
  const isCurrentPath = (path) => {
    return location.pathname === path;
  };

  // Function to check if any product page is active
  const isProductActive = () => {
    const productPaths = ['/heatmap-page', '/css-customization-page', '/insights-page'];
    return productPaths.includes(location.pathname);
  };

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserInfo({ name: '', email: '' });
    navigate('/');
  };

  const toggleUserDropdown = () => setIsDropdownOpen((prev) => !prev);
  const toggleProductDropdown = () => setIsProductDropdownOpen((prev) => !prev);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

return (
    <>
      {/* White Navbar */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-lg shadow-gray-500/10' 
          : 'bg-white/90 backdrop-blur-md border-b border-gray-200/30'
      }`}>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20 -ml-10">
            <Link to="/" className="flex items-center">
              <img src="Logo2.png" alt="AuraX Logo" className="h-14 w-auto mt-3" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1 -mr-10">
              <NavButton 
                onClick={() => navigate('/')} 
                icon={Home}
                isActive={isCurrentPath('/')}
              >
                Home
              </NavButton>

              {/* Products Dropdown */}
              <div className="relative" ref={productDropdownRef}>
                <NavButton 
                  onClick={toggleProductDropdown}
                  hasDropdown
                  isOpen={isProductDropdownOpen}
                  isActive={isProductActive()}
                >
                  Products
                </NavButton>
                
                <DropdownMenu isOpen={isProductDropdownOpen}>
                  <DropdownItem 
                    icon={<Flame className="h-5 w-5 text-orange-500" />}
                    onClick={() => navigate('/heatmap-page')}
                    isActive={isCurrentPath('/heatmap-page')}
                  >
                    Heatmaps
                    <span className="text-xs text-gray-500"></span>
                  </DropdownItem>
                  <DropdownItem 
                    icon={<Palette className="h-5 w-5 text-purple-500" />}
                    onClick={() => navigate('/css-customization-page')}
                    isActive={isCurrentPath('/css-customization-page')}
                  >
                    CSS Customization
                    <span className="text-xs text-gray-500"></span>
                  </DropdownItem>
                  <DropdownItem 
                    icon={<BarChart3 className="h-5 w-5 text-blue-500" />}
                    onClick={() => navigate('/insights-page')}
                    isActive={isCurrentPath('/insights-page')}
                  >
                    Insights
                    <span className="text-xs text-gray-500"></span>
                  </DropdownItem>
                </DropdownMenu>
              </div>

              <NavButton onClick={() => setIsHelpOpen(true)} icon={HelpCircle}>
                Help
              </NavButton>

              {/* Auth Section */}
              {isLoggedIn ? (
                <div className="relative ml-4" ref={dropdownRef}>
                  <button
                    onClick={toggleUserDropdown}
                    className="relative p-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl"
                  >
                    <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-semibold">
                      {getInitials(userInfo.name)}
                    </div>
                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                  </button>
                  
                  <DropdownMenu isOpen={isDropdownOpen} align="right">
                    {/* User Info Section */}
                    <div className="px-4 py-3 border-b border-gray-200/50">
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
                    
                    <DropdownItem 
                      icon={<Folder className="h-5 w-5 text-blue-500" />}
                      onClick={() => navigate('/myprojects')}
                      isActive={isCurrentPath('/myprojects')}
                    >
                      My Projects
                    </DropdownItem>
                    <DropdownItem 
                      icon={<LogOut className="h-5 w-5 text-red-500" />}
                      onClick={handleLogout}
                      variant="danger"
                    >
                      Sign Out
                    </DropdownItem>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="flex items-center space-x-3 ml-4">
                  <button
                    onClick={() => navigate('/login')}
                    className="px-6 py-2.5 text-purple-600 border-2 border-purple-300 rounded-full hover:bg-purple-50 hover:border-purple-400 transition-all duration-300 font-medium transform hover:scale-105"
                  >
                    LOGIN
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="relative px-6 py-2.5 text-white rounded-full font-medium transform hover:scale-105 transition-all duration-300 overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 transition-all duration-300 group-hover:from-purple-600 group-hover:via-blue-600 group-hover:to-indigo-600"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                    <span className="relative z-10">SIGNUP</span>
                  </button>
                </div>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden relative p-3 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-300"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-500 ease-in-out ${
          isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="px-4 py-6 space-y-2 bg-white/95 backdrop-blur-xl border-t border-gray-200/30">
            <MobileNavItem 
              onClick={() => navigate('/')} 
              icon={Home}
              isActive={isCurrentPath('/')}
            >
              Home
            </MobileNavItem>

            {/* Mobile Products Section */}
            <div>
              <MobileNavItem 
                onClick={toggleProductDropdown}
                hasDropdown
                isOpen={isProductDropdownOpen}
                isActive={isProductActive()}
              >
                Products
              </MobileNavItem>
              <div className={`ml-6 space-y-1 transition-all duration-300 ${
                isProductDropdownOpen ? 'max-h-48 opacity-100 mt-2' : 'max-h-0 opacity-0 overflow-hidden'
              }`}>
                <MobileSubItem 
                  href="/heatmap-page" 
                  icon="🔥"
                  isActive={isCurrentPath('/heatmap-page')}
                >
                  Heatmaps
                </MobileSubItem>
                <MobileSubItem 
                  href="/css-customization-page" 
                  icon="🎨"
                  isActive={isCurrentPath('/css-customization-page')}
                >
                  CSS Customization
                </MobileSubItem>
                <MobileSubItem 
                  href="/insights-page" 
                  icon="📊"
                  isActive={isCurrentPath('/insights-page')}
                >
                  Insights
                </MobileSubItem>
              </div>
            </div>

            <MobileNavItem onClick={() => setIsHelpOpen(true)} icon={HelpCircle}>
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
                
                <MobileNavItem 
                  onClick={() => navigate('/myprojects')} 
                  icon={Folder}
                  isActive={isCurrentPath('/myprojects')}
                >
                  My Projects
                </MobileNavItem>
                <MobileNavItem onClick={handleLogout} icon={LogOut} variant="danger">
                  Sign Out
                </MobileNavItem>
              </div>
            ) : (
              <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200/50">
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-3 text-purple-600 border-2 border-purple-300 rounded-xl hover:bg-purple-50 transition-all duration-300 font-medium"
                >
                  LOGIN
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-4 py-3 text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 font-medium shadow-lg"
                >
                  SIGNUP
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Help Modal */}
      {isHelpOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
          <div className={`relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-lg p-8 space-y-8 transform transition-all duration-500 ${
            isHelpOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
          }`}>
            
            {/* Close Button */}
            <button
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-red-500 transition-all duration-300 rounded-full hover:bg-red-50 hover:scale-110"
              onClick={() => setIsHelpOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>

            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl">
                  <HelpCircle className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Help Center</h2>
                  <p className="text-gray-600 text-sm">Find answers to common questions</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { 
                    q: "What is a heatmap, and how can it help my website?", 
                    icon: <Flame className="h-6 w-6 text-orange-500" />,
                    gradient: "from-orange-50 to-red-50"
                  },
                  { 
                    q: "How do I interpret the heatmap data?", 
                    icon: <BarChart3 className="h-6 w-6 text-blue-500" />,
                    gradient: "from-blue-50 to-indigo-50"
                  },
                  { 
                    q: "What CSS changes should I consider based on my heatmap results?", 
                    icon: <Palette className="h-6 w-6 text-purple-500" />,
                    gradient: "from-purple-50 to-pink-50"
                  },
                ].map((item, index) => (
                  <div key={index} className={`group flex items-start space-x-4 p-5 rounded-2xl bg-gradient-to-r ${item.gradient} hover:shadow-lg transition-all duration-300 cursor-pointer border border-white/50`}>
                    <div className="flex-shrink-0 p-2 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </div>
                    <p className="text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors duration-300 font-medium">
                      {item.q}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-gray-200/50">
                <p className="text-center text-gray-500 text-sm">
                  Need more help? 
                  <button className="ml-2 text-purple-600 hover:text-purple-700 font-medium transition-colors duration-300 hover:underline">
                    Contact Support →
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Navigation Button Component
const NavButton = ({ children, onClick, icon: Icon, hasDropdown, isOpen, isActive }) => (
  <button
    onClick={onClick}
    className={`group relative flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
      isActive 
        ? 'text-purple-600 bg-gradient-to-r from-purple-100/50 to-blue-100/50' 
        : 'text-gray-700 hover:text-purple-600'
    }`}
  >
    {Icon && <Icon className="h-4 w-4" />}
    <span>{children}</span>
    {hasDropdown && (
      <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
    )}
    <div className={`absolute inset-0 bg-gradient-to-r from-purple-100/0 to-blue-100/0 rounded-xl transition-all duration-300 -z-10 ${
      isActive 
        ? 'from-purple-100/50 to-blue-100/50' 
        : 'group-hover:from-purple-100/50 group-hover:to-blue-100/50'
    }`}></div>
    <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300 ${
      isActive 
        ? 'w-8' 
        : 'w-0 group-hover:w-8'
    }`}></div>
  </button>
);

// Dropdown Menu Component
const DropdownMenu = ({ children, isOpen, align = 'left' }) => (
  <div className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} mt-3 w-64 bg-white/95 backdrop-blur-xl border border-gray-200/30 shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 transform origin-top ${
    isOpen 
      ? 'opacity-100 scale-100 translate-y-0' 
      : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
  }`}>
    <div className="py-3">
      {children}
    </div>
  </div>
);

// Dropdown Item Component
const DropdownItem = ({ children, icon, onClick, variant = 'default', isActive }) => {
  const baseClasses = "flex items-start space-x-3 px-4 py-3 transition-all duration-300 cursor-pointer group";
  const variantClasses = variant === 'danger' 
    ? "text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600"
    : isActive
      ? "text-purple-600 bg-gradient-to-r from-purple-50 to-blue-50"
      : "text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:text-purple-600";

  return (
    <div className={`${baseClasses} ${variantClasses}`} onClick={onClick}>
      <div className={`flex-shrink-0 p-1 rounded-lg transition-colors duration-300 ${
        isActive 
          ? 'bg-white' 
          : 'bg-gray-100 group-hover:bg-white'
      }`}>
        {icon}
      </div>
      <div className="flex-1">
        {typeof children === 'string' ? (
          <span className="font-medium">{children}</span>
        ) : (
          <div className="space-y-1">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

// Mobile Navigation Components
const MobileNavItem = ({ children, onClick, icon: Icon, hasDropdown, isOpen, variant = 'default', isActive }) => {
  const baseClasses = "flex items-center justify-between w-full px-4 py-3 rounded-xl font-medium transition-all duration-300";
  const variantClasses = variant === 'danger'
    ? "text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600"
    : isActive
      ? "text-purple-600 bg-gradient-to-r from-purple-50 to-blue-50"
      : "text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:text-purple-600";

  return (
    <button className={`${baseClasses} ${variantClasses}`} onClick={onClick}>
      <div className="flex items-center space-x-3">
        {Icon && <Icon className="h-5 w-5" />}
        <span>{children}</span>
      </div>
      {hasDropdown && (
        <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      )}
    </button>
  );
};

const MobileSubItem = ({ children, href, icon, isActive }) => (
  <a
    href={href}
    className={`flex items-center space-x-3 px-4 py-2 font-medium transition-all duration-300 rounded-lg ${
      isActive 
        ? 'text-purple-600 bg-purple-50/50' 
        : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50/50'
    }`}
  >
    <span className="text-lg">{icon}</span>
    <span>{children}</span>
  </a>
);

export default Navbar;