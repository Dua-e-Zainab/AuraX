import React, { useState } from 'react';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom'; 

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); 
  const [loading, setLoading] = useState(false); 
  const [showPopup, setShowPopup] = useState(false); // Popup state
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic client-side validation
    if (!email || !password) {
      setError('Both email and password are required.');
      setLoading(false);
      return;
    }

    try {
      // Send POST request to backend signup endpoint
      const response = await axios.post('http://localhost:5000/api/auth/signup', { email, password });
    
      // Log response for debugging (optional)
      console.log('Registration response:', response.data);
    
      // Example: Use response data if needed
      if (response.data.message) {
        console.log('Server message:', response.data.message);
      }
    
      // Show success popup on successful registration
      setShowPopup(true); // Show the success popup
    
      // Close the popup and redirect to login page after 3 seconds
      setTimeout(() => {
        setShowPopup(false);
        navigate('/login');
      }, 3000);
    } catch (error) {
      setLoading(false);
      // Handle errors here, e.g. user already exists
      if (error.response) {
        setError(error.response.data.message || 'Something went wrong. Please try again.');
      } else {
        setError('Network error. Please check your connection and try again.');
      }
    } // <-- Closing brace for try-catch
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-200 to-blue-200">
      <div className="flex max-w-4xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Left section for the form */}
        <div className="flex-1 p-10">
          <div className="text-center mb-6">
            <img
              src={`${process.env.PUBLIC_URL}/Logo - AuraX 22.png`}
              alt="AuraX Logo"
              className="mx-auto w-32 mb-4"
            />
            <h3 className="text-2xl font-bold text-purple-700">Create your account</h3>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <button
              type="button"
              className="flex items-center justify-center w-full py-2 border border-purple-400 rounded text-gray-700 font-semibold hover:bg-gray-100 transition"
            >
              <img
                src="google.png"
                alt="Google Logo"
                className="w-5 h-5 mr-4"
              />
              Sign up with Google
            </button>
            <div className="flex items-center justify-center">
              <hr className="w-1/4 border-gray-300" />
              <span className="px-4 text-gray-500">or sign up with email</span>
              <hr className="w-1/4 border-gray-300" />
            </div>
            <div>
              <label className="block text-left text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                className="w-full p-3 mt-1 border border-purple-400 rounded focus:outline-none focus:ring focus:ring-purple-200"
                placeholder="e.g. abc.jason@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address"
              />
            </div>
            <div>
              <label className="block text-left text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                className="w-full p-3 mt-1 border border-purple-400 rounded focus:outline-none focus:ring focus:ring-purple-200"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-label="Password"
              />
            </div>
            <button
              type="submit"
              className={`w-full py-3 mt-4 rounded ${loading ? 'bg-gray-500' : 'bg-gradient-to-r from-blue-500 to-purple-500'} text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition`}
              disabled={loading} 
            >
              {loading ? 'Signing up...' : 'Submit'}
            </button>
            {error && (
              <p className="text-red-500 text-center mt-2">{error}</p> 
            )}
            <p className="text-center text-gray-600 mt-4">
              Already have an account?{' '}
              <a href="/login" className="text-purple-700 hover:underline font-medium">Log in</a>
            </p>
          </form>
        </div>

        {/* Right section for the image */}
        <div className="flex-1 hidden md:flex items-center justify-center bg-[#FFFFF]">
          <img
            src={`${process.env.PUBLIC_URL}/Col.png`}
            alt="Phone Illustration"
            className="max-h-[100%] w-auto"
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
              Registration successful! You can now log in and start exploring.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;
