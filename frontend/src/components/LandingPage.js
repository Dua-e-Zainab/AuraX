import React, { useState, useEffect } from 'react';
import Navbar from './Navbar.js';
import Footer from './Footer';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: true
          }));
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll('[data-animate]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="font-sans bg-[#f4f7fe] text-gray-800">
      <style jsx>{`
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
        
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .fade-in-left {
          animation: fadeInLeft 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .fade-in-right {
          animation: fadeInRight 0.8s ease-out forwards;
          opacity: 1;
        }
        
        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
        .stagger-4 { animation-delay: 0.4s; }
        .stagger-5 { animation-delay: 0.5s; }
        
        /* Mobile responsive improvements */
        @media (max-width: 768px) {
          .mobile-stack {
            flex-direction: column !important;
          }
          .mobile-text-center {
            text-align: center !important;
          }
          .mobile-full-width {
            width: 100% !important;
          }
        }
      `}</style>

      <Navbar />

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row justify-between items-center py-8 md:py-16 px-6 md:px-12 lg:px-28 bg-gradient-to-br from-purple-50 to-blue-100 rounded-b-3xl text-center md:text-left mt-12">
        <div className={`flex-1 max-w-ug space-y-4 md:space-y-6 md:mr-10 ${isVisible['hero'] ? 'fade-in-left' : ''}`} id="hero" data-animate>
          <h1 className="text-3xl sm:text-4xl md:text-5xl leading-tight -mt-12">
            <span className="text-purple-600 italic bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text font-bold">
              Welcome to AuraX:{" "}
            </span>
            <span className="text-gray-700 italic">Design</span>
            <span className="text-gray-700 font-semi-bold italic">
              <br />
              Smarter with User Data
            </span>
          </h1>
          <p className="text-base md:text-lg text-gray-700 px-2 md:px-0">
            AuraX analyzes user interactions to reveal patterns and provide
            <br className="hidden md:block" /> 
            design improvements,making your site both engaging and optimized 
            <br className="hidden md:block" />
            for conversions.
          </p>
          <div className="flex flex-col sm:flex-row gap-1 mobile-stack">
            <input
              type="text"
              placeholder="Enter your website URL"
              className="p-3 md:p-5 w-full md:max-w-md border border-purple-300 rounded-l-full sm:rounded-r-none rounded-r-full shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 mobile-full-width"
            />
            <Link 
              to="/login"
              className="px-6 md:px-8 py-4 bg-purple-600 text-white rounded-r-full sm:rounded-l-none rounded-l-full shadow-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 inline-block text-center"
            >
              Continue
            </Link>
          </div>
          <div className="mobile-text-center">
            <a href="/register" className="text-purple-600 font-semibold hover:underline text-sm text-right pl-2 transition-all duration-300 hover:text-purple-700">
              Register yourself →
            </a>
          </div>
        </div>

        {/* Hero Image - Fixed */}
        <div className="flex-1 max-w-lg md:ml-8 mt-6 md:mt-0 animate-float">
          <img
            src="/homepageBannerV2.png"
            alt="Placeholder"
            className="w-full max-w-sm sm:max-w-md md:max-w-lg object-cover mx-auto transition-transform duration-300 hover:scale-105"
            style={{ opacity: 1 }}
          />
        </div>
      </section>

      {/* Auto-Scrolling Slider Section */}
      <section className="py-4 md:py-6 px-4 md:px-8 bg-white overflow-hidden">
        <div className="flex overflow-x-hidden relative">
          <div className="flex items-center space-x-20 md:space-x-40 animate-scroll">
            <img src="smartfinder.png" alt="SmartFinder" className="h-8 md:h-12 transition-transform duration-300 hover:scale-110" />
            <img src="zoomer.png" alt="Zoomer" className="h-8 md:h-12 transition-transform duration-300 hover:scale-110" />
            <img src="shells.png" alt="Shells" className="h-8 md:h-12 transition-transform duration-300 hover:scale-110" />
            <img src="waves.png" alt="Waves" className="h-8 md:h-12 transition-transform duration-300 hover:scale-110" />
            <img src="artavenue.png" alt="ArtVenue" className="h-8 md:h-12 transition-transform duration-300 hover:scale-110" />
            {/* Duplicate for seamless loop */}
            <img src="smartfinder.png" alt="SmartFinder" className="h-8 md:h-12 transition-transform duration-300 hover:scale-110" />
            <img src="zoomer.png" alt="Zoomer" className="h-8 md:h-12 transition-transform duration-300 hover:scale-110" />
            <img src="shells.png" alt="Shells" className="h-8 md:h-12 transition-transform duration-300 hover:scale-110" />
            <img src="waves.png" alt="Waves" className="h-8 md:h-12 transition-transform duration-300 hover:scale-110" />
            <img src="artavenue.png" alt="ArtVenue" className="h-8 md:h-12 transition-transform duration-300 hover:scale-110" />
          </div>
        </div>
      </section>

{/* Why AuraX Section with Zigzag Left Layout */}
<section id="why-aurax" data-animate className="py-12 md:py-16 px-4 md:px-6 bg-blue-50">
  <div className="max-w-6xl mx-auto flex flex-col lg:flex-row-reverse items-center gap-8 md:gap-12">
    {/* Text Content */}
    <div className={`lg:max-w-md text-center lg:text-left ${isVisible['why-aurax'] ? 'fade-in-right' : ''}`}>
      <h2 className="text-3xl md:text-4xl font-bold leading-relaxed text-purple-600 bg-gradient-to-b from-blue-500 to-purple-500 bg-clip-text text-transparent mb-4 md:mb-6">Why AuraX?</h2>
      <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-4 md:mb-6 px-2 lg:px-0">
        AuraX helps you optimize your website by visualizing user behavior with heatmaps showing clicks, scrolls, and time spent. It also provides smart CSS design suggestions for better usability and engagement. By aligning your design with real user behavior, you can boost engagement, retention, and conversions through data-driven improvements.
      </p>
      <a href="/case-studies" className="inline-flex items-center text-purple-600 font-semibold hover:underline transition-all duration-300 text-base md:text-lg hover:text-purple-700 transform hover:translate-x-1">
        See how it helped others
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 ml-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </a>
    </div>

{/* Zigzag Image Grid on Left - Compact */}
<div className={`w-full relative h-80 md:h-[500px] ${isVisible['why-aurax'] ? 'fade-in-left' : ''}`}>
  {/* Left image (lower) */}
  <div className="absolute left-0 bottom-0 w-[28%] md:w-[30%] h-[70%] md:h-[85%] bg-gray-200 rounded-xl shadow-lg overflow-hidden z-10 transition-all duration-300 hover:scale-105 hover:shadow-xl">
    <img src="why1.png" alt="Heatmap visualization" className="w-full h-full object-cover transition-transform duration-300" />
  </div>
  
  {/* Middle image (higher) */}
  <div className="absolute left-[36%] md:left-[35%] top-2 md:top-4 w-[28%] md:w-[30%] h-[70%] md:h-[85%] bg-gray-200 rounded-xl shadow-lg overflow-hidden z-20 transition-all duration-300 hover:scale-105 hover:shadow-xl stagger-1">
    <img src="why2.png" alt="User engagement metrics" className="w-full h-full object-cover transition-transform duration-300" />
  </div>
  
  {/* Right image (lower) - moved to left side */}
  <div className="absolute left-[72%] md:left-[70%] bottom-0 w-[28%] md:w-[30%] h-[70%] md:h-[85%] bg-gray-200 rounded-xl shadow-lg overflow-hidden z-10 transition-all duration-300 hover:scale-105 hover:shadow-xl stagger-2">
    <img src="why3.png" alt="CSS suggestions" className="w-full h-full object-cover transition-transform duration-300" />
  </div>
  
  {/* Decorative elements (optional) */}
  <div className="absolute -left-2 md:-left-4 top-1/4 w-6 h-6 md:w-12 md:h-12 bg-purple-100 rounded-full opacity-20 animate-float"></div>
  <div className="absolute -right-2 md:-right-4 bottom-1/4 w-8 h-8 md:w-16 md:h-16 bg-blue-100 rounded-lg opacity-20 animate-float stagger-3"></div>
</div>

  </div>
</section>


{/* How It Works Section */}
<section id="how-it-works" data-animate className="py-8 md:py-12 px-4 md:px-8 bg-blue-50">
<h2 className={`text-3xl md:text-4xl font-bold text-center text-purple-600 bg-gradient-to-b from-blue-500 to-purple-500 bg-clip-text text-transparent mb-6 md:mb-8 ${isVisible['how-it-works'] ? 'fade-in-up' : ''}`}>
  How it works
</h2>
  <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
    <div className={`p-4 md:p-6 bg-white rounded-lg shadow-lg text-center border-2 border-blue-500 transition-all duration-500 hover:shadow-[0_0_20px_rgba(0,0,255,0.6)] transform hover:scale-105 ${isVisible['how-it-works'] ? 'fade-in-up stagger-1' : ''}`}>
      <div className="flex justify-center mb-3">
        {/* Icon for Track User Interaction */}
        <img src={`${process.env.PUBLIC_URL}/interaction.png`} alt="Track User Interaction" className="w-6 h-6 md:w-8 md:h-8 transition-transform duration-300" />
      </div>
      <h3 className="text-lg md:text-xl font-semibold text-blue-600">Track User Interaction</h3>
      <p className="mt-2 text-sm md:text-base text-gray-700">
        Collect real-time data on how visitors engage with your website.
      </p>
    </div>
    
    <div className={`p-4 md:p-6 bg-white rounded-lg shadow-lg text-center border-2 border-blue-500 transition-all duration-500 hover:shadow-[0_0_20px_rgba(0,0,255,0.6)] transform hover:scale-105 ${isVisible['how-it-works'] ? 'fade-in-up stagger-2' : ''}`}>
      <div className="flex justify-center mb-3">
        {/* Icon for Visualize with Heatmaps */}
        <img src={`${process.env.PUBLIC_URL}/git-branch.png`} alt="Visualize with Heatmaps" className="w-6 h-6 md:w-8 md:h-8 transition-transform duration-300" />
      </div>
      <h3 className="text-lg md:text-xl font-semibold text-blue-600">Visualize with Heatmaps</h3>
      <p className="mt-2 text-sm md:text-base text-gray-700">
        Get clear, visual representations of user activity, highlighting hot spots areas that need attention.
      </p>
    </div>
    
    <div className={`p-4 md:p-6 bg-white rounded-lg shadow-lg text-center border-2 border-blue-500 transition-all duration-500 hover:shadow-[0_0_20px_rgba(0,0,255,0.6)] transform hover:scale-105 ${isVisible['how-it-works'] ? 'fade-in-up stagger-3' : ''}`}>
      <div className="flex justify-center mb-3">
        {/* Icon for Receive Actionable Insights */}
        <img src={`${process.env.PUBLIC_URL}/framer.png`} alt="Receive Actionable Insights" className="w-6 h-6 md:w-8 md:h-8 transition-transform duration-300" />
      </div>
      <h3 className="text-lg md:text-xl font-semibold text-blue-600 ">Receive Actionable Insights</h3>
      <p className="mt-2 text-sm md:text-base text-gray-700 ">
        AuraX offers personalized design suggestions that improve usability and flow.
      </p>
    </div>
  </div>
</section>




{/* Who Should Use AuraX Section */}
<section className="py-12 px-8 bg-blue-50">
  <h2 className="text-4xl font-bold text-center text-purple-600 bg-gradient-to-b from-blue-500 to-purple-500 bg-clip-text text-transparent">
    Who Should Use AuraX?
  </h2>
  <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
    
    {/* Website Owners */}
    <div className="text-center bg-white rounded-lg p-4 shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-2xl">
      <img
        src="who1.png"
        alt="Website Owners"
        className="rounded-lg shadow-md mb-4 mx-auto w-full object-cover transition duration-500 hover:opacity-90"
      />
      <h3 className="text-xl font-semibold text-gray-900">Website Owners</h3>
      <p className="text-gray-700 mt-2">
        For those managing websites, AuraX provides essential insights.
      </p>
      {/* Floating avatars */}
      <div className="flex justify-center mt-3 space-x-2 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <img src="avatar1.png" alt="User 1" className="w-8 h-8 rounded-full border-2 border-white shadow-md" />
        <img src="avatar2.png" alt="User 2" className="w-8 h-8 rounded-full border-2 border-white shadow-md" />
      </div>
    </div>

    {/* E-commerce */}
    <div className="text-center bg-white rounded-lg p-4 shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-2xl">
      <img
        src="who2.png"
        alt="E-commerce"
        className="rounded-lg shadow-md mb-4 mx-auto w-full object-cover transition duration-500 hover:opacity-90"
      />
      <h3 className="text-xl font-semibold text-gray-900">E-commerce</h3>
      <p className="text-gray-700 mt-2">
        Increase conversions by understanding customer interaction on your store.
      </p>
      <div className="flex justify-center mt-3 space-x-2 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <img src="avatar3.png" alt="User 3" className="w-8 h-8 rounded-full border-2 border-white shadow-md" />
        <img src="avatar4.png" alt="User 4" className="w-8 h-8 rounded-full border-2 border-white shadow-md" />
      </div>
    </div>

    {/* Content Creators */}
    <div className="text-center bg-white rounded-lg p-4 shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-2xl">
      <img
        src="who3.png"
        alt="Content Creators"
        className="rounded-lg shadow-md mb-4 mx-auto w-full object-cover transition duration-500 hover:opacity-90"
      />
      <h3 className="text-xl font-semibold text-gray-900">Content Creators</h3>
      <p className="text-gray-700 mt-2">
        See how audiences engage with your content to refine your strategy.
      </p>
      <div className="flex justify-center mt-3 space-x-2 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <img src="avatar5.png" alt="User 5" className="w-8 h-8 rounded-full border-2 border-white shadow-md" />
        <img src="avatar6.png" alt="User 6" className="w-8 h-8 rounded-full border-2 border-white shadow-md" />
      </div>
    </div>

  </div>
</section>

      <Footer />
    </div>
  );
};

export default LandingPage;