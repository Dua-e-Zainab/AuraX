import React, { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer"
import { FaMousePointer, FaChartLine, FaHandPointer } from "react-icons/fa";


const HeatmapIntroPage = () => {
  const [activeTab, setActiveTab] = useState("click");

  const tabItems = [
    { id: "click", label: "Identify Hotspots", image: "/improve.png" },
    { id: "scroll", label: "Optimize Navigation", image: "/navigation.png" },
    { id: "hover", label: "Improve UX", image: "/hotspots.png" },
  ];

  const activeImage = tabItems.find((tab) => tab.id === activeTab)?.image;

  return (
    <div className="bg-gray-50 text-gray-700">
      {/* Navbar */}
      <header><Navbar /></header>

      {/* Hero Section */}
<section className="p-10 md:p-20 bg-gradient-to-br from-purple-50 to-blue-100">
  <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-16">
    
    {/* Left: Text & Tabs */}
    <div className="md:w-[65%]">
      <h1 className="text-4xl md:text-6xl font-semi-bold text-gray-900 mb-12 leading-tight">
        Visualize
        <span className="text-purple-600 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text font-bold">
          {" "}User Interaction
        </span>
        <br /> in Real-Time
      </h1>

      <p className="italic text-gray-600 mt-6 font-semibold">What Are Heatmaps?</p>
      <p className="text-gray-500 mt-4 max-w-prose">
        Heatmaps provide a visual representation of user activity on your website. They show 
        where visitors click, scroll, hover, and engage, helping you understand how they interact 
        with your content.
      </p>

      {/* Tabs */}
      <div className="flex mt-8 space-x-4 flex-wrap">
        {tabItems.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 rounded shadow transition duration-300 ease-in-out transform
              ${
                activeTab === tab.id
                  ? "bg-purple-600 text-white shadow-lg scale-105"
                  : "bg-white text-gray-700 border hover:bg-gray-300"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>

    {/* Right: 3D Purple Cube Animation */}
    <div className="md:w-[45%] flex justify-center items-center translate-y-6">
      <div className="perspective-container">
        <div className="cube">
          <div className="face front"></div>
          <div className="face back"></div>
          <div className="face right"></div>
          <div className="face left"></div>
          <div className="face top"></div>
          <div className="face bottom"></div>
        </div>
      </div>
    </div>
  </div>

  {/* Bottom Heatmap Preview */}
  <div className="mt-24 w-full max-w-7xl mx-auto aspect-[18/8] bg-gray-300 rounded-md overflow-hidden flex items-center justify-center">
    <img src={activeImage} alt={activeTab} className="w-full h-full object-cover" />
  </div>
</section>



    {/* Types of Heatmaps */}
<section className="bg-blue-50 py-20 px-8 md:px-16 lg:px-28">
  <div className="max-w-7xl mx-auto pl-4 lg:pl-20">
    <h3 className="text-5xl font-semi-bold text-gray-800">
      Types of Heatmaps Available in <span className="text-purple-600 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text leading-tight font-bold">AuraX</span>
    </h3>

    <div className="space-y-10 mt-20">
      {[
        {
          title: "Click Heatmaps",
          desc: "Track where users click most often, revealing high-interest areas and potential design issues.",
          icon: <FaMousePointer size={28} />,
          bg: "bg-gray-200"
        },
        {
          title: "Scroll Heatmaps",
          desc: "Understand how far visitors scroll down your page and see where they lose interest.",
          icon: <FaChartLine size={28} />,
          bg: "bg-purple-600 text-white"
        },
        {
          title: "Hover Heatmaps",
          desc: "Visualize where users hover their cursor, helping identify points of interest.",
          icon: <FaHandPointer size={28} />,
          bg: "bg-gray-200"
        }
      ].map((item, index) => (
        <div key={index} className="flex items-start space-x-6 border-b pb-8">
          <div className={`p-4 rounded-md ${item.bg}`}>
            {item.icon}
          </div>
          <div>
            <h4 className="text-xl text-blue-600 font-bold mb-1">{item.title}</h4>
            <p className="text-lg text-gray-600">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>



{/* Benefits Section */}
<section className="bg-blue-50 relative overflow-hidden py-20">
  <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center">
    
    {/* Left Side - Image and Circle */}
    <div className="relative w-full md:w-5/12 flex justify-center items-center mb-12 md:mb-0">
      
      {/* Purple Semi-Circle */}
      <div className="absolute -left-48 top-1/2 transform -translate-y-1/2 w-[500px] h-[500px] bg-purple-500 rounded-full z-0"></div>

    {/* Placeholder Image Box */}
    <div className="relative z-10 w-80 h-[550px] rounded-2xl shadow-2xl overflow-hidden border-4 border-purple-300 bg-blue-100">
    <img 
        src="mobimg.png" 
        alt="Heatmap Visualization" 
        className="w-full h-full object-contain"
    />
    </div>

    </div>

    {/* Right Side - Text Content */}
    <div className="w-full md:w-7/12">
      <h3 className="text-5xl font-semi-bold text-gray-800 text-center md:text-left leading-snug">
        How Heatmaps Help You  <br></br><span className="font-bold text-purple-600 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text leading-tight">Optimize Your Website</span>
      </h3>

      <div className="grid sm:grid-cols-2 gap-6 mt-12">
        {[
          {
            icon: "💎",
            title: "Analyze Key Pages",
            desc: "View heatmap data for crucial pages like your homepage, product pages to identify where users are most engaged.",
          },
          {
            icon: "🏆",
            title: "Data-Driven Changes",
            desc: "Use heatmap insights to redesign layouts, adjust call-to-action (CTA) placements, and improve navigation.",
          },
          {
            icon: "📈",
            title: "Track Progress",
            desc: "Focus on the sections that matter most by identifying elements and optimizing them to increase user interaction.",
          },
          {
            icon: "🚀",
            title: "Prioritize High-Impact Areas",
            desc: "Focus on the sections that matter most by identifying elements and optimizing them to increase user interaction.",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-purple-50 hover:bg-purple-100 transition duration-300 ease-in-out p-5 rounded-xl shadow-md flex items-start gap-4"
          >
            <div className="text-3xl">{item.icon}</div>
            <div>
              <h4 className="font-semibold text-lg text-purple-700">{item.title}</h4>
              <p className="text-sm text-gray-700 mt-1">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>




{/* Call to Action Section */}
<section className="bg-blue-50 w-full py-24 px-6">
  <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
    
    {/* Left Content */}
    <div className="md:w-1/2">
      <h3 className="text-5xl font-semi-bold text-gray-700 leading-snug">
        Start Using <span className="font-bold text-purple-600 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text leading-tight">Heatmaps </span> 
       Today</h3>
      <p className="text-gray-700 mt-6 text-base leading-relaxed">
      Understand your users better and make smarter design choices 
      <br></br>
      with AuraX Heatmaps. 
      Gain real-time insights and optimize your
      <br></br> 
      website for engagement and conversions.
      </p>

      {/* Icons Row */}
      <div className="flex space-x-4 mt-6">
        {[
          { icon: "🔔", bg: "bg-blue-100", color: "text-blue-500" },
          { icon: "🖥️", bg: "bg-blue-100", color: "text-blue-500" },
          { icon: "👥", bg: "bg-blue-100", color: "text-purple-500" },
        ].map((item, index) => (
          <div
            key={index}
            className={`w-14 h-14 ${item.bg} rounded-lg flex items-center justify-center hover:scale-110 transition duration-300 shadow`}
          >
            <span className={`text-2xl ${item.color}`}>{item.icon}</span>
          </div>
        ))}
      </div>

      {/* CTA Button with gradient */}
      <button className="mt-8 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg shadow-lg transition duration-300 hover:from-blue-600 hover:to-purple-600">
        Get Started
      </button>
    </div>

        {/* Image Box */}
        <div className="md:w-1/2 flex justify-center md:justify-end relative">
        <div className="w-[540px] h-[440px] rounded-3xl overflow-hidden border-4 border-gray-300 shadow-2xl bg-white md:-mr-6">
            <img
            src="today.png" // Replace with actual path
            alt="Heatmap Preview"
            className="w-full h-full object-cover"
            />
        </div>
        </div>

  </div>
</section>


<Footer />

    </div>
  );
};

export default HeatmapIntroPage;
