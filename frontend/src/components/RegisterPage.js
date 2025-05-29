import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [formAnimated, setFormAnimated] = useState(false);
  const navigate = useNavigate();

  // Page loading animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoaded(true);
      setTimeout(() => setFormAnimated(true), 200);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!email || !password) {
      setError('Both email and password are required.');
      setLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('https://aura-x.up.railway.app/api/auth/signup', { email, password });
      console.log('Registration response:', response.data);
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        navigate('/login');
      }, 3000);
    } catch (error) {
      setLoading(false);
      if (error.response) {
        if (error.response.status === 400) {
          setError(error.response.data.message || 'Registration failed. Please try again.');
        } else if (error.response.status === 500) {
          setError('Server error. Please try again later.');
        } else {
          setError(error.response.data.message || 'Something went wrong. Please try again.');
        }
      } else if (error.request) {
        setError('No response from server. Please check your network connection.');
      } else {
        setError(`Error: ${error.message}`);
      }
    }
  };

  // Loading Spinner Component
  const LoadingSpinner = () => (
    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
  );

  // Page Loading Overlay
  if (!pageLoaded) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center z-50">
        <div className="text-center relative">
          {/* Animated background circles */}
          <div className="absolute inset-0 -m-20">
            <div className="absolute top-0 left-0 w-40 h-40 bg-purple-500/20 rounded-full animate-ping animation-delay-1000"></div>
            <div className="absolute top-10 right-0 w-32 h-32 bg-blue-500/20 rounded-full animate-ping animation-delay-2000"></div>
            <div className="absolute bottom-0 left-10 w-36 h-36 bg-pink-500/20 rounded-full animate-ping animation-delay-3000"></div>
          </div>
          
          {/* Main loading content */}
          <div className="relative z-10">
            <div className="mb-8">
              {/* Rotating logo container */}
              <div className="relative w-28 h-28 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded-2xl animate-spin-slow"></div>
                <div className="absolute inset-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">AX</span>
                </div>
              </div>
              
              {/* Brand text */}
              <h1 className="text-3xl font-bold text-white mb-2 animate-pulse">
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  AuraX
                </span>
              </h1>
              <p className="text-purple-200 text-sm animate-pulse">
                Setting up your journey...
              </p>
            </div>
            
            {/* Loading progress bar */}
            <div className="w-64 h-2 bg-purple-900/50 rounded-full mx-auto mb-6 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-loading-bar"></div>
            </div>
            
            {/* Floating particles */}
            <div className="flex justify-center space-x-3">
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-float animation-delay-0"></div>
              <div className="w-3 h-3 bg-pink-400 rounded-full animate-float animation-delay-500"></div>
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-float animation-delay-1000"></div>
              <div className="w-3 h-3 bg-indigo-400 rounded-full animate-float animation-delay-1500"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex justify-center items-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-200 via-pink-100 to-blue-200 overflow-hidden">
      {/* Loading overlay during form submission */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center shadow-2xl animate-pulse">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mb-4"></div>
            <p className="text-purple-700 font-medium">Creating your account...</p>
          </div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: formAnimated ? 1 : 0, y: formAnimated ? 0 : 50 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col lg:flex-row max-w-6xl w-full bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/50"
      >
        {/* Form Section */}
        <div className="flex-1 p-6 sm:p-8 lg:p-12">
          <div className={`text-center mb-6 sm:mb-8 transition-all duration-500 delay-300 ${
            formAnimated ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <Link to="/" className="inline-block group">
              <div className="relative">
                <img
                  src="Logo2.png"
                  alt="AuraX Logo"
                  className="mx-auto w-20 sm:w-24 lg:w-28 mb-4 transition-transform duration-300 group-hover:scale-110 drop-shadow-lg"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden mx-auto w-20 sm:w-24 lg:w-28 h-20 sm:h-24 lg:h-28 mb-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl items-center justify-center shadow-xl">
                  <span className="text-white font-bold text-lg sm:text-xl lg:text-2xl">AX</span>
                </div>
              </div>
            </Link>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent">
              Join AuraX Today
            </h3>
            <p className="text-sm sm:text-base text-purple-600 mt-2 opacity-80">
              Create your account and start building amazing projects
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Google Sign Up Button */}
            <div className={`transition-all duration-500 delay-400 ${
              formAnimated ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              <motion.button
                whileTap={{ scale: 0.98 }}
                whileHover={{ scale: 1.02 }}
                type="button"
                disabled={loading}
                className="group flex items-center justify-center w-full py-3 sm:py-3.5 border-2 border-purple-300 rounded-xl text-gray-700 font-semibold hover:bg-purple-50 hover:border-purple-400 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="w-5 h-5 mr-3 bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">G</span>
                </div>
                <span className="group-hover:text-purple-700 transition-colors duration-200">
                  Sign up with Google
                </span>
              </motion.button>
            </div>

            {/* Divider */}
            <div className={`flex items-center justify-center my-6 sm:my-8 transition-all duration-500 delay-500 ${
              formAnimated ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
              <span className="mx-4 text-xs sm:text-sm text-purple-600 bg-white px-3 py-1 rounded-full border border-purple-200">
                or sign up with email
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
            </div>

            {/* Email Input */}
            <div className={`transition-all duration-500 delay-600 ${
              formAnimated ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              <label className="block text-left text-sm sm:text-base font-medium text-purple-700 mb-2">
                Email Address
              </label>
              <div className="relative group">
                <input
                  type="email"
                  className="w-full p-3 sm:p-3.5 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 placeholder-purple-300 text-sm sm:text-base bg-white/80 backdrop-blur-sm"
                  placeholder="e.g. abc.jason@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-label="Email address"
                  disabled={loading}
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-focus-within:opacity-20 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            {/* Password Input */}
            <div className={`transition-all duration-500 delay-700 ${
              formAnimated ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              <label className="block text-left text-sm sm:text-base font-medium text-purple-700 mb-2">
                Password
              </label>
              <div className="relative group">
                <input
                  type="password"
                  className="w-full p-3 sm:p-3.5 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 placeholder-purple-300 text-sm sm:text-base bg-white/80 backdrop-blur-sm"
                  placeholder="Enter your password (min. 8 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-label="Password"
                  disabled={loading}
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-focus-within:opacity-20 transition-opacity duration-300 pointer-events-none"></div>
              </div>
              <p className="text-xs text-purple-500 mt-1 opacity-70">
                Password must be at least 8 characters long
              </p>
            </div>

            {/* Submit Button */}
            <div className={`transition-all duration-500 delay-800 ${
              formAnimated ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              <motion.button
                whileTap={{ scale: 0.98 }}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                type="submit"
                disabled={loading}
                className={`group relative w-full py-3 sm:py-4 mt-4 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-purple-500 text-white font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden ${
                  loading ? '' : 'transform hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-purple600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center">
                  {loading && <LoadingSpinner />}
                  {loading ? 'Creating Account...' : 'Create Account'}
                </div>
              </motion.button>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl animate-shake"
              >
                <p className="text-red-600 text-xs sm:text-sm font-medium text-center">{error}</p>
              </motion.div>
            )}

            {/* Login Link */}
            <div className={`text-center transition-all duration-500 delay-900 ${
              formAnimated ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              <p className="text-xs sm:text-sm text-purple-700 mt-4">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="font-semibold text-purple-600 hover:text-purple-800 hover:underline transition-all duration-200 transform hover:scale-105 inline-block"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Image Section - Hidden on mobile, visible on large screens */}
        <div className={`hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 relative overflow-hidden transition-all duration-700 delay-1000 ${
          formAnimated ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
        }`}>
          {/* Background decoration */}
          <div className="absolute inset-0">
            <div className="absolute top-10 right-10 w-32 h-32 bg-purple-200/30 rounded-full"></div>
            <div className="absolute bottom-20 left-10 w-24 h-24 bg-blue-200/30 rounded-full"></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-pink-200/30 rounded-full"></div>
          </div>
          
          <div className="relative z-10 text-center p-8">
            <img
              src={`${process.env.PUBLIC_URL}/Col.png`}
              alt="Welcome Illustration"
              className="max-h-[70vh] w-auto mx-auto drop-shadow-2xl transition-transform duration-300 hover:scale-105"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            {/* Fallback content */}
            <div className="hidden flex-col items-center justify-center h-96">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center mb-6">
                <span className="text-white text-4xl font-bold">✨</span>
              </div>
              <h3 className="text-2xl font-bold text-purple-700 mb-4">Welcome to AuraX</h3>
              <p className="text-purple-600 text-center max-w-md">
                Join thousands of users who are already building amazing projects with our platform.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Success Popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: "spring", damping: 15 }}
              className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl text-center relative max-w-md mx-auto border border-purple-100"
            >
              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
                aria-label="Close popup"
              >
                <span className="text-xl">&times;</span>
              </button>

              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg">
                <motion.svg
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", damping: 15 }}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="w-10 h-10 text-white"
                >
                  <path d="M12 0C5.4 0 0 5.4 0 12c0 6.6 5.4 12 12 12s12-5.4 12-12C24 5.4 18.6 0 12 0zm5.1 9.3l-6 6c-.3.3-.7.5-1.1.5-.4 0-.8-.2-1.1-.5l-3-3c-.3-.3-.3-.8 0-1.1s.8-.3 1.1 0l2.4 2.4 5.4-5.4c.3-.3.8-.3 1.1 0 .3.4.3.9-.1 1.1z" />
                </motion.svg>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
                  Welcome to AuraX! 🎉
                </h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  Your account has been created successfully! You'll be redirected to the login page shortly.
                </p>
              </motion.div>

              {/* Progress indicator */}
              <div className="mt-6 w-full bg-gray-200 rounded-full h-1">
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-1 rounded-full animate-progress"></div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        @keyframes loading-bar {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-loading-bar {
          animation: loading-bar 2s ease-in-out infinite;
        }
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 3s linear;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 2s ease-in-out infinite;
        }
        .animation-delay-0 { animation-delay: 0ms; }
        .animation-delay-500 { animation-delay: 500ms; }
        .animation-delay-1000 { animation-delay: 1000ms; }
        .animation-delay-1500 { animation-delay: 1500ms; }
        .animation-delay-2000 { animation-delay: 2000ms; }
        .animation-delay-3000 { animation-delay: 3000ms; }
      `}</style>
    </div>
  );
};

export default RegisterPage;