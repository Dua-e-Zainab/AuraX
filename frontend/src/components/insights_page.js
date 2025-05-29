import React, { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      when: "beforeChildren"
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8 }
  }
};

const HeatmapDot = ({ x, y, intensity }) => {
  const size = 10 + intensity * 20;
  const opacity = 0.3 + intensity * 0.7;
  
  return (
    <motion.div
      className="absolute rounded-full bg-gradient-to-br from-yellow-400 to-red-600"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${size}px`,
        height: `${size}px`,
        opacity: opacity,
        filter: `blur(${intensity * 2}px)`
      }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ 
        duration: 0.5,
        delay: 0.1 + Math.random() * 0.3
      }}
    />
  );
};

const HeatmapOverlay = () => {
  const dots = Array.from({ length: 50 }).map((_, i) => ({
    x: Math.random() * 90 + 5,
    y: Math.random() * 70 + 15,
    intensity: Math.random()
  }));

  const clusters = [
    { x: 30, y: 40, count: 8 },
    { x: 65, y: 30, count: 6 },
    { x: 50, y: 60, count: 5 }
  ];

  clusters.forEach(cluster => {
    for (let i = 0; i < cluster.count; i++) {
      dots.push({
        x: cluster.x + (Math.random() - 0.5) * 15,
        y: cluster.y + (Math.random() - 0.5) * 15,
        intensity: 0.7 + Math.random() * 0.3
      });
    }
  });

  return (
    <div className="absolute inset-0 pointer-events-none">
      {dots.map((dot, i) => (
        <HeatmapDot key={i} x={dot.x} y={dot.y} intensity={dot.intensity} />
      ))}
    </div>
  );
};

const InsightsIntroPage = () => {
  const [activeTab, setActiveTab] = useState("heatmap");

  return (
    <div className="bg-white text-gray-800 font-sans overflow-x-hidden">
      <header>
        <Navbar />
      </header>

      {/* Enhanced Hero Section with Heatmap Visualization */}
      <motion.section 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="px-4 sm:px-6 lg:px-8 py-10 md:py-16 bg-blue-50 mt-10"
      >
        <div className="max-w-7xl mx-auto rounded-2xl overflow-hidden text-white min-h-[500px] md:min-h-[600px] flex items-center relative"
          style={{
            backgroundImage: "linear-gradient(to right, rgba(91, 33, 182, 0.8), rgba(29, 78, 216, 0.8)), url('/insight.png')",
          }}
        >
          {/* Heatmap overlay */}
          <HeatmapOverlay />
          
          {/* Website mockup */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
            <div className="bg-white/10 rounded-lg w-4/5 h-3/4 border-2 border-white/20 backdrop-blur-sm">
              <div className="p-4 border-b border-white/20">
                <div className="h-8 bg-white/20 rounded w-3/4"></div>
              </div>
              <div className="p-4 flex">
                <div className="w-1/4 space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-4 bg-white/20 rounded"></div>
                  ))}
                </div>
                <div className="w-3/4 pl-4">
                  <div className="h-64 bg-white/10 rounded-lg relative">
                    <motion.div 
                      whileHover={{ scale: 1.2 }}
                      className="absolute w-8 h-8 bg-red-500/50 rounded-full cursor-pointer"
                      style={{ top: '30%', left: '40%' }}
                    />
                    <motion.div 
                      whileHover={{ scale: 1.2 }}
                      className="absolute w-8 h-8 bg-red-500/50 rounded-full cursor-pointer"
                      style={{ top: '50%', left: '60%' }}
                    />
                    <motion.div 
                      whileHover={{ scale: 1.2 }}
                      className="absolute w-8 h-8 bg-red-500/50 rounded-full cursor-pointer"
                      style={{ top: '20%', left: '70%' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 md:px-12 lg:px-16 py-12 w-full relative z-10">
            <motion.div 
              variants={itemVariants}
              className="max-w-2xl bg-black/30 backdrop-blur-sm p-8 rounded-xl"
            >
              {/* Analysis type tabs */}
              <div className="flex mb-6 border-b border-white/20">
                {['heatmap', 'scrollmap', 'clickmap'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 font-medium text-sm capitalize ${activeTab === tab ? 'text-white border-b-2 border-purple-300' : 'text-white/60 hover:text-white'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <motion.h1 
                variants={itemVariants}
                className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight md:leading-snug"
              >
                <span className="block mb-2 md:mb-4">Visualize User Behavior</span>
                <span className="block text-2xl sm:text-3xl md:text-4xl font-normal opacity-90">
                  {activeTab === 'heatmap' && 'Heatmap analysis reveals engagement patterns'}
                  {activeTab === 'scrollmap' && 'Scroll depth shows content visibility'}
                  {activeTab === 'clickmap' && 'Click tracking identifies interaction hotspots'}
                </span>
              </motion.h1>

              <motion.div 
                variants={itemVariants}
                className="mt-8 md:mt-12 max-w-xl"
              >
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Enter your website URL"
                    className="px-5 py-3 rounded-full sm:rounded-l-full sm:rounded-r-none text-gray-800 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button className="bg-white text-purple-700 hover:bg-blue-100 transition-all duration-300 px-6 py-3 rounded-full sm:rounded-r-full sm:rounded-l-none font-semibold whitespace-nowrap transform hover:scale-[1.02] active:scale-[0.98]">
                    Analyze Now ›
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Key Insights Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-50"
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text mb-8 md:mb-12"
          >
            Key Insights from AuraX
          </motion.h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Top Interaction Areas", image: "/topinteraction.png" },
              { title: "Attention Patterns", image: "/attention.png" },
              { title: "CSS Suggestions", image: "/CSS.png" },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-white text-xl md:text-2xl mb-3">{item.title}</h3>
                  <p className="text-white opacity-90">
                    Egestas elit dui scelerisque ut eu purus aliquam vitae habitasse.
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Key Metrics Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeIn}
        className="bg-blue-50 w-full py-16 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left Content */}
            <div className="lg:w-1/2">
              <motion.h2 
                variants={itemVariants}
                className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text mb-6"
              >
                Key Metrics & Optimization Insights
              </motion.h2>
              <motion.p 
                variants={itemVariants}
                className="mb-8 text-gray-700 text-lg"
              >
                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
              </motion.p>
              <motion.div 
                variants={itemVariants}
                className="flex gap-3 flex-wrap"
              >
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-md font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]">
                  Refine Key Elements
                </button>
                <button className="px-5 py-2.5 rounded-md font-medium border border-gray-300 hover:border-purple-400 hover:bg-gray-50 transition-colors duration-300">
                  Boost User Engagement
                </button>
                <button className="px-5 py-2.5 rounded-md font-medium border border-gray-300 hover:border-purple-400 hover:bg-gray-50 transition-colors duration-300">
                  Improve UX
                </button>
              </motion.div>
            </div>

            {/* Right Image Box */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:w-[45%] w-full max-w-lg lg:max-w-none"
            >
              <img
                src="mobimg2.png"
                alt="Key Metrics Illustration"
                className="w-full h-auto rounded-xl object-contain shadow-lg"
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="bg-blue-50 py-16 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-5xl mx-auto text-center">
          <motion.h2 
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text mb-6"
          >
            Start Optimizing with AuraX Insights
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-gray-700 mb-8 text-lg"
          >
            Harness data-driven insights with AuraX and make impactful changes to your website. Understand your user's behavior, refine your design, and boost engagement effortlessly.
          </motion.p>
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-3 rounded-md font-semibold shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]">
              Get Started
            </button>
            <button className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white px-8 py-3 rounded-md font-semibold shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]">
              Request more info
            </button>
          </motion.div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
};

export default InsightsIntroPage;