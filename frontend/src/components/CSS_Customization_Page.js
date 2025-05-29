import React, { useEffect, useState } from "react";
import Navbar from './Navbar.js';
import Footer from './Footer.js';
import { FiBell, FiMonitor, FiUsers } from "react-icons/fi";

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

const CSSCustomizationPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const visibleElements = useScrollAnimation();

  useEffect(() => {
    setIsVisible(true);
  }, []);

   return (
    <div className="bg-gray-50 text-gray-800 overflow-x-hidden">
      {/* Custom CSS for animations */}
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
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0,0,0);
          }
          40%, 43% {
            transform: translate3d(0, -8px, 0);
          }
          70% {
            transform: translate3d(0, -4px, 0);
          }
          90% {
            transform: translate3d(0, -2px, 0);
          }
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        @keyframes glow {
          0% {
            box-shadow: 0 0 5px rgba(99, 102, 241, 0.4);
          }
          50% {
            box-shadow: 0 0 20px rgba(99, 102, 241, 0.6);
          }
          100% {
            box-shadow: 0 0 5px rgba(99, 102, 241, 0.4);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .animate-slideInLeft {
          animation: slideInLeft 0.8s ease-out forwards;
        }
        
        .animate-slideInRight {
          animation: slideInRight 0.8s ease-out forwards;
        }
        
        .animate-bounce-slow {
          animation: bounce 2s infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse 3s ease-in-out infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }

        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }

        .hover-scale:hover {
          transform: scale(1.05);
          transition: all 0.3s ease;
        }

        .hover-rotate:hover {
          transform: rotate(10deg);
          transition: all 0.3s ease;
        }

        .hover-lift:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          transition: all 0.3s ease;
        }

        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .section-transition {
          transition: all 1000ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .section-hidden {
          opacity: 0;
          transform: translateY(40px);
        }

        .section-visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    <header>
        <Navbar/>
    </header>

{/* Hero Section */}
<section className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 md:px-20 bg-gradient-to-br from-purple-50 to-blue-100 overflow-hidden relative mt-14">
  {/* Hero Content */}
  <div className="relative z-10 w-full">
    <div className="max-w-full text-left">
      <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semi-bold text-gray-900 mb-4 sm:mb-6 leading-tight ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}>
        CSS Customization for Tailored <br className="hidden sm:block" />
        <span className="text-purple-600 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text font-bold animate-pulse-slow">
          Design Enhancements
        </span>
      </h1>

      <p className={`text-base sm:text-lg text-gray-600 mb-8 sm:mb-10 max-w-4xl ${isVisible ? 'animate-fadeInUp delay-200' : 'opacity-0'}`}>
        AuraX goes beyond visualizing user behavior, offering personalized CSS suggestions to boost
        usability and performance. By leveraging heatmap insights, we deliver actionable design
        improvements, optimizing your site's aesthetics and user experience.
      </p>

      {/* Buttons */}
      <div className={`flex flex-col sm:flex-row items-center sm:items-center space-y-3 sm:space-y-0 sm:space-x-5 ${isVisible ? 'animate-fadeInUp delay-400' : 'opacity-0'}`}>
        <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-md shadow-md hover-scale hover-lift">
          Get Started
        </button>
        <a
          href="#"
          className="w-full sm:w-auto flex items-center justify-center sm:justify-start text-blue-600 font-medium hover:underline hover-scale"
        >
          <svg
            className="w-5 h-5 mr-2 hover-rotate"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.752 11.168l-5.197-3.008A1 1 0 008 9.057v5.886a1 1 0 001.555.832l5.197-3.008a1 1 0 000-1.664z"
            />
          </svg>
          Watch Video
        </a>
      </div>
    </div>
  </div>
</section>

{/* How It Works */}
<section 
  id="how-it-works"
  data-animate
  className={`py-16 sm:py-20 md:py-24 bg-blue-50 text-center px-4 sm:px-6 relative section-transition ${
    visibleElements['how-it-works'] ? 'section-visible' : 'section-hidden'
  }`}
