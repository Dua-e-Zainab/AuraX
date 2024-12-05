import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, password, rememberMe });
    // Assuming login validation is successful
    navigate('/projects'); // Redirects to Project Page
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-purple-200 to-blue-200">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg text-center">
        <div className="mb-6">
          <img src={`${process.env.PUBLIC_URL}/Logo - AuraX 22.png`} alt="AuraX Logo" className="mx-auto w-32 mb-4" />
          <h2 className="text-2xl font-bold text-purple-700">Log in</h2>
        </div>
        <form onSubmit={handleSubmit}>
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
          <div className="flex items-center justify-center mt-6 mb-4">
            <hr className="flex-1 border-t border-purple-400" />
            <span className="mx-4 text-purple-600">or signup with email</span>
            <hr className="flex-1 border-t border-purple-400" />
          </div>
          <div className="mb-4 text-left">
            <label className="block text-purple-700 font-medium">Email Address</label>
            <input
              type="email"
              className="w-full mt-2 p-2 border border-purple-400 rounded focus:outline-none focus:ring focus:ring-purple-300"
              placeholder="e.g. abc.jason@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              Remember my password
            </label>
            <Link to="/forgot-password" className="hover:underline">Forgot password?</Link>
          </div>
          <button
            type="submit"
            className="w-full py-3 mt-4 rounded bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition"
          >
            Submit
          </button>
        </form>
        <p className="mt-6 text-sm text-purple-700">
          Don’t have an account? <Link to="/register" className="font-semibold hover:underline">Register yourself now</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;