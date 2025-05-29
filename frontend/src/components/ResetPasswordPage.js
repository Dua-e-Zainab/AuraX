import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  // const [userEmail, setUserEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Verify token on component mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setError('Invalid reset link. Please request a new password reset.');
        setVerifying(false);
        return;
      }

      try {
        const response = await fetch(`https://aura-x.up.railway.app/api/auth/verify-reset-token/${token}`);
        const data = await response.json();

        if (response.ok) {
          setTokenValid(true);
        } else {
          setError(data.message || 'Invalid or expired reset link.');
        }
      } catch (err) {
        console.error('Token verification error:', err);
        setError('Something went wrong. Please try again.');
      } finally {
        setVerifying(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Password validation
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://aura-x.up.railway.app/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(data.message || 'Failed to reset password. Please try again.');
      }
    } catch (err) {
      console.error('Reset password error:', err);
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const LoadingSpinner = () => (
    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
  );

  // Loading state while verifying token
  if (verifying) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-purple-200 via-pink-100 to-blue-200">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-purple-700 font-medium">Verifying reset link...</p>
        </div>
      </div>
    );
  }

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
          
          {!success ? (
            tokenValid ? (
              <>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent">
                  Reset Password
                </h2>
                <p className="text-sm sm:text-base text-purple-600 mt-2 opacity-80">
                  Enter your new password below
                </p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-red-400 to-red-600 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">
                  Invalid Link
                </h2>
                <p className="text-sm sm:text-base text-purple-600 mt-2 opacity-80">
                  This password reset link is invalid or has expired.
                </p>
              </>
            )
          ) : (
            <>
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Password Reset Successful!
              </h2>
              <p className="text-sm sm:text-base text-purple-600 mt-2 opacity-80">
                Your password has been updated successfully. Redirecting to login...
              </p>
            </>
          )}
        </motion.div>

        {tokenValid && !success ? (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* New Password Input */}
            <div className="text-left">
              <label className="block text-purple-700 font-medium text-sm sm:text-base mb-2">
                New Password
              </label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full p-3 sm:p-3.5 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 placeholder-purple-300 text-sm sm:text-base bg-white/80 backdrop-blur-sm pr-12"
                  placeholder="Enter new password (min. 6 characters)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={loading}
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-600 transition-colors duration-200"
                  disabled={loading}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showPassword ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L5.636 5.636m4.242 4.242L15.314 15.314m0 0L19.556 19.556" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    )}
                  </svg>
                </button>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-focus-within:opacity-20 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="text-left">
              <label className="block text-purple-700 font-medium text-sm sm:text-base mb-2">
                Confirm New Password
              </label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full p-3 sm:p-3.5 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 placeholder-purple-300 text-sm sm:text-base bg-white/80 backdrop-blur-sm"
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  minLength={6}
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-focus-within:opacity-20 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            {/* Password Strength Indicator */}
            {newPassword && (
              <div className="text-left">
                <div className="text-xs text-purple-600 mb-1">Password Strength:</div>
                <div className="flex space-x-1">
                  <div className={`h-2 flex-1 rounded ${newPassword.length >= 6 ? 'bg-green-400' : 'bg-gray-200'}`}></div>
                  <div className={`h-2 flex-1 rounded ${newPassword.length >= 8 ? 'bg-green-400' : 'bg-gray-200'}`}></div>
                  <div className={`h-2 flex-1 rounded ${/(?=.*[a-z])(?=.*[A-Z])/.test(newPassword) ? 'bg-green-400' : 'bg-gray-200'}`}></div>
                  <div className={`h-2 flex-1 rounded ${/(?=.*\d)/.test(newPassword) ? 'bg-green-400' : 'bg-gray-200'}`}></div>
                </div>
              </div>
            )}

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
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </div>
            </motion.button>
          </motion.form>
        ) : success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-green-700 text-sm">You will be redirected to the login page in a few seconds...</p>
            </div>
            
            <Link
              to="/login"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Go to Login Now
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <Link
              to="/forgot-password"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Request New Reset Link
            </Link>
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
        {!success && (
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
        )}
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;