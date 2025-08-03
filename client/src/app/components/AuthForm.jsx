"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import GoogleLoginButton from './GoogleLoginButton';
import { useAuth } from '../providers/AuthContext';

const AuthForm = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [userEmailForVerification, setUserEmailForVerification] = useState('');

  const { login } = useAuth();
  const router = useRouter();

  const handleRegistration = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/register`;
    const payload = { username, email, password };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setIsOtpSent(true);
        setUserEmailForVerification(email);
      } else {
        setMessage(data.message || 'Registration failed.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/login`;
    const payload = { email, password };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        if (data.user) {
          login(data.user);
        }
      } else {
        setMessage(data.message || 'Login failed.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/verify-otp`;
    const payload = { email: userEmailForVerification, otp };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        if (data.user) {
          login(data.user);
        }
      } else {
        setMessage(data.message || 'OTP verification failed.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    if (isOtpSent) {
      return (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Enter the OTP code sent to your email.
          </p>
          <div>
            <label className="block text-sm font-medium text-foreground">OTP Code</label>
            <input
              type="text"
              className="mt-1 p-2 w-full border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary p-2 rounded-md font-bold hover:bg-primary-dark disabled:opacity-50 transition-colors"
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
      );
    }

    return (
      <form onSubmit={isLoginMode ? handleLogin : handleRegistration} className="space-y-4">
        {!isLoginMode && (
          <div>
            <label className="block text-sm font-medium text-foreground">Username</label>
            <input
              type="text"
              className="mt-1 p-2 w-full border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-foreground">Email</label>
          <input
            type="email"
            className="mt-1 p-2 w-full border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground">Password</label>
          <input
            type="password"
            className="mt-1 p-2 w-full border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-primary p-2 rounded-md font-bold hover:bg-primary-dark disabled:opacity-50 transition-colors"
          disabled={loading}
        >
          {loading ? (isLoginMode ? 'Logging in...' : 'Registering...') : (isLoginMode ? 'Login' : 'Register')}
        </button>
      </form>
    );
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-card rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center text-foreground">
        {isLoginMode ? 'Login to your Account' : 'Create an Account'}
      </h2>
      
      {renderForm()}

      {message && (
        <p className={`mt-4 text-center ${message.includes('success') ? 'text-green-500' : 'text-red-500'}`}>
          {message}
        </p>
      )}

      {!isOtpSent && (
        <>
          <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-300 dark:border-gray-700" />
            <span className="mx-4 text-sm text-gray-500 dark:text-gray-400">OR</span>
            <hr className="flex-grow border-gray-300 dark:border-gray-700" />
          </div>

          <GoogleLoginButton />
          
          <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
            {isLoginMode ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => setIsLoginMode(!isLoginMode)}
              className="ml-1 text-primary hover:underline font-medium"
            >
              {isLoginMode ? 'Register' : 'Login'}
            </button>
          </p>
        </>
      )}
    </div>
  );
};

export default AuthForm;
