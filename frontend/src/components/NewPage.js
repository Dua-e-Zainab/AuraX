import React from 'react';
import Navbar3 from './Navbar3.js';
import Footer from './Footer.js';

const LandingPage = () => {
  return (
    <div className="font-sans bg-[#f4f7fe] text-gray-800">
      <Navbar3 />

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row justify-between items-center py-16 px-8 md:px-20 bg-gradient-to-br from-purple-50 to-blue-100 rounded-b-3xl text-center md:text-left">
        <div className="flex-1 max-w-ug space-y-6 md:mr-8">
          <h1 className="text-4xl md:text-5xl font-bold text-purple-600 leading-tight">
            Welcome to AuraX: Design Smarter with User Data
          </h1>
          <p className="text-lg text-gray-700">
            AuraX analyzes user interactions to reveal patterns and provide design improvements,
            making your site both engaging and optimized for conversions.
          </p>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Enter your website URL"
              className="p-3 flex-1 border border-purple-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button className="px-8 py-3 bg-purple-600 text-white rounded-md shadow-lg hover:bg-purple-700 transition duration-300">
              Continue
            </button>
          </div>
          <a href="/register" className="text-purple-600 font-semibold hover:underline text-sm">
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

      {/* Why AuraX Section */}
      <section className="py-12 px-8 bg-blue-50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-12">
          <div className="grid grid-cols-3 gap-4">
            <img src="why1.png" alt="Team 1" className="rounded-lg shadow-md" />
            <img src="why2.png" alt="Team 2" className="rounded-lg shadow-md" />
            <img src="why3.png" alt="Team 3" className="rounded-lg shadow-md" />
          </div>
          <div className="max-w-md">
            <h2 className="text-3xl font-bold text-purple-600">Why AuraX?</h2>
            <p className="mt-4 text-gray-700 leading-relaxed">
              AuraX helps you optimize your website by visualizing user behavior with heatmaps showing clicks,
              scrolls, and time spent. It also provides smart CSS design suggestions for better usability and
              engagement.
            </p>
            <a href="/" className="text-purple-600 font-semibold hover:underline mt-4 block">
              See how it helped others →
            </a>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 px-8 bg-blue-50">
        <h2 className="text-3xl font-bold text-center text-purple-600">How It Works</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="p-6 bg-white rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold text-purple-600">Track User Interaction</h3>
            <p className="mt-2 text-gray-700">
              Collect real-time data on how visitors engage with your website.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold text-purple-600">Visualize with Heatmaps</h3>
            <p className="mt-2 text-gray-700">
              Get clear, visual representations of user activity, highlighting hot spots.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold text-purple-600">Receive Actionable Insights</h3>
            <p className="mt-2 text-gray-700">
              AuraX offers personalized design suggestions that improve usability.
            </p>
          </div>
        </div>
      </section>

      {/* Who Should Use AuraX Section */}
      <section className="py-12 px-8 bg-blue-50">
        <h2 className="text-3xl font-bold text-center text-purple-600">Who Should Use AuraX?</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="text-center">
            <img src="who1.png" alt="Website Owners" className="rounded-lg shadow-md mb-4 mx-auto" />
            <h3 className="text-xl font-semibold">Website Owners</h3>
            <p className="text-gray-700 mt-2">
              For those managing websites, AuraX provides essential insights.
            </p>
          </div>
          <div className="text-center">
            <img src="who2.png" alt="E-commerce" className="rounded-lg shadow-md mb-4 mx-auto" />
            <h3 className="text-xl font-semibold">E-commerce</h3>
            <p className="text-gray-700 mt-2">
              Increase conversions by understanding customer interaction on your store.
            </p>
          </div>
          <div className="text-center">
            <img src="who3.png" alt="Content Creators" className="rounded-lg shadow-md mb-4 mx-auto" />
            <h3 className="text-xl font-semibold">Content Creators</h3>
            <p className="text-gray-700 mt-2">
              See how audiences engage with your content to refine your strategy.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
