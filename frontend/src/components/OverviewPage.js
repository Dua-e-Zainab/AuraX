import React from "react";
import { useParams } from "react-router-dom";
import Navbar2 from "./Navbar2.js";

const OverviewPage = () => {
  const { id } = useParams(); // Capture project ID from URL

  return (
    <div className="bg-gradient-to-b from-purple-50 to-purple-100 min-h-screen text-gray-800">
      {/* Header Navigation */}
      <header className="bg-white shadow-md py-4 px-8 flex justify-between items-center">
        <Navbar2 />
      </header>

      {/* Main Content */}
      <main className="py-12 px-8 md:px-20">
        {/* Hero Section */}
        <section className="text-left mb-12">
          <h2 className="text-4xl font-bold text-purple-600">
            Welcome to AuraX - Project Overview
          </h2>
          <p className="text-lg text-gray-600 mt-4">
            Simply install the code on your website to enjoy all the features
            and data you need. Setup is fast and hassle-free!
          </p>
          <p className="text-lg text-gray-800 mt-2 font-semibold">
            Project ID: {id}
          </p>
        </section>

        {/* Tag Installation Box */}
        <section className="bg-white shadow-lg rounded-lg p-8 mb-12">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            Get started with tag installation
          </h3>
          <ol className="space-y-4">
            <li className="flex items-start">
              <span className="text-purple-600 font-bold text-lg mr-4">1</span>
              <div className="flex-1">
                <p className="font-medium text-gray-700">Copy this code</p>
                <div className="bg-gray-100 p-4 rounded-md mt-2 relative">
                  <pre className="text-sm text-gray-600 overflow-x-auto">
                    {`<script type="text/javascript">
  (function(a,u,r,a,x){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
  t=l.createElement(r);t.async=1;t.src="https://www.aurax.ms/tag/"+i;
  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window,document,"aurax","script","oc5w7q0866");
</script>`}
                  </pre>
                  <button className="absolute top-4 right-4 bg-purple-600 text-white text-sm px-4 py-2 rounded-md hover:bg-purple-700">
                    Copy to clipboard
                  </button>
                </div>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-purple-600 font-bold text-lg mr-4">2</span>
              <p className="text-gray-700">
                Add the snippet to the &lt;head&gt; of all the pages where you
                want to analyze user actions or collect responses.
              </p>
            </li>
          </ol>
        </section>

        {/* Features Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Heatmaps Card */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <img
            src={`${process.env.PUBLIC_URL}/maxim.png`}
            alt="Placeholder"
            className="w-full"/>
            
            <div className="p-6">
              <h4 className="text-purple-600 font-bold text-lg">Heatmaps</h4>
              <p className="text-gray-600 mt-2">
                Discover which sections of your page boost conversions and which
                elements hinder user experience with AuraX Heatmaps.
              </p>
            </div>
          </div>

          {/* Insights Card */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <img
              src={`${process.env.PUBLIC_URL}/maxim2.png`}
              alt="Insights"
              className="w-full"
            />

            <div className="p-6">
              <h4 className="text-purple-600 font-bold text-lg">Insights</h4>
              <p className="text-gray-600 mt-2">
                Insights provide a holistic view of your site's performance and
                highlight areas for optimization with AuraX CSS Customization.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            Common Questions
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-white shadow-md p-4 rounded-md">
              <p className="text-gray-700">
                Do I need coding knowledge to set up heatmap tracking on my
                site?
              </p>
              <button className="text-purple-600 font-bold text-lg">→</button>
            </div>
            <div className="flex justify-between items-center bg-white shadow-md p-4 rounded-md">
              <p className="text-gray-700">
                Will adding the tracking code affect my website's performance?
              </p>
              <button className="text-purple-600 font-bold text-lg">→</button>
            </div>
            <div className="flex justify-between items-center bg-white shadow-md p-4 rounded-md">
              <p className="text-gray-700">
                How do I install the tracking code on my website?
              </p>
              <button className="text-purple-600 font-bold text-lg">→</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default OverviewPage;
