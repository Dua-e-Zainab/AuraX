import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar1 from './Navbar1.js';

const CreateProjectPage = () => {
  const [trackingCode, setTrackingCode] = useState('');
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [domain, setDomain] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); 
  const [showPopup, setShowPopup] = useState(false); 
  const navigate = useNavigate();

  const handleSave = async (e) => {
    e.preventDefault();

    if (!name || !url || !domain) {
      setErrorMessage('All fields are required.');
      return;
    }

    const projectData = { name, url, domain };

    console.log('Payload being sent to server:', projectData);

    try {
      const response = await fetch('http://localhost:5000/api/projects/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(projectData),
      });

      const data = await response.json();
      console.log('Server response:', data);

      if (response.ok) {
        setTrackingCode(data.trackingCode); 
        setShowPopup(true); 
      } else {
        setErrorMessage(data.message || 'Failed to create the project.');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
    }
  };

  const handleDelete = () => {
    if (!name) {
      setErrorMessage('Please create a project first before deleting.');
      return;
    }

    console.log('Project deleted');
    navigate('/projects'); 
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

            {/* Display Error Message */}
            {errorMessage && (
              <div className="text-red-600 mb-4 p-2 border border-red-600 bg-red-100 rounded">
                {errorMessage}
              </div>
            )}

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
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full mt-1 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select a domain</option>
                  <option value="Technology">Technology</option>
                  <option value="Health">Health</option>
                  <option value="Finance">Finance</option>
                  <option value="Beauty">Beauty</option>
                  <option value="Education">Education</option>
                </select>
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
            }}
          />
        </div>
      </div>

      {/* Custom Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center relative max-w-md mx-auto">
            {/* Close Button */}
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              aria-label="Close popup"
            >
              &times;
            </button>
    
            {/* Icon */}
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-purple-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-8 h-8 text-purple-600"
              >
                <path d="M12 0C5.4 0 0 5.4 0 12c0 6.6 5.4 12 12 12s12-5.4 12-12C24 5.4 18.6 0 12 0zm5.1 9.3l-6 6c-.3.3-.7.5-1.1.5-.4 0-.8-.2-1.1-.5l-3-3c-.3-.3-.3-.8 0-1.1s.8-.3 1.1 0l2.4 2.4 5.4-5.4c.3-.3.8-.3 1.1 0 .3.4.3.9-.1 1.1z" />
              </svg>
            </div>
    
            {/* Message */}
            <p className="text-gray-700 text-lg">
              Project created successfully! You can now view or manage your project.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateProjectPage;