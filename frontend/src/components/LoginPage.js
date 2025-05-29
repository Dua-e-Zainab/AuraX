import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { motion, AnimatePresence } from 'framer-motion';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [formAnimated, setFormAnimated] = useState(false);

  // Page loading animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoaded(true);
      setTimeout(() => setFormAnimated(true), 200);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Load saved credentials if remember me was used
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedRememberMe = localStorage.getItem('rememberMe') === 'true';
    
    if (savedEmail && savedRememberMe) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // Handle Google Login Success
  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const response = await fetch('https://aura-x.up.railway.app/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        alert(`Welcome, ${data.user.name}!`);
        navigate('/projects');
      } else {
        setError(data.message || 'Google login failed. Please try again.');
      }
    } catch (err) {
      console.error('Error during Google login:', err);
      setError('Something went wrong during Google login.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google login failed. Please try again.');
  };

  // Handle Email/Password Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    const payload = { email, password, rememberMe }; 
    console.log('Sending payload to server:', payload); 

    try {
      const response = await fetch('https://aura-x.up.railway.app/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
      console.log('Response from server:', data); 

      if (response.ok) {
        // Store token
        localStorage.setItem('token', data.token);
        
        // Handle remember me functionality
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
          localStorage.setItem('rememberMe', 'true');
          // Set token expiration info
          const expirationTime = data.expiresIn === '30d' 
            ? Date.now() + (30 * 24 * 60 * 60 * 1000) 
            : Date.now() + (60 * 60 * 1000);
          localStorage.setItem('tokenExpiration', expirationTime.toString());
        } else {
          localStorage.removeItem('rememberedEmail');
          localStorage.removeItem('rememberMe');
          // Set short expiration for non-remember me
          const expirationTime = Date.now() + (60 * 60 * 1000); // 1 hour
          localStorage.setItem('tokenExpiration', expirationTime.toString());
        }
        
        navigate('/myprojects');
      } else {
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Error logging in:', err);
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
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
                Preparing your experience...
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
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center shadow-2xl animate-pulse">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mb-4"></div>
            <p className="text-purple-700 font-medium">Signing you in...</p>
          </div>
        </div>
      )}
      
      <div className="h-screen flex justify-center items-center bg-gradient-to-br from-purple-200 via-pink-100 to-blue-200 p-4 sm:p-6 lg:p-8 overflow-hidden">
        <div className={`w-full max-w-sm sm:max-w-md lg:max-w-lg p-6 sm:p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl text-center border border-white/50 transition-all duration-700 transform ${
          formAnimated ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
        }`}>
          
          {/* Logo Section */}
          <div className={`mb-6 sm:mb-8 transition-all duration-500 delay-300 ${
            formAnimated ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <Link to="/" className="inline-block group">
              <div className="relative group">
              <img
                src="Logo2.png"
                alt="AuraX Logo"
                className="mx-auto w-24 sm:w-28 md:w-32 mb-4 transition-transform duration-300 group-hover:scale-110 drop-shadow-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden mx-auto w-24 sm:w-28 md:w-32 h-24 sm:h-28 md:h-32 mb-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl items-center justify-center shadow-xl">
                <span className="text-white font-bold text-xl sm:text-2xl">AX</span>
              </div>
            </div>
            </Link>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="text-sm sm:text-base text-purple-600 mt-2 opacity-80">
              Sign in to continue to AuraX
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Google Sign In Button - CUSTOM STYLED */}
            <div className={`transition-all duration-500 delay-400 ${
              formAnimated ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              <div className="relative">
                {/* Hidden Google Login for functionality */}
                <div className="opacity-0 absolute inset-0">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    useOneTap={false}
                    theme="outline"
                    size="large"
                    width="100%"
                    text="signin_with"
                  />
                </div>
                
                {/* Your custom styled button */}
                <motion.div
                  whileTap={{ scale: 0.98 }}
                  whileHover={{ scale: 1.02 }}
                  className="group flex items-center justify-center w-full py-3 sm:py-3.5 border-2 border-purple-300 rounded-xl text-gray-700 font-semibold hover:bg-purple-50 hover:border-purple-400 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer pointer-events-none"
                >
                  <div className="w-5 h-5 mr-3 bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">G</span>
                  </div>
                  <span className="group-hover:text-purple-700 transition-colors duration-200">
                    {loading ? 'Signing in...' : 'Sign in with Google'}
                  </span>
                </motion.div>
              </div>
            </div>

            {/* Divider */}
            <div className={`flex items-center justify-center my-6 sm:my-8 transition-all duration-500 delay-500 ${
              formAnimated ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
              <span className="mx-4 text-xs sm:text-sm text-purple-600 bg-white px-3 py-1 rounded-full border border-purple-200">
                or continue with email
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
            </div>

            {/* Email Input */}
            <div className={`text-left transition-all duration-500 delay-600 ${
              formAnimated ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              <label className="block text-purple-700 font-medium text-sm sm:text-base mb-2">
                Email Address
              </label>
              <div className="relative group">
                <input
                  type="email"
                  className="w-full p-3 sm:p-3.5 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 placeholder-purple-300 text-sm sm:text-base bg-white/80 backdrop-blur-sm"
                  placeholder="e.g. abc.jason@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-focus-within:opacity-20 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            {/* Password Input */}
            <div className={`text-left transition-all duration-500 delay-700 ${
              formAnimated ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              <label className="block text-purple-700 font-medium text-sm sm:text-base mb-2">
                Password
              </label>
              <div className="relative group">
                <input
                  type="password"
                  className="w-full p-3 sm:p-3.5 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 placeholder-purple-300 text-sm sm:text-base bg-white/80 backdrop-blur-sm"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-focus-within:opacity-20 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 text-xs sm:text-sm text-purple-600 transition-all duration-500 delay-800 ${
              formAnimated ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="mr-2 w-4 h-4 text-purple-600 border-2 border-purple-300 rounded focus:ring-purple-500 focus:ring-2 transition-all duration-200"
                  disabled={loading}
                />
                <span className="group-hover:text-purple-800 transition-colors duration-200">
                  Remember me for 30 days
                </span>
              </label>
              <Link 
                to="/forgot-password" 
                className="text-purple-600 hover:text-purple-800 hover:underline transition-all duration-200 transform hover:scale-105"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`group relative w-full py-3 sm:py-4 mt-6 sm:mt-8 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-purple-500 text-white font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none overflow-hidden ${
                formAnimated ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
              style={{ transitionDelay: '900ms' }}
              disabled={loading}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-center">
                {loading && <LoadingSpinner />}
                {loading ? 'Signing in...' : 'Sign In'}
              </div>
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-4 sm:mt-6 p-3 bg-red-50 border border-red-200 rounded-xl animate-shake">
              <p className="text-red-600 text-xs sm:text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Register Link */}
          <div className={`mt-6 sm:mt-8 transition-all duration-500 delay-1000 ${
            formAnimated ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <p className="text-xs sm:text-sm text-purple-700">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="font-semibold text-purple-600 hover:text-purple-800 hover:underline transition-all duration-200 transform hover:scale-105 inline-block"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>

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
    </GoogleOAuthProvider>
  );
};

export default LoginPage;