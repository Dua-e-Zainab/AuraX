import React from "react";
import Navbar from './Navbar.js';
import Footer from './Footer.js';
import { FiBell, FiMonitor, FiUsers } from "react-icons/fi";

const CSSCustomizationPage = () => {
  return (
    <div className="bg-gray-50 text-gray-800">
    <header>
        <Navbar/>
    </header>

{/* Hero Section */}
<section className="py-28 px-6 md:px-20 bg-gradient-to-br from-purple-50 to-blue-100 overflow-hidden">

  {/* Left Bands */}
  <div className="absolute bottom-0 left-[-60px] z-0">
    {/* Gray Band */}
    <div className="w-72 h-10 bg-[#e1e5f0] transform -rotate-6 origin-left mb-1"></div>
    {/* Blue Band */}
    <div className="w-72 h-10 bg-[#c9eaf7] transform -rotate-6 origin-left"></div>
  </div>

  {/* Right Bands */}
  <div className="absolute bottom-0 right-[-60px] z-0">
    {/* Blue Band */}
    <div className="w-72 h-10 bg-[#c9eaf7] transform -rotate-6 origin-right mb-2"></div>
    {/* Gray Band */}
    <div className="w-72 h-10 bg-[#e1e5f0] transform -rotate-6 origin-right"></div>
  </div>

  {/* Hero Content */}
  <div className="relative z-10 w-full">
    <div className="max-w-full text-left">
      <h1 className="text-4xl md:text-6xl font-semi-bold text-gray-900 mb-6 leading-tight">
        CSS Customization for Tailored <br />
        <span className="text-purple-600 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text font-bold">
          Design Enhancements
        </span>
      </h1>

      <p className="text-lg text-gray-600 mb-10 max-w-4xl">
        AuraX goes beyond visualizing user behavior, offering personalized CSS suggestions to boost
        usability and performance. By leveraging heatmap insights, we deliver actionable design
        improvements, optimizing your site's aesthetics and user experience.
      </p>

      {/* Buttons */}
      <div className="flex items-center space-x-5">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md shadow-md transition duration-200">
          Get Started
        </button>
        <a
          href="https://www.youtube.com/watch?v=NMSq1LhDatY"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-blue-600 font-medium hover:underline"
        >
          <svg
            className="w-5 h-5 mr-1"
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
<section className="py-24 bg-blue-50 text-center">
  <h2 className="text-4xl font-bold text bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text mb-6">How It Works</h2>
  <p className="text-gray-600 max-w-2xl mx-auto mb-16">
    Lorem ipsum is common placeholder text used to demonstrate the graphic elements of a document or visual presentation.
  </p>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto">
    {/* Step 1 */}
    <div>
      <div className="flex justify-center mb-4">
        <img src="/bfi1.png" alt="Icon 1" className="w-8 h-8" />
      </div>
      <h3 className="text-2g font-bold text-purple-600 mb-2">Analyze Heatmaps</h3>
      <p className="text-gray-600 max-w-xs mx-auto">
        After reviewing your heatmap data, AuraX identifies areas of improvement, from unclicked CTAs to underutilized page sections.
      </p>
    </div>

    {/* Step 2 */}
    <div>
      <div className="flex justify-center mb-4">
        <img src="/bfi2.png" alt="Icon 2" className="w-8 h-8" />
      </div>
      <h3 className="text-2g font-bold text-purple-600 mb-2">CSS Suggestions</h3>
      <p className="text-gray-600 max-w-xs mx-auto">
        AuraX offers custom CSS snippets to improve button placement, layout, readability, and navigation for better user site usability and experience.
      </p>
    </div>

    {/* Step 3 */}
    <div>
      <div className="flex justify-center mb-4">
        <img src="/bfi2.png" alt="Icon 3" className="w-8 h-8" />
      </div>
      <h3 className="text-2g font-bold text-purple-600 mb-2">Smart CSS Popups</h3>
      <p className="text-gray-600 max-w-xs mx-auto">
        If heatmaps show usability issues, smart popups alert you with instant recommendations to resolve them before they affect site performance.
      </p>
    </div>
  </div>
</section>


     {/* Examples of CSS Recommendations */}
<section className="bg-blue-50 py-16 px-4">
  <div className="max-w-6xl mx-auto">
    <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text mb-12">Examples of CSS Recommendations</h2>
    <div className="text-center mb-8">
      <p className="text-lg text-gray-600">Here's how AuraX can help you refine your website's design:</p>
    </div>
    
    <div className="relative bg-white p-8 rounded-lg shadow-md border-2 border-purple-400/50 ">
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-lg">
      </div>
      
      <h3 className="text-2xl font-bold mb-4 relative z-10">Call-to-Action Buttons</h3>
      <p className="text-gray-600 mb-6 relative z-10">
        Your main CTA button isn't getting enough clicks. Consider<br />
        increasing the size and changing the color to something more<br />
        attention-grabbing.
      </p>
      <div className="flex justify-center space-x-6 relative z-10">
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors">
          Buy Tickets
        </button>
        <button className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg text-lg font-medium hover:bg-gray-300 transition-colors">
          Event Details
        </button>
      </div>
    </div>
  </div>
</section>

  {/* Why CSS Customization Matters */}
  <section className="py-16 px-4 bg-blue-50">
    <div className="max-w-7xl mx-auto">
      <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text mb-12">Why CSS Customization Matters</h2>
      
      <div className="relative">
        {/* Navigation Arrows - Left */}
        <button 
          onClick={() => {
            const container = document.querySelector('.slider-container');
            container.scrollBy({ left: -container.offsetWidth, behavior: 'smooth' });
          }}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-md hover:bg-gray-100 transition-colors -ml-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        {/* Navigation Arrows - Right */}
        <button 
          onClick={() => {
            const container = document.querySelector('.slider-container');
            container.scrollBy({ left: container.offsetWidth, behavior: 'smooth' });
          }}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-md hover:bg-gray-100 transition-colors -mr-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Content Slider */}
        <div className="slider-container flex overflow-x-auto snap-x snap-mandatory scroll-smooth space-x-8 pb-4 -mx-4 px-4" style={{ scrollbarWidth: 'none' }}>
          {/* Hide scrollbar */}
          <style jsx>{`
            .slider-container::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          
      {/* Slide 1 */}
  <div className="flex-shrink-0 w-full md:w-2/3 lg:w-1/2 xl:w-1/3 bg-white p-8 rounded-xl shadow-md snap-start">
    <img 
      src="/spline2.png" 
      alt="UI Layout Example"
      className="w-full h-48 object-cover rounded-lg mb-6"
      loading="lazy"
    />
    <p className="text-lg text-gray-600 leading-relaxed">
      Well-placed buttons, clear calls to action, and optimized layouts encourage users to interact with your content.
    </p>
  </div>

  {/* Slide 2 */}
  <div className="flex-shrink-0 w-full md:w-2/3 lg:w-1/2 xl:w-1/3 bg-white p-8 rounded-xl shadow-md snap-start">
    <img 
      src="/spline2.png" 
      alt="Before/After Comparison"
      className="w-full h-48 object-cover rounded-lg mb-6"
      loading="lazy"
    />
    <p className="text-lg text-gray-600 leading-relaxed">
      Small design tweaks can drastically improve usability, making your site easier to navigate.
    </p>
  </div>

  {/* Slide 3 */}
  <div className="flex-shrink-0 w-full md:w-2/3 lg:w-1/2 xl:w-1/3 bg-white p-8 rounded-xl shadow-md snap-start">
    <img 
      src="/spline2.png" 
      alt="Conversion Funnel Visualization"
      className="w-full h-48 object-cover rounded-lg mb-6"
      loading="lazy"
    />
    <p className="text-lg text-gray-600 leading-relaxed">
      By following AuraX's CSS suggestions, you can reduce friction points and guide users smoothly toward conversions.
    </p>
  </div>

  {/* Slide 4 */}
  <div className="flex-shrink-0 w-full md:w-2/3 lg:w-1/2 xl:w-1/3 bg-white p-8 rounded-xl shadow-md snap-start">
    <img 
      src="/spline2.png" 
      alt="Code Structure Diagram"
      className="w-full h-48 object-cover rounded-lg mb-6"
      loading="lazy"
    />
    <p className="text-lg text-gray-600 leading-relaxed">
      Well-structured custom CSS is easier to maintain and scale than
      overriding framework styles, reducing technical debt as your
      project grows in complexity.
    </p>
  </div>

  {/* Slide 5 */}
  <div className="flex-shrink-0 w-full md:w-2/3 lg:w-1/2 xl:w-1/3 bg-white p-8 rounded-xl shadow-md snap-start">
    <img 
      src="/spline2.png" 
      alt="Conversion Metrics Chart"
      className="w-full h-48 object-cover rounded-lg mb-6"
      loading="lazy"
    />
    <p className="text-lg text-gray-600 leading-relaxed">
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
<section className="bg-blue-50 py-22 px-6 md:px-18">
  <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-18">

    {/* Left Content */}
    <div>
      <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-snug">
        Get Started with <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text ">CSS Customization</span>
      </h2>
      <p className="text-gray-700 text-lg md:text-xl mb-10 max-w-xl">
        Optimize your website with AuraX’s personalized CSS suggestions and real-time popups.
        Turn heatmap insights into practical design improvements and elevate your site’s user experience.
      </p>

      {/* Icons Row */}
      <div className="flex gap-4 mb-10">
        <div className="bg-[#dbf0fd] p-4 rounded-lg shadow-sm">
          <FiBell className="w-8 h-8 text-blue-500" />
        </div>
        <div className="bg-[#e6ebfd] p-4 rounded-lg shadow-sm">
          <FiMonitor className="w-8 h-8 text-indigo-500" />
        </div>
        <div className="bg-[#ebe6fd] p-4 rounded-lg shadow-sm">
          <FiUsers className="w-8 h-8 text-purple-500" />
        </div>
      </div>

      {/* CTA Button */}
      <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 rounded-md font-semibold text-lg shadow-md hover:opacity-90 transition">
        Get Started
      </button>
    </div>

        <div className="h-[800px] flex justify-left lg:justify-end -ml-10 lg:-ml-20">
      <img
        src="/iphones.png"
        alt="Mobile UI Screens"
        className="w-full h-full object-cover drop-shadow-2xl"
      />
    </div>




  </div>
</section>



      <Footer />
    </div>
  );
};

export default CSSCustomizationPage;