>
  <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text mb-4 sm:mb-6">
    How It Works
  </h2>
  <p className="text-gray-600 max-w-2xl mx-auto mb-12 sm:mb-16 text-sm sm:text-base">
    Lorem ipsum is common placeholder text used to demonstrate the graphic elements of a document or visual presentation.
  </p>

  {/* Left Bands */}
  <div className="absolute bottom-0 left-[-40px] sm:left-[-60px] z-0">
    {/* Gray Band */}
    <div className={`w-48 sm:w-72 h-6 sm:h-10 bg-[#e1e5f0] transform -rotate-6 origin-left mb-1 transition-all duration-700 ${
      visibleElements['how-it-works'] ? 'animate-slideInLeft' : 'opacity-0'
    }`}></div>
    {/* Blue Band */}
    <div className={`w-48 sm:w-72 h-6 sm:h-10 bg-[#c9eaf7] transform -rotate-6 origin-left transition-all duration-700 delay-200 ${
      visibleElements['how-it-works'] ? 'animate-slideInLeft' : 'opacity-0'
    }`}></div>
  </div>

  {/* Right Bands */}
  <div className="absolute bottom-0 right-[-40px] sm:right-[-60px] z-0">
    {/* Blue Band */}
    <div className={`w-48 sm:w-72 h-6 sm:h-10 bg-[#c9eaf7] transform -rotate-6 origin-right mb-2 transition-all duration-700 ${
      visibleElements['how-it-works'] ? 'animate-slideInRight' : 'opacity-0'
    }`}></div>
    {/* Gray Band */}
    <div className={`w-48 sm:w-72 h-6 sm:h-10 bg-[#e1e5f0] transform -rotate-6 origin-right transition-all duration-700 delay-200 ${
      visibleElements['how-it-works'] ? 'animate-slideInRight' : 'opacity-0'
    }`}></div>
  </div>
  
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12 max-w-7xl mx-auto relative z-10">
    {/* Step 1 */}
    <div className={`bg-white p-6 rounded-xl shadow-sm hover-lift animate-float transition-all duration-700 ${
      visibleElements['how-it-works'] ? 'animate-fadeInUp delay-300' : 'opacity-0'
    }`}>
      <div className="flex justify-center mb-4">
        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center hover-rotate">
          <span className="text-purple-600 text-xl font-bold">1</span>
        </div>
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-purple-600 mb-2">Analyze Heatmaps</h3>
      <p className="text-gray-600 max-w-xs mx-auto text-sm sm:text-base">
        After reviewing your heatmap data, AuraX identifies areas of improvement, from unclicked CTAs to underutilized page sections.
      </p>
    </div>

    {/* Step 2 */}
    <div className={`bg-white p-6 rounded-xl shadow-sm hover-lift animate-float transition-all duration-700 ${
      visibleElements['how-it-works'] ? 'animate-fadeInUp delay-400' : 'opacity-0'
    }`}>
      <div className="flex justify-center mb-4">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center hover-rotate">
          <span className="text-blue-600 text-xl font-bold">2</span>
        </div>
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-purple-600 mb-2">CSS Suggestions</h3>
      <p className="text-gray-600 max-w-xs mx-auto text-sm sm:text-base">
        AuraX offers custom CSS snippets to improve button placement, layout, readability, and navigation for better user site usability and experience.
      </p>
    </div>

    {/* Step 3 */}
    <div className={`bg-white p-6 rounded-xl shadow-sm hover-lift animate-float sm:col-span-2 md:col-span-1 transition-all duration-700 ${
      visibleElements['how-it-works'] ? 'animate-fadeInUp delay-500' : 'opacity-0'
    }`}>
      <div className="flex justify-center mb-4">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center hover-rotate">
          <span className="text-green-600 text-xl font-bold">3</span>
        </div>
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-purple-600 mb-2">Smart CSS Popups</h3>
      <p className="text-gray-600 max-w-xs mx-auto text-sm sm:text-base">
        If heatmaps show usability issues, smart popups alert you with instant recommendations to resolve them before they affect site performance.
      </p>
    </div>
  </div>
</section>

{/* Examples of CSS Recommendations */}
<section 
  id="css-examples"
  data-animate
  className={`bg-blue-50 py-12 sm:py-16 px-4 sm:px-6 section-transition ${
    visibleElements['css-examples'] ? 'section-visible' : 'section-hidden'
  }`}
>
  <div className="max-w-6xl mx-auto">
    <h2 className="text-3xl sm:text-4xl font-bold text-center bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text mb-8 sm:mb-12">
      Examples of CSS Recommendations
    </h2>
    <div className="text-center mb-6 sm:mb-8">
      <p className="text-base sm:text-lg text-gray-600">Here's how AuraX can help you refine your website's design:</p>
    </div>
    
    <div className={`relative bg-white p-6 sm:p-8 rounded-lg shadow-md border-2 border-purple-400/50 hover-lift animate-glow transition-all duration-700 ${
      visibleElements['css-examples'] ? 'animate-fadeInUp delay-300' : 'opacity-0'
    }`}>
      <h3 className="text-xl sm:text-2xl font-bold mb-4 relative z-10">Call-to-Action Buttons</h3>
      <p className="text-gray-600 mb-6 relative z-10 text-sm sm:text-base">
        Your main CTA button isn't getting enough clicks. Consider<br className="hidden sm:block" />
        increasing the size and changing the color to something more<br className="hidden sm:block" />
        attention-grabbing.
      </p>
      <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-6 relative z-10">
        <button className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 hover-scale hover-lift animate-bounce-slow">
          Buy Tickets
        </button>
        <button className="w-full sm:w-auto bg-gray-200 text-gray-800 px-6 py-3 rounded-lg text-lg font-medium hover:bg-gray-300 hover-scale hover-lift">
          Event Details
        </button>
      </div>
    </div>
  </div>
