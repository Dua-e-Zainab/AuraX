import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Google Sign-In Success Handler
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await response.json();
      console.log('Google Registration Response:', data);

      if (response.ok) {
        localStorage.setItem('token', data.token);
        alert(`Welcome, ${data.user.name}!`);
        navigate('/projects');
      } else {
        setError(data.message || 'Google sign-up failed. Please try again.');
      }
    } catch (err) {
      console.error('Error during Google sign-up:', err);
      setError('Something went wrong during Google sign-up.');
    }
  };

  const handleGoogleError = () => {
    setError('Google sign-up failed. Please try again.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!email || !password) {
      setError('Both email and password are required.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/projects');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId="39996397390-2kc07mu8fhl2pg32s99ata3u1punr2sq.apps.googleusercontent.com">
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-200 to-blue-200">
        <div className="flex max-w-4xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Left Section */}
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
              {/* Google Sign-Up Button */}
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                render={(renderProps) => (
                  <button
                    type="button"
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                    className="flex items-center justify-center w-full py-2 border border-purple-400 rounded text-gray-700 font-semibold hover:bg-gray-100 transition"
                  >
                    <img src="google.png" alt="Google Logo" className="w-5 h-5 mr-4" />
                    Sign up with Google
                  </button>
                )}
              />

              {/* Horizontal Divider */}
              <div className="flex items-center justify-center">
                <hr className="w-1/4 border-gray-300" />
                <span className="px-4 text-gray-500">or sign up with email</span>
                <hr className="w-1/4 border-gray-300" />
              </div>

              {/* Email Input */}
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

              {/* Password Input */}
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

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full py-3 mt-4 rounded ${loading ? 'bg-gray-500' : 'bg-gradient-to-r from-blue-500 to-purple-500'} text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition`}
                disabled={loading}
              >
                {loading ? 'Signing up...' : 'Submit'}
              </button>

              {error && <p className="text-red-500 text-center mt-2">{error}</p>}
              <p className="text-center text-gray-600 mt-4">
                Already have an account?{' '}
                <a href="/login" className="text-purple-700 hover:underline font-medium">
                  Log in
                </a>
              </p>
            </form>
          </div>

          {/* Right Section */}
          <div className="flex-1 hidden md:flex items-center justify-center bg-[#FFFFF]">
            <img src={`${process.env.PUBLIC_URL}/Col.png`} alt="Phone Illustration" className="max-h-[100%] w-auto" />
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default RegisterPage;
