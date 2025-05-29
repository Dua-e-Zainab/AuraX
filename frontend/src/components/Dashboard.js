import React, { useState, useEffect } from "react";
import Navbar2 from "./Navbar2.js";
import { useNavigate } from "react-router-dom";
import { Lightbulb, TrendingUp, Clock, Eye, FileText, ChevronDown } from "lucide-react";

const Dashboard = (props) => {
  const [metricsState, setMetrics] = useState([]); 
  const [insights, setInsights] = useState([]);
  const [distributions, setDistributions] = useState({});
  const [pageData, setPageData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [projectId, setProjectId] = useState(null);
  const [selectedTab, setSelectedTab] = useState("Browsers");
  const [activeTab, setActiveTab] = useState("Browsers");
  const [setBrowsers] = useState([ 
    { name: "Chrome", value: 120, color: "#3b82f6" },
    { name: "Edge", value: 40, color: "#f43f5e" },
    { name: "Firefox", value: 20, color: "#f87171" },
  ]);

  // Mobile responsive states
  const [isMobile, setIsMobile] = useState(false);
  const [showInsights, setShowInsights] = useState(true);
  const [showDistributions, setShowDistributions] = useState(true);

  const navigate = useNavigate();

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Page name mapping
  const PAGE_NAME_MAPPING = {
    '/': 'Home',
    '/index.html': 'Home',
    '/index.htm': 'Home',
    '/home.html': 'Home',
    '/main.html': 'Home',
    '/default.html': 'Home',
    '/downloads': 'Downloads',
    '/downloads.html': 'Downloads',
    '/products': 'Products',
    '/products.html': 'Products',
    '/shop': 'Shop',
    '/shop.html': 'Shop',
    '/contact': 'Contact Us',
    '/contact.html': 'Contact Us',
    '/about': 'About',
    '/about.html': 'About',
    '/login': 'Login',
    '/login.html': 'Login',
    '/signin': 'Sign In',
    '/signin.html': 'Sign In',
    '/register': 'Register',
    '/register.html': 'Register',
    '/signup': 'Sign Up',
    '/signup.html': 'Sign Up',
    '/cart': 'Shopping Cart',
    '/cart.html': 'Shopping Cart',
    '/checkout': 'Checkout',
    '/checkout.html': 'Checkout',
    '/profile': 'Profile',
    '/profile.html': 'Profile',
    '/account': 'My Account',
    '/account.html': 'My Account',
    '/settings': 'Settings',
    '/settings.html': 'Settings',
    '/faq': 'FAQs',
    '/faq.html': 'FAQs',
    '/help': 'Help Center',
    '/help.html': 'Help Center',
    '/blog': 'Blog',
    '/blog.html': 'Blog',
  };

  // Function to get friendly page name
  const getPageName = (url) => {
    if (!url) return 'Unknown Page';
    
    // Remove query parameters and hash
    const cleanPath = url.split('?')[0].split('#')[0];
    
    // Check if we have a direct mapping
    if (PAGE_NAME_MAPPING[cleanPath]) {
      return PAGE_NAME_MAPPING[cleanPath];
    }
    
    // Handle cases like "/pages/about.html" → "About"
    const lastSegment = cleanPath.split('/').pop();
    if (lastSegment.endsWith('.html') || lastSegment.endsWith('.htm')) {
      const nameWithoutExt = lastSegment.replace(/\..+$/, '');
      return nameWithoutExt
        .replace(/[-_]/g, ' ')
        .replace(/^\w/, c => c.toUpperCase());
    }
    
    // Handle empty path (root)
    if (cleanPath === '/' || cleanPath === '') return 'Home';
    
    // For other paths, use the last segment
    const nameFromPath = lastSegment
      .replace(/[-_]/g, ' ')
      .replace(/^\w/, c => c.toUpperCase());
    
    return nameFromPath || 'Unknown Page';
  };

  // Consistent color mapping for all distribution types
  const categoryColors = {
    Chrome: "#3b82f6",
    Edge: "#f43f5e",
    Safari: "#34d399",
    "Chrome Mobile": "#ef4444",
    "Mobile Safari": "#9333ea",
    Firefox: "#f97316",
    Opera: "#14b8a6",
    Windows: "#3b82f6",
    macOS: "#f43f5e",
    iOS: "#34d399",
    Android: "#ef4444",
    Linux: "#9333ea",
    Desktop: "#3b82f6",
    Mobile: "#f43f5e",
    Tablet: "#34d399",
    USA: "#3b82f6",
    UK: "#f43f5e",
    Canada: "#34d399",
    Germany: "#ef4444",
    France: "#9333ea",
    Others: "#6b7280",
  };
  
  const getCategoryColor = (name, index) => {
    return categoryColors[name] || categoryColors.Others;
  };
  
  useEffect(() => {
    const storedTab = localStorage.getItem('selectedTab') || 'Browsers';
    setSelectedTab(storedTab);
    setActiveTab(storedTab);
  }, []);
  
  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    setActiveTab(tab);
    localStorage.setItem('selectedTab', tab);
  };
  
  useEffect(() => {
    const storedProjectId = localStorage.getItem("projectId");
    if (props.projectId) {
      localStorage.setItem("projectId", props.projectId);
      setProjectId(props.projectId);  
    } else if (storedProjectId) {
      setProjectId(storedProjectId); 
    } else {
      navigate("/projects"); 
    }
  }, [props.projectId, navigate]);

  useEffect(() => {
    if (!projectId) return;
    
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setDataLoading(true);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found. Please log in.");
          setIsLoading(false);
          setDataLoading(false);
          return;
        }

        const response = await fetch(
          `https://aura-x.up.railway.app/api/track/dashboard/${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error fetching dashboard data: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('API Response:', data);

        setMetrics(data.metrics || []); 
        setInsights(data.insights || []);
        setDistributions(data.distributions || {});
        setPageData(data.pageData || []);

        const enrichedBrowserData = (data.distributions?.browsers || [])
          .map((b, index) => ({
            name: b.browser || "Others",
            value: b.count,
            color: getCategoryColor(b.browser, index)
          }));

        setBrowsers(enrichedBrowserData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error.message);
      } finally {
        setIsLoading(false);
        setDataLoading(false);
      }
    };

    fetchDashboardData();
  }, [projectId]);

  // Loading state with the same animation as OverviewPage
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-200 rounded-full animate-spin border-t-purple-600 mx-auto"></div>
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full border-t-blue-600 absolute top-2 left-2 animate-pulse"></div>
          </div>
          <p className="mt-6 text-lg font-medium text-gray-700 animate-pulse">Loading your project...</p>
          <div className="flex justify-center space-x-2 mt-4">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!projectId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-200">
        <Navbar2 />
        <div className="flex justify-center items-center min-h-[calc(100vh-80px)] px-4">
          <div className="text-center bg-white p-8 rounded-lg shadow-lg">
            <div className="text-red-500 text-xl font-semibold mb-2">No Project Selected</div>
            <p className="text-gray-600">Please select a project from the My Projects page.</p>
          </div>
        </div>
      </div>
    );
  }

  const totalSessions = metricsState.find(metric => metric.title === "Sessions")?.value || 0;
  const totalClicks = metricsState.find(metric => metric.title === "Total Clicks")?.value || 0;
  const clicksPerSession = totalSessions > 0 ? (totalClicks / totalSessions) : 0;
  
  return (
    <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 min-h-screen text-gray-800 overflow-x-hidden">
      {/* Header Navigation */}
      <header className="animate-fade-in">
        <Navbar2 />
      </header>

      {/* Main Content */}
      <main className="py-8 px-4 sm:px-6 md:px-12 lg:px-20 animate-slide-up">
        {/* Hero Section */}
        <section className="text-center sm:text-left mb-8 md:mb-12 transform transition-all duration-700 animate-fade-in-up">
          <div className="max-w-4xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-transparent bg-clip-text leading-tight mb-4">
              AuraX | Dashboard
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mt-4 max-w-3xl leading-relaxed">
              Real-time analytics and insights to help you understand user behavior and optimize your website.
            </p>
          </div>
        </section>

        {/* Enhanced Metrics Grid with Mobile Responsiveness */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8 animate-slide-in-left">
          {metricsState.map((metric, index) => (
            <div 
              key={index} 
              className="bg-white/80 backdrop-blur-sm p-4 md:p-6 rounded-lg shadow-md text-center transform hover:scale-105 transition-all duration-200 hover:shadow-lg"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <h3 className="text-sm md:text-lg font-semibold mb-2 text-gray-700">{metric.title}</h3>
              <p className="text-xl md:text-3xl font-bold text-purple-600 mb-1">{metric.value}</p>
              <span className="text-gray-400 text-xs md:text-sm">{metric.note}</span>
            </div>
          ))}
        </div>

        {/* Enhanced Insights Section with Mobile Collapsible */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-xl mb-6 md:mb-12 overflow-hidden animate-slide-in-right">
          {/* Mobile Toggle Header */}
          {isMobile && (
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
              <button
                onClick={() => setShowInsights(!showInsights)}
                className="w-full flex items-center justify-between text-lg font-semibold text-purple-600"
              >
                <span>Insights</span>
                <ChevronDown
                  className={`w-5 h-5 transform transition-transform duration-200 ${
                    showInsights ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </div>
          )}
          
          {/* Desktop Header */}
          {!isMobile && (
            <div className="p-6 md:p-8 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
              <h2 className="text-2xl font-semibold text-purple-600">Insights</h2>
            </div>
          )}

          {/* Insights Content */}
          <div className={`transition-all duration-300 ease-in-out ${
            isMobile && !showInsights ? 'max-h-0 opacity-0' : 'max-h-full opacity-100'
          } ${isMobile && !showInsights ? 'overflow-hidden' : ''}`}>
            <div className="p-4 md:p-8 space-y-4 md:space-y-6">
              {insights.map((insight, index) => (
                <div 
                  key={index} 
                  className="flex items-center bg-gradient-to-r from-gray-50 to-gray-100 p-4 md:p-5 rounded-lg shadow-sm transform hover:scale-102 transition-all duration-200 hover:shadow-md animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="p-2 md:p-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full shadow-lg">
                    {index === 0 && <Lightbulb size={isMobile ? 18 : 24} />}
                    {index === 1 && <TrendingUp size={isMobile ? 18 : 24} />}
                    {index === 2 && <Clock size={isMobile ? 18 : 24} />}
                    {index === 3 && <Eye size={isMobile ? 18 : 24} />}
                  </div>
                  <div className="ml-3 md:ml-4">
                    <span className="text-gray-600 text-xs md:text-sm font-medium block">{insight.label}</span>
                    <span className="text-purple-600 text-xl md:text-3xl font-bold mt-1 block">{insight.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Enhanced Two-Column Layout with Mobile Responsiveness */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          {/* Smart Events Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden transform hover:shadow-2xl transition-all duration-200 animate-slide-in-left">
            <div className="p-4 md:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <h2 className="text-lg font-semibold flex items-center text-gray-800">
                <FileText size={20} className="mr-2 text-purple-600" />
                Smart Events
              </h2>
            </div>
            
            <div className="p-4 md:p-6 max-h-80 overflow-y-auto">
              {pageData.length > 0 ? (
                <div className="space-y-2">
                  {pageData.map((pageItem, index) => (
                    <div 
                      key={index} 
                      className="flex justify-between items-center text-gray-600 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200 border border-transparent hover:border-gray-200 animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <span 
                        className="font-medium text-sm truncate flex-1 mr-3" 
                        title={pageItem.page}
                      >
                        {getPageName(pageItem.page)}
                      </span>
                      <span className="font-bold text-purple-600 text-sm whitespace-nowrap">
                        {pageItem.sessionCount} sessions
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8 animate-fade-in">
                  <FileText size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="text-sm md:text-base">No page-wise data available yet</p>
                  <p className="text-xs text-gray-400 mt-1">Check back later for analytics</p>
                </div>
              )}
            </div>
          </div>

          {/* Project Overview Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden transform hover:shadow-2xl transition-all duration-200 animate-slide-in-right">
            <div className="p-4 md:p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
              <h2 className="text-lg font-semibold text-gray-800">Your Project</h2>
            </div>
            
            <div className="p-4 md:p-6 text-center">
              <div className="relative mx-auto w-24 h-24 md:w-32 md:h-32 border-8 border-purple-600 rounded-full mb-4 transform hover:scale-105 transition-transform duration-200">
                <div className="absolute inset-0 flex items-center justify-center text-lg md:text-xl font-bold text-purple-600">
                  {clicksPerSession.toFixed(2)}
                </div>
              </div>
              <p className="text-gray-600 font-medium">Clicks per Session</p>
              <p className="text-xs text-gray-400 mt-1">Based on {totalSessions} sessions</p>
            </div>
          </div>
        </div>

        {/* Enhanced Distribution Analysis with Mobile Collapsible */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden animate-fade-in-up">
          {/* Mobile Toggle Header */}
          {isMobile && (
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <button
                onClick={() => setShowDistributions(!showDistributions)}
                className="w-full flex items-center justify-between text-lg font-semibold text-purple-600"
              >
                <span>Analytics Distribution</span>
                <ChevronDown
                  className={`w-5 h-5 transform transition-transform duration-200 ${
                    showDistributions ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </div>
          )}

          {/* Desktop Header */}
          {!isMobile && (
            <div className="p-6 md:p-8 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <h2 className="text-2xl font-semibold text-purple-600">Analytics Distribution</h2>
            </div>
          )}

          {/* Distribution Content */}
          <div className={`transition-all duration-300 ease-in-out ${
            isMobile && !showDistributions ? 'max-h-0 opacity-0' : 'max-h-full opacity-100'
          } ${isMobile && !showDistributions ? 'overflow-hidden' : ''}`}>
            <div className="p-4 md:p-8">
              {/* Enhanced Tab Navigation */}
              <nav className="flex border-b mb-6 overflow-x-auto">
                {["Browsers", "Countries", "Devices", "Operating Systems"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => handleTabChange(tab)}           
                    className={`px-3 md:px-4 py-2 font-semibold transition-all duration-300 focus:outline-none whitespace-nowrap text-sm md:text-base ${
                      activeTab === tab
                        ? "text-purple-600 border-b-2 border-purple-600 bg-purple-50"
                        : "text-gray-400 hover:text-purple-600 hover:bg-gray-50"
                    }`}
                  >
                    {isMobile && tab === "Operating Systems" ? "OS" : tab}
                  </button>
                ))}
              </nav>

              <h2 className="text-xl md:text-2xl font-semibold mb-6 text-purple-600">{selectedTab}</h2>
              
              {/* Enhanced Chart Container */}
              <div className="flex flex-col lg:flex-row items-center justify-center">
                <div className="relative w-64 h-64 md:w-80 md:h-80 mb-8 lg:mb-0 lg:mr-8 flex justify-center items-center">
                  <svg viewBox="0 0 36 36" className="w-full h-full rotate-[-90deg] filter drop-shadow-lg">
                    {(() => {
                      const key = selectedTab === "Operating Systems" ? "os" : selectedTab.toLowerCase();
                      const data = (distributions[key] || []).filter(item => item.count > 0);
                      const total = data.reduce((acc, item) => acc + item.count, 0);
                      
                      if (total === 0) {
                        return (
                          <circle
                            cx="18"
                            cy="18"
                            r="15.9155"
                            stroke="#e5e7eb"
                            strokeWidth="3"
                            fill="none"
                          />
                        );
                      }

                      let cumulativeOffset = 0;
                      
                      return data.map((item, index) => {
                        let itemName;
                        if (selectedTab === "Browsers") {
                          itemName = item.browser || "Others";
                        } else if (selectedTab === "Countries") {
                          itemName = item.country || "Others";
                        } else if (selectedTab === "Devices") {
                          itemName = item.device || "Others";
                        } else if (selectedTab === "Operating Systems") {
                          itemName = item.os || "Others";
                        } else {
                          itemName = "Others";
                        }
                        
                        const percentage = (item.count / total) * 100;
                        const circumference = 2 * Math.PI * 15.9155;
                        const dashLength = (percentage / 100) * circumference;
                        const dashArray = `${dashLength} ${circumference - dashLength}`;
                        const color = getCategoryColor(itemName, index);
                        const currentOffset = cumulativeOffset;
                        cumulativeOffset += dashLength;
                        
                        return (
                          <circle
                            key={index}
                            cx="18"
                            cy="18"
                            r="15.9155"
                            stroke={color}
                            strokeWidth="3"
                            strokeDasharray={dashArray}
                            strokeDashoffset={-currentOffset}
                            fill="none"
                            className="transition-all duration-500 ease-in-out"
                          />
                        );
                      });
                    })()}
                  </svg>
                </div>
              </div>

              {/* Enhanced Stats Display */}
              <div className="mt-6 p-4 md:p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">Overall Stats</h3>
                <ul className="grid grid-cols-1 gap-3 md:gap-4">
                {(() => {
                  const key = selectedTab === "Operating Systems" ? "os" : selectedTab.toLowerCase();
                  const data = (distributions[key] || []).filter(item => item.count > 0);
                  const total = data.reduce((acc, item) => acc + item.count, 0);
                  
                  if (data.length === 0) {
                    return (
                      <li className="text-gray-500 p-4 text-center bg-white rounded-lg">
                        No data available for {selectedTab}
                      </li>
                    );
                  }
                  
                  return data.map((item, index) => {
                    let itemName;
                    if (selectedTab === "Browsers") {
                      itemName = item.browser || "Others";
                    } else if (selectedTab === "Countries") {
                      itemName = item.country || "Others";
                    } else if (selectedTab === "Devices") {
                      itemName = item.device || "Others";
                    } else if (selectedTab === "Operating Systems") {
                      itemName = item.os || "Others";
                    } else {
                      itemName = "Others";
                    }
                    
                    const percentage = ((item.count / total) * 100).toFixed(2);
                    const color = getCategoryColor(itemName, index);

                    return (
                      <li
                        key={index}
                        className="flex items-center justify-between bg-white shadow-sm p-3 md:p-4 rounded-lg transform hover:scale-102 transition-all duration-200 hover:shadow-md border border-transparent hover:border-gray-200"
                      >
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <div 
                            className="w-3 h-3 md:w-4 md:h-4 rounded-full flex-shrink-0" 
                            style={{ backgroundColor: color }}
                          ></div>
                          <span className="font-semibold text-gray-700 text-sm md:text-base truncate">
                            {itemName}
                          </span>
                        </div>
                        <div className="text-xs md:text-sm text-gray-600 text-right flex-shrink-0 ml-2">
                          <div className="font-bold text-purple-600">{percentage}%</div>
                          <div className="text-gray-500">{item.count} sessions</div>
                        </div>
                      </li>
                    );
                  });
                })()}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from { 
            opacity: 0;
            transform: translateY(30px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in-up {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-in-left {
          from { 
            opacity: 0;
            transform: translateX(-30px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slide-in-right {
          from { 
            opacity: 0;
            transform: translateX(30px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
        
        .animate-slide-in-left {
          animation: slide-in-left 0.7s ease-out;
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.7s ease-out;
        }
        
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        
        .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 3px;
        }
        
        .scrollbar-track-gray-100::-webkit-scrollbar-track {
          background-color: #f3f4f6;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;