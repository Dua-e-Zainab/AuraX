import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle Google Login Success
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/google', {
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
  
    const payload = { email, password }; 
    console.log('Sending payload to server:', payload); 
  
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
      console.log('Response from server:', data); 
  
      if (response.ok) {
        localStorage.setItem('token', data.token);
        navigate('/projects');
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
  
  return (
    <GoogleOAuthProvider clientId="39996397390-2kc07mu8fhl2pg32s99ata3u1punr2sq.apps.googleusercontent.com">
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-purple-200 to-blue-200">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg text-center">
          {/* Logo */}
          <div className="mb-6">
            <img
              src={`${process.env.PUBLIC_URL}/Logo - AuraX 22.png`}
              alt="AuraX Logo"
              className="mx-auto w-32 mb-4"
            />
            <h2 className="text-2xl font-bold text-purple-700">Log in</h2>
          </div>

          {/* Google Login */}
          <div className="mb-6">
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center mb-4">
            <hr className="flex-1 border-t border-purple-400" />
            <span className="mx-4 text-purple-600">or login with email</span>
            <hr className="flex-1 border-t border-purple-400" />
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4 text-left">
              <label className="block text-purple-700 font-medium">Email Address</label>
              <input
                type="email"
                className="w-full mt-2 p-2 border border-purple-400 rounded focus:outline-none focus:ring focus:ring-purple-300"
                placeholder="e.g. abc.jason@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-4 text-left">
              <label className="block text-purple-700 font-medium">Password</label>
              <input
                type="password"
                className="w-full mt-2 p-2 border border-purple-400 rounded focus:outline-none focus:ring focus:ring-purple-300"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-between items-center mb-6 text-sm text-purple-600">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="mr-2"
                />
                Remember me
              </label>
              <Link to="/forgot-password" className="hover:underline">Forgot password?</Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-3 rounded bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition ${
                loading ? 'bg-gray-500 cursor-not-allowed' : ''
              }`}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Submit'}
            </button>
          </form>

          {/* Error Message */}
          {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}

          {/* Register Link */}
          <p className="mt-6 text-sm text-purple-700">
            Don’t have an account?{' '}
            <Link to="/register" className="font-semibold hover:underline">
              Register yourself now
            </Link>
          </p>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;