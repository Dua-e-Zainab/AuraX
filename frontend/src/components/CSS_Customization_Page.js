import React from "react";
import Navbar from './Navbar.js';
import Footer from './Footer.js';

const CSS_Customization_Page = () => {
  return (
    <div className="bg-gray-50 text-gray-800">
    <header>
        <Navbar/>
    </header>
    {/* Hero Section */}
<section className="bg-gray-100 py-20 px-20">
  <div className="max-w-5xl text-left pl-8">
    <h1 className="text-6xl font-bold text-gray-900 mb-6">
      CSS Customization for Tailored <span className="text-purple-600">Design Enhancements</span>
    </h1>
    <p className="text-lg text-gray-600 mb-8">
      AuraX goes beyond visualizing user behavior, offering personalized CSS suggestions to boost usability and performanceBy leveraging heatmap insights, we deliver actionable design improvements, optimizing your site's aesthetics and user experience.
    </p>
    <div className="flex items-center space-x-4">
      <button className="bg-purple-600 text-white font-medium px-6 py-2 rounded shadow hover:bg-blue-700">
        Get Started
      </button>
      <button className="flex items-center space-x-2 text-purple-600 font-medium hover:underline">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-5.197-3.008A1 1 0 008 9.057v5.886a1 1 0 001.555.832l5.197-3.008a1 1 0 000-1.664z" />
        </svg>
        <span>Watch Video</span>
      </button>
    </div>
  </div>
        {/* Hero Image */}
        <div className="absolute left-0">
        <img
            src="leftband1.png"
            alt="Placeholder"
            className="w-full max-w-md md:max-w-lg object-cover"
        />
        <br></br>
        </div>
        <div className="absolute left-0">
        <img
            src="leftband2.png"
            alt="Placeholder"
            className="w-full max-w-md md:max-w-lg object-cover"
        />
        </div>
        </section>


      {/* How It Works */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-white shadow p-6 rounded text-center">
            <h3 className="font-bold text-xl mb-4">Analyze Heatmaps</h3>
            <p className="text-gray-600">Identify patterns through user interactions on your website.</p>
          </div>
          <div className="bg-white shadow p-6 rounded text-center">
            <h3 className="font-bold text-xl mb-4">CSS Suggestions</h3>
            <p className="text-gray-600">Receive tailored CSS suggestions for optimal user experience.</p>
          </div>
          <div className="bg-white shadow p-6 rounded text-center">
            <h3 className="font-bold text-xl mb-4">Smart CSS Popups</h3>
            <p className="text-gray-600">Implement suggestions quickly with pre-designed templates.</p>
          </div>
        </div>
      </section>

      {/* Examples of Recommendations */}
      <section className="bg-gray-100 py-16">
        <h2 className="text-3xl font-bold text-center mb-8">Examples of CSS Recommendations</h2>
        <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
          <h3 className="text-lg font-bold mb-2">Call-to-Action Buttons</h3>
          <p className="text-gray-600">
            "Your main CTA button isn't getting enough clicks. Consider increasing the size and changing the color to something more attention-grabbing."
          </p>
          <div className="mt-4 flex space-x-4 justify-center">
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Buy Tickets
            </button>
            <button className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">
              Event Details
            </button>
          </div>
        </div>
      </section>

      {/* Why CSS Customization Matters */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-8">Why CSS Customization Matters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-white shadow p-6 rounded text-center">
            <p className="text-gray-600">Well-placed buttons and calls to action increase user engagement.</p>
          </div>
          <div className="bg-white shadow p-6 rounded text-center">
            <p className="text-gray-600">Small design tweaks lead to significant performance boosts.</p>
          </div>
          <div className="bg-white shadow p-6 rounded text-center">
            <p className="text-gray-600">By following AIUX's CSS tips, achieve a smoother user journey.</p>
          </div>
        </div>
      </section>

      {/* Get Started Section */}
      <section className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-center py-16">
        <h2 className="text-3xl font-bold mb-4">Get Started with CSS Customization</h2>
        <p className="text-lg mb-6">
          Improve your website's aesthetics and user experience with our CSS suggestions.
        </p>
        <button className="bg-white text-blue-500 font-medium px-6 py-2 rounded hover:bg-gray-100">
          Get Started
        </button>
      </section>
      <Footer/>
    </div>
  );
};

export default CSS_Customization_Page;
