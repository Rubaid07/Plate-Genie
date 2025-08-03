"use client";

import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../providers/AuthContext';

const GoogleLoginButton = () => {
  const { login } = useAuth();

  const googleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async codeResponse => {
      console.log('Authorization code:', codeResponse.code);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/google-login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code: codeResponse.code }),
        });

        const data = await response.json();
        console.log('Backend response:', data);

        if (response.ok) {
          login(data.user);
        } else {
          alert(`Login failed: ${data.message}`);
        }
      } catch (error) {
        console.error('Error sending code to backend:', error);
        alert('An error occurred during login.');
      }
    },
    onError: error => {
      console.log('Login Failed:', error);
      alert('Google login failed. Please try again.');
    }
  });

  return (
    <button
      onClick={() => googleLogin()}
      className="w-full mt-4 p-2 rounded-md font-bold transition-colors bg-blue-600 text-white hover:bg-blue-700"
    >
      Login with Google
    </button>
  );
};

export default GoogleLoginButton;
