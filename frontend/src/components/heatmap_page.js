import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { FaMousePointer, FaChartLine, FaHandPointer } from "react-icons/fa";

// Animation hook for scroll-triggered animations
const useScrollAnimation = () => {
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return isVisible;
};
const HeatmapIntroPage = () => {
  const [activeTab, setActiveTab] = useState("click");
  const [isVisible, setIsVisible] = useState({});
  const visibleElements = useScrollAnimation();

  const tabItems = [
    { id: "click", label: "Identify Hotspots", image: "improve.png" },
    { id: "scroll", label: "Optimize Navigation", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop" },
    { id: "hover", label: "Improve UX", image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop" },
  ];
  
  const activeImage = tabItems.find((tab) => tab.id === activeTab)?.image;

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
  
  return (
    <div className="bg-gray-50 text-gray-700 overflow-x-hidden">
      {/* Navbar */}
      <header><Navbar /></header>

      {/* Hero Section */}
      <section className="px-4 sm:px-6 md:px-10 lg:px-20 py-10 md:py-20 bg-gradient-to-br from-purple-50 to-blue-100 relative mt-14">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">
          
          {/* Left: Text & Tabs */}
          <div className="w-full lg:w-[65%] text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-gray-900 mb-8 lg:mb-12 leading-tight animate-fade-in-up">
              Visualize
              <span className="text-purple-600 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text font-bold">
                {" "}User Interaction
              </span>
              <br className="hidden sm:block" /> 
              <span className="sm:hidden"> </span>
              in Real-Time
            </h1>

            <p className="italic text-gray-600 mt-6 font-semibold text-sm sm:text-base animate-fade-in-up animation-delay-200">
              What Are Heatmaps?
            </p>
            <p className="text-gray-500 mt-4 max-w-prose mx-auto lg:mx-0 text-sm sm:text-base animate-fade-in-up animation-delay-400">
              Heatmaps provide a visual representation of user activity on your website. They show 
              where visitors click, scroll, hover, and engage, helping you understand how they interact 
              with your content.
            </p>

            {/* Tabs */}
            <div className="flex flex-wrap justify-center lg:justify-start mt-6 lg:mt-8 gap-2 sm:gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              {tabItems.map((tab, index) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 sm:px-5 py-2 sm:py-3 rounded shadow transition-all duration-300 ease-in-out transform hover:scale-105 text-sm sm:text-base
                    ${
                      activeTab === tab.id
                        ? "bg-purple-600 text-white shadow-lg scale-105"
                        : "bg-white text-gray-700 border hover:bg-gray-100"
                    }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right: 3D Purple Cube Animation */}
          <div className="w-full lg:w-[35%] flex justify-center items-center mt-8 lg:mt-0">
            <div className="perspective-container animate-float">
              <div className="cube-3d">
                <div className="face front bg-gradient-to-br from-purple-400 to-purple-600"></div>
                <div className="face back bg-gradient-to-br from-purple-500 to-purple-700"></div>
                <div className="face right bg-gradient-to-br from-purple-300 to-purple-500"></div>
                <div className="face left bg-gradient-to-br from-purple-600 to-purple-800"></div>
                <div className="face top bg-gradient-to-br from-purple-200 to-purple-400"></div>
                <div className="face bottom bg-gradient-to-br from-purple-700 to-purple-900"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Heatmap Preview */}
        <div className="mt-16 lg:mt-24 w-full max-w-7xl mx-auto aspect-[16/9] sm:aspect-[18/10] lg:aspect-[18/8] bg-gray-300 rounded-lg overflow-hidden flex items-center justify-center animate-fade-in-up animation-delay-800">
          <img 
            src={activeImage} 
            alt={activeTab} 
            className="w-full h-full object-cover transition-opacity duration-500" 
          />
        </div>
      </section>

      {/* Types of Heatmaps */}
        <section 
          id="types-section"
          data-animate
          className={`bg-blue-50 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${
            visibleElements['types-section'] ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'
          }`}
        >
          <div className="max-w-7xl mx-auto">
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-800 text-center lg:text-left mb-8 lg:mb-12">
              Types of Heatmaps Available in{" "}
              <span className="text-purple-600 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text font-bold">
                AuraX
              </span>
            </h3>

            <div className="space-y-6 lg:space-y-10">
              {[
                {
                  title: "Click Heatmaps",
                  desc: "Track where users click most often, revealing high-interest areas and potential design issues.",
                  icon: <FaMousePointer size={24} className="sm:w-7 sm:h-7" />,
                  bg: "bg-gray-200",
                  delay: '0s'
                },
                {
                  title: "Scroll Heatmaps",
                  desc: "Understand how far visitors scroll down your page and see where they lose interest.",
                  icon: <FaChartLine size={24} className="sm:w-7 sm:h-7" />,
                  bg: "bg-purple-600 text-white",
                  delay: '0.2s'
                },
                {
                  title: "Hover Heatmaps",
                  desc: "Visualize where users hover their cursor, helping identify points of interest.",
                  icon: <FaHandPointer size={24} className="sm:w-7 sm:h-7" />,
                  bg: "bg-gray-200",
                  delay: '0.4s'
                }
              ].map((item, index) => (
                <div 
                  key={index} 
                  className={`flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 border-b pb-6 lg:pb-8 transition-all duration-700 hover:transform hover:scale-105 ${
                    visibleElements['types-section'] ? 'animate-slide-in-left' : ''
                  }`}
                  style={{ animationDelay: item.delay }}
                >
                  <div className={`p-3 sm:p-4 rounded-md ${item.bg} flex-shrink-0 transition-transform duration-300 hover:scale-110`}>
                    {item.icon}
                  </div>
                  <div className="text-center sm:text-left">
                    <h4 className="text-lg sm:text-xl text-blue-600 font-bold mb-1">{item.title}</h4>
                    <p className="text-base sm:text-lg text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      {/* Benefits Section */}
        <section 
          id="benefits-section"
          data-animate
          className={`bg-blue-50 relative overflow-hidden py-12 sm:py-16 lg:py-20 transition-all duration-1000 ${
            visibleElements['benefits-section'] ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              
              {/* Left Side - Image and Circle */}
              <div className="relative w-full lg:w-5/12 flex justify-center items-center order-2 lg:order-1">
                
                {/* Purple Semi-Circle - Hidden on mobile */}
                <div className="absolute -left-32 lg:-left-48 top-1/2 transform -translate-y-1/2 w-64 h-64 lg:w-[500px] lg:h-[500px] bg-purple-500 rounded-full z-0 opacity-20 lg:opacity-100"></div>

                {/* Image Box */}
                <div className="relative z-10 w-64 sm:w-72 lg:w-80 h-80 sm:h-96 lg:h-[550px] rounded-2xl shadow-2xl overflow-hidden border-4 border-purple-300 bg-blue-100 transform hover:scale-105 transition-transform duration-500">
                  <img 
                    src="mobimg.png" 
                    alt="Heatmap Visualization" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Right Side - Text Content */}
              <div className="w-full lg:w-7/12 order-1 lg:order-2">
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-800 text-center lg:text-left leading-snug mb-6 lg:mb-8">
                  How Heatmaps Help You{" "}
                  <br className="hidden sm:block" />
                  <span className="font-bold text-purple-600 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
                    Optimize Your Website
                  </span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                  {[
                    {
                      icon: "💎",
                      title: "Analyze Key Pages",
                      desc: "View heatmap data for crucial pages like your homepage, product pages to identify where users are most engaged.",
                      delay: '0s'
                    },
                    {
                      icon: "🏆",
                      title: "Data-Driven Changes",
                      desc: "Use heatmap insights to redesign layouts, adjust call-to-action (CTA) placements, and improve navigation.",
                      delay: '0.1s'
                    },
                    {
                      icon: "📈",
                      title: "Track Progress",
                      desc: "Focus on the sections that matter most by identifying elements and optimizing them to increase user interaction.",
                      delay: '0.2s'
                    },
                    {
                      icon: "🚀",
                      title: "Prioritize High-Impact Areas",
                      desc: "Focus on the sections that matter most by identifying elements and optimizing them to increase user interaction.",
                      delay: '0.3s'
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className={`bg-purple-50 hover:bg-purple-100 transition-all duration-300 ease-in-out p-4 lg:p-5 rounded-xl shadow-md flex items-start gap-3 lg:gap-4 transform hover:scale-105 hover:shadow-lg ${
                        visibleElements['benefits-section'] ? 'animate-fade-in-up' : ''
                      }`}
                      style={{ animationDelay: item.delay }}
                    >
                      <div className="text-2xl lg:text-3xl flex-shrink-0">{item.icon}</div>
                      <div>
                        <h4 className="font-semibold text-base lg:text-lg text-purple-700">{item.title}</h4>
                        <p className="text-xs sm:text-sm text-gray-700 mt-1">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

      {/* Call to Action Section */}
        <section 
          id="cta-section"
          data-animate
          className={`bg-blue-50 w-full py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${
            visibleElements['cta-section'] ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'
          }`}
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
              
              {/* Left Content */}
              <div className="w-full lg:w-1/2 text-center lg:text-left">
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-700 leading-snug mb-4 lg:mb-6">
                  Start Using{" "}
                  <span className="font-bold text-purple-600 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
                    Heatmaps
                  </span>{" "}
                  Today
                </h3>
                
                <p className="text-gray-700 mt-4 lg:mt-6 text-sm sm:text-base leading-relaxed max-w-lg mx-auto lg:mx-0">
                  Understand your users better and make smarter design choices 
                  with AuraX Heatmaps. Gain real-time insights and optimize your
                  website for engagement and conversions.
                </p>

                {/* Icons Row */}
                <div className="flex justify-center lg:justify-start space-x-4 mt-6">
                  {[
                    { icon: "🔔", bg: "bg-blue-100", color: "text-blue-500" },
                    { icon: "🖥️", bg: "bg-blue-100", color: "text-blue-500" },
                    { icon: "👥", bg: "bg-blue-100", color: "text-purple-500" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className={`w-12 h-12 sm:w-14 sm:h-14 ${item.bg} rounded-lg flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-md hover:shadow-lg animate-bounce`}
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      <span className={`text-xl sm:text-2xl ${item.color}`}>{item.icon}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button with gradient */}
                <button className="mt-6 lg:mt-8 px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 hover:from-blue-600 hover:to-purple-600 hover:shadow-xl transform hover:scale-105 text-sm sm:text-base">
                  Get Started
                </button>
              </div>

              {/* Right Side - Image Box */}
              <div className="w-full lg:w-1/2 flex justify-center lg:justify-end relative">
                <div className="w-full max-w-md lg:max-w-lg xl:w-[540px] h-64 sm:h-80 lg:h-96 xl:h-[440px] rounded-2xl lg:rounded-3xl overflow-hidden border-4 border-gray-300 shadow-2xl bg-white transform hover:scale-105 transition-transform duration-500">
                  <img
                    src="people-colorful-thermal-scan-with-celsius-degree-temperature.jpg"
                    alt="Heatmap Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

      <Footer />

      <style jsx>{`
        .perspective-container {
          perspective: 1000px;
          width: 150px;
          height: 150px;
        }
        
        .cube-3d {
          width: 150px;
          height: 150px;
          position: relative;
          transform-style: preserve-3d;
          animation: rotateCube 8s infinite linear;
        }
        
        .face {
          position: absolute;
          width: 150px;
          height: 150px;
          border: 2px solid rgba(255,255,255,0.1);
        }
        
        .front { transform: rotateY(0deg) translateZ(75px); }
        .back { transform: rotateY(180deg) translateZ(75px); }
        .right { transform: rotateY(90deg) translateZ(75px); }
        .left { transform: rotateY(-90deg) translateZ(75px); }
        .top { transform: rotateX(90deg) translateZ(75px); }
        .bottom { transform: rotateX(-90deg) translateZ(75px); }
        
        @keyframes rotateCube {
          0% { transform: rotateX(0deg) rotateY(0deg); }
          100% { transform: rotateX(360deg) rotateY(360deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-600 { animation-delay: 0.6s; }
        .animation-delay-800 { animation-delay: 0.8s; }
        
        @media (max-width: 640px) {
          .perspective-container {
            width: 120px;
            height: 120px;
          }
          
          .cube-3d {
            width: 120px;
            height: 120px;
          }
          
          .face {
            width: 120px;
            height: 120px;
          }
          
          .front { transform: rotateY(0deg) translateZ(60px); }
          .back { transform: rotateY(180deg) translateZ(60px); }
          .right { transform: rotateY(90deg) translateZ(60px); }
          .left { transform: rotateY(-90deg) translateZ(60px); }
          .top { transform: rotateX(90deg) translateZ(60px); }
          .bottom { transform: rotateX(-90deg) translateZ(60px); }
        }
      `}</style>
    </div>
  );
};

export default HeatmapIntroPage;