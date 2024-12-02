import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar1 from './Navbar1.js';

const CreateProjectPage = () => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [domain, setDomain] = useState('');
  const navigate = useNavigate();

  const handleSave = () => {
    console.log({ name, url, domain });
    navigate('/projects'); // Navigate back to the Projects page
  };

  const handleDelete = () => {
    console.log('Project deleted');
    navigate('/projects'); // Navigate back to the Projects page
  };

  return (
    <div className="bg-gradient-to-b from-indigo-100 to-violet-200">
      <Navbar1 />

      {/* Main Container */}
      <div className="flex flex-colx2 mt-9">
        {/* Left Section - Form */}
        <div className="w-1/2 flex items-center justify-center shadow-0g">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-semibold text-purple-600 mb-4">Get Started</h1>
            <p className="text-sm text-gray-500 mb-6">
              Project ID: <span className="font-semibold">8234127893</span>{' '}
              <button className="text-blue-500 underline">Copy</button>
            </p>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  placeholder="Enter project name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mt-1 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Website URL</label>
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full mt-1 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Domain</label>
                <input
                  type="text"
                  placeholder="Enter domain"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full mt-1 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-5 py-2 text-indigo-600 border border-indigo-600 rounded hover:bg-indigo-50 transition duration-300"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-5 py-2 text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded hover:from-blue-600 hover:to-purple-600 transition">
                  Delete this project
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Section - Background Illustration */}
      
        <div className="flex flex-col items-center mt-1">
          <img
            src="computer.png"
            alt="Illustration of Animals"
            className="mb-8"
            style={{
              width: '679px', 
              height: '495px', 
            }}/>
          </div>
        </div>
      </div>
  );
};

export default CreateProjectPage;