</section>

{/* Why CSS Customization Matters */}
<section 
  id="why-css-matters"
  data-animate
  className={`py-12 sm:py-16 px-4 sm:px-6 bg-blue-50 section-transition ${
    visibleElements['why-css-matters'] ? 'section-visible' : 'section-hidden'
  }`}
>
  <div className="max-w-7xl mx-auto">
    <h2 className="text-3xl sm:text-4xl font-bold text-center bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text mb-8 sm:mb-12">
      Why CSS Customization Matters
    </h2>
    
    <div className="relative">
      {/* Navigation Arrows - Left */}
      <button 
        onClick={() => {
          const container = document.querySelector('.slider-container');
          container.scrollBy({ left: -container.offsetWidth, behavior: 'smooth' });
        }}
        className="hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-md hover:bg-gray-100 transition-all duration-300 ease-out hover:scale-110 -ml-4 transform"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 transition-transform duration-300 ease-out hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      {/* Navigation Arrows - Right */}
      <button 
        onClick={() => {
          const container = document.querySelector('.slider-container');
          container.scrollBy({ left: container.offsetWidth, behavior: 'smooth' });
        }}
        className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-md hover:bg-gray-100 transition-all duration-300 ease-out hover:scale-110 -mr-4 transform"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 transition-transform duration-300 ease-out hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Content Slider */}
      <div className="slider-container flex overflow-x-auto snap-x snap-mandatory scroll-smooth space-x-4 sm:space-x-8 pb-4 -mx-4 px-4" style={{ scrollbarWidth: 'none' }}>
        {/* Hide scrollbar */}
        <style jsx>{`
          .slider-container::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        
      {/* Slide 1 */}
      <div className={`flex-shrink-0 w-80 sm:w-full md:w-2/3 lg:w-1/2 xl:w-1/3 bg-white p-6 sm:p-8 rounded-xl shadow-md snap-start transform transition-all duration-700 hover:scale-105 hover:shadow-xl ${
        visibleElements['why-css-matters'] ? 'animate-fadeInUp' : 'opacity-0'
      }`}>
        <div className="w-full h-40 sm:h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg mb-4 sm:mb-6 flex items-center justify-center">
          <span className="text-4xl">🎯</span>
        </div>
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
          Well-placed buttons, clear calls to action, and optimized layouts encourage users to interact with your content.
        </p>
      </div>

      {/* Slide 2 */}
      <div className={`flex-shrink-0 w-80 sm:w-full md:w-2/3 lg:w-1/2 xl:w-1/3 bg-white p-6 sm:p-8 rounded-xl shadow-md snap-start transform transition-all duration-700 hover:scale-105 hover:shadow-xl delay-100 ${
        visibleElements['why-css-matters'] ? 'animate-fadeInUp' : 'opacity-0'
      }`}>
        <div className="w-full h-40 sm:h-48 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg mb-4 sm:mb-6 flex items-center justify-center">
          <span className="text-4xl">🔄</span>
        </div>
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
          Small design tweaks can drastically improve usability, making your site easier to navigate.
        </p>
      </div>

      {/* Slide 3 */}
      <div className={`flex-shrink-0 w-80 sm:w-full md:w-2/3 lg:w-1/2 xl:w-1/3 bg-white p-6 sm:p-8 rounded-xl shadow-md snap-start transform transition-all duration-700 hover:scale-105 hover:shadow-xl delay-200 ${
        visibleElements['why-css-matters'] ? 'animate-fadeInUp' : 'opacity-0'
      }`}>
        <div className="w-full h-40 sm:h-48 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg mb-4 sm:mb-6 flex items-center justify-center">
          <span className="text-4xl">📈</span>
        </div>
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
          By following AuraX's CSS suggestions, you can reduce friction points and guide users smoothly toward conversions.
        </p>
      </div>

      {/* Slide 4 */}
      <div className={`flex-shrink-0 w-80 sm:w-full md:w-2/3 lg:w-1/2 xl:w-1/3 bg-white p-6 sm:p-8 rounded-xl shadow-md snap-start transform transition-all duration-700 hover:scale-105 hover:shadow-xl delay-300 ${
        visibleElements['why-css-matters'] ? 'animate-fadeInUp' : 'opacity-0'
      }`}>
        <div className="w-full h-40 sm:h-48 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-lg mb-4 sm:mb-6 flex items-center justify-center">
          <span className="text-4xl">🏗️</span>
        </div>
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
          Well-structured custom CSS is easier to maintain and scale than
          overriding framework styles, reducing technical debt as your
          project grows in complexity.
        </p>
      </div>

      {/* Slide 5 */}
      <div className={`flex-shrink-0 w-80 sm:w-full md:w-2/3 lg:w-1/2 xl:w-1/3 bg-white p-6 sm:p-8 rounded-xl shadow-md snap-start transform transition-all duration-700 hover:scale-105 hover:shadow-xl delay-400 ${
        visibleElements['why-css-matters'] ? 'animate-fadeInUp' : 'opacity-0'
      }`}>
        <div className="w-full h-40 sm:h-48 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg mb-4 sm:mb-6 flex items-center justify-center">
          <span className="text-4xl">💰</span>
        </div>
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
          Strategic CSS tweaks to buttons, forms, and CTAs can increase conversion
          rates by 20-30%, directly impacting revenue and user
          engagement metrics.
        </p>
      </div>
      </div>
    </div>
  </div>
</section>

{/* Get Started Section */}
<section 
  id="get-started"
  data-animate
  className={`bg-blue-50 py-16 sm:py-20 md:py-22 px-4 sm:px-6 md:px-18 section-transition ${
    visibleElements['get-started'] ? 'section-visible' : 'section-hidden'
  }`}
>
  <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-8 sm:gap-12 lg:gap-18">

    {/* Left Content */}
    <div className="order-2 lg:order-1">
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 leading-snug">
        Get Started with <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">CSS Customization</span>
      </h2>
      <p className="text-gray-700 text-base sm:text-lg md:text-xl mb-8 sm:mb-10 max-w-xl">
        Optimize your website with AuraX's personalized CSS suggestions and real-time popups.
        Turn heatmap insights into practical design improvements and elevate your site's user experience.
      </p>

      {/* Icons Row */}
      <div className={`flex gap-3 sm:gap-4 mb-8 sm:mb-10 justify-center lg:justify-start transition-all duration-700 ${
        visibleElements['get-started'] ? 'animate-fadeInUp delay-300' : 'opacity-0'
      }`}>
        <div className="bg-[#dbf0fd] p-3 sm:p-4 rounded-lg shadow-sm transform transition-all duration-300 ease-out hover:scale-110 hover:shadow-md">
          <FiBell className="w-6 sm:w-8 h-6 sm:h-8 text-blue-500 transition-transform duration-300 ease-out hover:rotate-12" />
        </div>
        <div className="bg-[#e6ebfd] p-3 sm:p-4 rounded-lg shadow-sm transform transition-all duration-300 ease-out hover:scale-110 hover:shadow-md delay-100">
          <FiMonitor className="w-6 sm:w-8 h-6 sm:h-8 text-indigo-500 transition-transform duration-300 ease-out hover:rotate-12" />
        </div>
        <div className="bg-[#ebe6fd] p-3 sm:p-4 rounded-lg shadow-sm transform transition-all duration-300 ease-out hover:scale-110 hover:shadow-md delay-200">
          <FiUsers className="w-6 sm:w-8 h-6 sm:h-8 text-purple-500 transition-transform duration-300 ease-out hover:rotate-12" />
        </div>
      </div>

      {/* CTA Button */}
      <div className={`text-center lg:text-left transition-all duration-700 ${
        visibleElements['get-started'] ? 'animate-fadeInUp delay-500' : 'opacity-0'
      }`}>
        <button className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 rounded-md font-semibold text-lg shadow-md hover:opacity-90 transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg transform">
          Get Started
        </button>
      </div>
    </div>

    {/* Right Image */}
    <div className="order-1 lg:order-2 h-64 sm:h-96 md:h-[600px] lg:h-[800px] flex justify-center lg:justify-end -ml-0 sm:-ml-5 lg:-ml-10 xl:-ml-20">
      <img
        src="/iphones.png"
        alt="Mobile UI Screens"
        className="w-full h-full object-contain lg:object-cover drop-shadow-2xl transition-transform duration-700 ease-out hover:scale-105"
      />
    </div>

  </div>
</section>

<Footer />
</div>
  );
};

export default CSSCustomizationPage;