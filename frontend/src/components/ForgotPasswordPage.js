import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('https://aura-x.up.railway.app/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setEmailSent(true);
      } else {
        setError(data.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const LoadingSpinner = () => (
    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
  );

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-purple-200 via-pink-100 to-blue-200 p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm sm:max-w-md lg:max-w-lg p-6 sm:p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl text-center border border-white/50"
      >
        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6 sm:mb-8"
        >
          <Link to="/" className="inline-block group">
            <div className="relative group">
              <img
                src="Logo2.png"
                alt="AuraX Logo"
                className="mx-auto w-20 sm:w-24 md:w-28 mb-4 transition-transform duration-300 group-hover:scale-110 drop-shadow-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden mx-auto w-20 sm:w-24 md:w-28 h-20 sm:h-24 md:h-28 mb-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl items-center justify-center shadow-xl">
                <span className="text-white font-bold text-lg sm:text-xl">AX</span>
              </div>
            </div>
          </Link>
          
          {!emailSent ? (
            <>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent">
                Forgot Password?
              </h2>
              <p className="text-sm sm:text-base text-purple-600 mt-2 opacity-80">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Check Your Email
              </h2>
              <p className="text-sm sm:text-base text-purple-600 mt-2 opacity-80">
                We've sent password reset instructions to your email address.
              </p>
            </>
          )}
        </motion.div>

        {!emailSent ? (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Email Input */}
            <div className="text-left">
              <label className="block text-purple-700 font-medium text-sm sm:text-base mb-2">
                Email Address
              </label>
              <div className="relative group">
                <input
                  type="email"
                  className="w-full p-3 sm:p-3.5 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 placeholder-purple-300 text-sm sm:text-base bg-white/80 backdrop-blur-sm"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-focus-within:opacity-20 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              whileHover={{ scale: 1.02 }}
              type="submit"
              className="group relative w-full py-3 sm:py-4 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-purple-500 text-white font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 transform disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
              disabled={loading}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-center">
                {loading && <LoadingSpinner />}
                {loading ? 'Sending Reset Link...' : 'Send Reset Link'}
              </div>
            </motion.button>
          </motion.form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-green-700 text-sm">{message}</p>
            </div>
            
            <div className="text-sm text-purple-600 space-y-2">
              <p>Didn't receive the email? Check your spam folder.</p>
              <button
                onClick={() => {
                  setEmailSent(false);
                  setMessage('');
                  setEmail('');
                }}
                className="text-purple-600 hover:text-purple-800 hover:underline font-medium"
              >
                Try again with a different email
              </button>
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 sm:mt-6 p-3 bg-red-50 border border-red-200 rounded-xl"
          >
            <p className="text-red-600 text-xs sm:text-sm font-medium">{error}</p>
          </motion.div>
        )}

        {/* Back to Login Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-6 sm:mt-8"
        >
          <Link 
            to="/login" 
            className="inline-flex items-center text-sm text-purple-600 hover:text-purple-800 hover:underline transition-all duration-200 transform hover:scale-105"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Sign In
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;