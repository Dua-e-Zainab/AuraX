import React, { useState } from 'react';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, password });
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
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 mt-4 rounded bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition"
            >
              Submit
            </button>
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
    </div>
  );
};

export default RegisterPage;
