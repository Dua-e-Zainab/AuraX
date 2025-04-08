import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const InsightsIntroPage = () => {
  return (
    <div className="bg-white text-gray-800 font-sans">
        <header>
            <Navbar/>
        </header>

{/* Hero Section Wrapper to give spacing from all sides */}
<div className="p-6 md:p-10 bg-blue-50">
  <section
    className="rounded-2xl overflow-hidden text-white mx-auto max-w-7xl min-h-[550px] flex items-center bg-cover bg-center bg-blue-50"
    style={{
      backgroundImage: "linear-gradient(to right, rgba(91, 33, 182, 0.8), rgba(29, 78, 216, 0.8)), url('/insight.png')",
    }}
  >
    {/* Content */}
    <div className="px-6 md:px-12 flex flex-col justify-center items-start text-left w-full">
    <h1 className="text-5xl md:text-6xl font-bold max-w-5xl">
      <span className="block mb-4">Insights</span>
      <span className="block mb-4">Analyze user behavior and</span>
      <span className="block mb-4">identify immediately actionable</span>
      <span className="block mb-4">data</span>
    </h1>

      {/* Input + Button Row */}
      <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-1">
        <input
          type="text"
          placeholder="Enter your website URL"
          className="px-5 py-3 rounded-l-full text-gray-800 w-full sm:w-[400px] focus:outline-none"
        />
        <button className="bg-white text-purple-700 hover:bg-blue-100 transition px-6 py-3 rounded-r-full font-semibold">
          Continue ›
        </button>
      </div>

      {/* Register Link */}
      <div className="mt-4">
        <a
          href="/register"
          className="text-sm underline hover:text-white transition"
        >
          Register yourself →
        </a>
      </div>
    </div>
  </section>
</div>





      {/* Key Insights Section */}
<section className="py-20 px-20 bg-blue-50">
  <h2 className="text-5xl font-bold leading-relaxed bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text mb-10">
  Key Insights from AuraX
</h2>
  <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
    {[
      { title: "Top Interaction Areas", image: "/topinteraction.png" },
      { title: "Attention Patterns", image: "/attention.png" },
      { title: "CSS Suggestions", image: "/CSS.png" },
    ].map((item, i) => (
      <div
        key={i}
        className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl overflow-hidden shadow hover:shadow-lg transition"
      >
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-70 object-cover"
        />
        <div className="p-4">
          <h3 className="font-bold text-white text-1g mb-2">{item.title}</h3>
          <p className="text-1xl text-gray-700 text-white">
            Egestas elit dui scelerisque ut eu purus aliquam <br/>vitae habitasse.
          </p>
        </div>
      </div>
    ))}
  </div>
</section>


{/* Key Metrics Section */}
<section className="bg-blue-50 w-full py-16 px-6">
  <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
    
    {/* Left Content */}
    <div className="md:w-1/2">
      <h2 className="text-5xl font-bold leading-snug bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text mb-6">
        Key Metrics & Optimization Insights
      </h2>
      <p className="mb-8 text-gray-700 text-lg">
        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
      </p>
      <div className="flex gap-3 flex-wrap">
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-md font-medium transition-colors">
          Refine Key Elements
        </button>
        <button className="px-5 py-2.5 rounded-md font-medium border border-gray-300 hover:border-purple-400 transition-colors">
          Boost User Engagement
        </button>
        <button className="px-5 py-2.5 rounded-md font-medium border border-gray-300 hover:border-purple-400 transition-colors">
          Improve UX
        </button>
      </div>
    </div>

    {/* Right Image Box */}
    <div className="md:w-[45%] h-[550px] mt-8 md:mt-0">
      <img
        src="mobimg2.png"
        alt="Key Metrics Illustration"
        className="w-full h-full rounded-xl  object-contain"
      />
    </div>
    
  </div>
</section>




{/* CTA Section */}
<section className="text-center py-20 px-20 bg-blue-50">
  <h2 className="text-5xl font-bold leading-relaxed  bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text mb-6">
    Start Optimizing with AuraX Insights
  </h2>
  <p className="text-gray-700 mb-8 max-w-4xl mx-auto">
    Harness data-driven insights with AuraX and make impactful changes to your website. Understand your user's behavior, <br />
    refine your design, and boost engagement effortlessly.
  </p>
  <div className="flex justify-center gap-4 flex-wrap">
    <button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-2 rounded-md font-semibold shadow">
      Get Started
    </button>
    <button className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white px-6 py-2 rounded-md font-semibold shadow">
      Request more info
    </button>
  </div>
</section>

      <Footer/>
    </div>
  );
};

export default InsightsIntroPage;