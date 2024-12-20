import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const GoogleLoginComponent = () => {
  // Use environment variable for client ID
  // const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  const handleSuccess = async (credentialResponse) => {
    console.log('Google Login Success:', credentialResponse);

    try {
      // Send the token to the server for verification
      const response = await fetch('http://localhost:5000/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await response.json();
      console.log('Backend Verification:', data);

      if (data.user) {
        alert(`Welcome ${data.user.name}!`);
        // Optionally, save user info in localStorage or redirect
      } else {
        alert('Token verification failed');
      }
    } catch (error) {
      console.error('Error during backend verification:', error);
      alert('There was an error verifying your login.');
    }
  };

  const handleError = () => {
    console.log('Google Login Failed');
    alert('Login Failed. Please try again.');
  };

  return (
    <GoogleOAuthProvider clientId="39996397390-2kc07mu8fhl2pg32s99ata3u1punr2sq.apps.googleusercontent.com">
      <div className="w-full flex justify-center mt-6">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginComponent;