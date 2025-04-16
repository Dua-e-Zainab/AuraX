import React from 'react';
import Navbar from './Navbar.js';
import Footer from './Footer';

const LandingPage = () => {
  return (
    <div className="font-sans bg-[#f4f7fe] text-gray-800">
      <Navbar />

{/* Hero Section */}
<section className="flex flex-col md:flex-row justify-between items-center py-16 px-12 md:px-28 bg-gradient-to-br from-purple-50 to-blue-100 rounded-b-3xl text-center md:text-left">
  <div className="flex-1 max-w-ug space-y-6 md:mr-10">
    <h1 className="text-5xl md:text-5xl leading-tight">
      <span className="text-purple-600 italic bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text font-bold">
        Welcome to AuraX:{" "}
      </span>
      <span className="text-gray-700 italic">Design</span>
      <span className="text-gray-700 font-semi-bold italic">
        <br />
        Smarter with User Data
      </span>
    </h1>
    <p className="text-lg text-gray-700">
      AuraX analyzes user interactions to reveal patterns and provide
      <br /> 
      design improvements,making your site both engaging and optimized 
      <br />
      for conversions.
    </p>
    <div className="flex flex-col md:flex-row gap-1">
      <input
        type="text"
        placeholder="Enter your website URL"
        className="p-5 w-full md:max-w-md border border-purple-300 rounded-l-full shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      <button className="px-8 py-3 bg-purple-600 text-white rounded-r-full shadow-lg hover:bg-purple-700 transition duration-300">
        Continue
      </button>
    </div>
    <a href="/register" className="text-purple-600 font-semibold hover:underline text-sm text-right pl-2">
      Register yourself →
    </a>
  </div>

  {/* Hero Image */}
  <div className="flex-1 max-w-lg md:ml-8">
    <img
      src="Desktop.png"
      alt="Placeholder"
      className="w-full max-w-md md:max-w-lg object-cover"
    />
  </div>
</section>


      {/* Auto-Scrolling Slider Section */}
      <section className="py-6 px-8 bg-white">
        <div className="flex overflow-x-hidden relative">
          <div className="flex items-center space-x-40 animate-scroll">
            <img src="smartfinder.png" alt="SmartFinder" className="h-12" />
            <img src="zoomer.png" alt="Zoomer" className="h-12" />
            <img src="shells.png" alt="Shells" className="h-12" />
            <img src="waves.png" alt="Waves" className="h-12" />
            <img src="artavenue.png" alt="ArtVenue" className="h-12" />
          </div>
        </div>
      </section>

{/* Why AuraX Section with Zigzag Left Layout */}
<section className="py-16 px-6 bg-blue-50">
  <div className="max-w-6xl mx-auto flex flex-col lg:flex-row-reverse items-center gap-12">
    {/* Text Content */}
    <div className="lg:max-w-md">
      <h2 className="text-4xl font-bold leading-relaxed text-purple-600 bg-gradient-to-b from-blue-500 to-purple-500 bg-clip-text text-transparent mb-6">Why AuraX?</h2>
      <p className="text-gray-700 text-lg leading-relaxed mb-6">
        AuraX helps you optimize your website by visualizing user behavior with heatmaps showing clicks, scrolls, and time spent. It also provides smart CSS design suggestions for better usability and engagement. By aligning your design with real user behavior, you can boost engagement, retention, and conversions through data-driven improvements.
      </p>
      <a href="/case-studies" className="inline-flex items-center text-purple-600 font-semibold hover:underline transition-colors text-lg">
        See how it helped others
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </a>
    </div>

{/* Zigzag Image Grid on Left - Compact */}
<div className="w-full relative h-[500px]">
  {/* Left image (lower) */}
  <div className="absolute left-0 bottom-0 w-[30%] h-[85%] bg-gray-200 rounded-xl shadow-lg overflow-hidden z-10">
    <img src="why1.png" alt="Heatmap visualization" className="w-full h-full object-cover" />
  </div>
  
  {/* Middle image (higher) */}
  <div className="absolute left-[35%] top-4 w-[30%] h-[85%] bg-gray-200 rounded-xl shadow-lg overflow-hidden z-20">
    <img src="why2.png" alt="User engagement metrics" className="w-full h-full object-cover" />
  </div>
  
  {/* Right image (lower) - moved to left side */}
  <div className="absolute left-[70%] bottom-0 w-[30%] h-[85%] bg-gray-200 rounded-xl shadow-lg overflow-hidden z-10">
    <img src="why3.png" alt="CSS suggestions" className="w-full h-full object-cover" />
  </div>
  
  {/* Decorative elements (optional) */}
  <div className="absolute -left-4 top-1/4 w-12 h-12 bg-purple-100 rounded-full opacity-20"></div>
  <div className="absolute -right-4 bottom-1/4 w-16 h-16 bg-blue-100 rounded-lg opacity-20"></div>
</div>

  </div>
</section>


{/* How It Works Section */}
<section className="py-12 px-8 bg-blue-50">
<h2 className="text-4xl font-bold text-center text-purple-600 bg-gradient-to-b from-blue-500 to-purple-500 bg-clip-text text-transparent">
  How it works
</h2>
  <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
    <div className="p-6 bg-white rounded-lg shadow-lg text-center border-2 border-blue-500 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,255,0.6)]">
      <div className="flex justify-center mb-3">
        {/* Icon for Track User Interaction */}
        <img src={`${process.env.PUBLIC_URL}/interaction.png`} alt="Track User Interaction" className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-semibold text-blue-600">Track User Interaction</h3>
      <p className="mt-2 text-gray-700">
        Collect real-time data on how visitors engage with your website.
      </p>
    </div>
    
    <div className="p-6 bg-white rounded-lg shadow-lg text-center border-2 border-blue-500  transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,255,0.6)]">
      <div className="flex justify-center mb-3">
        {/* Icon for Visualize with Heatmaps */}
        <img src={`${process.env.PUBLIC_URL}/git-branch.png`} alt="Visualize with Heatmaps" className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-semibold text-blue-600">Visualize with Heatmaps</h3>
      <p className="mt-2 text-gray-700">
        Get clear, visual representations of user activity, highlighting hot spots areas that need attention.
      </p>
    </div>
    
    <div className="p-6 bg-white rounded-lg shadow-lg text-center border-2 border-blue-500 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,255,0.6)]">
      <div className="flex justify-center mb-3">
        {/* Icon for Receive Actionable Insights */}
        <img src={`${process.env.PUBLIC_URL}/framer.png`} alt="Receive Actionable Insights" className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-semibold text-blue-600 ">Receive Actionable Insights</h3>
      <p className="mt-2 text-gray-700 ">
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
