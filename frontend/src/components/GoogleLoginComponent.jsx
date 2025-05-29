import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom'; // Add this if using React Router

const GoogleLoginComponent = () => {
  const navigate = useNavigate(); // Add this if using React Router

  const handleSuccess = async (credentialResponse) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await response.json();

      if (data.success) {
        // Save token and user data
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect based on new user status
        if (data.user.isNewUser) {
          navigate('/onboarding');
        } else {
          navigate('/dashboard');
        }
      } else {
        throw new Error(data.message || 'Authentication failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert(error.message);
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <div className="w-full flex justify-center mt-6">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => alert('Google login failed')}
          useOneTap // Optional: enables Google One Tap
        />
      </div>
    </GoogleOAuthProvider>
  );
};