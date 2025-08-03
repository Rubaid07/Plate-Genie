"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const EmailVerificationPage = () => {
  const [message, setMessage] = useState('Verifying your email...');
  const [isSuccess, setIsSuccess] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      if (!token) {
        setMessage('Verification link is invalid or missing token.');
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/verify-email?token=${token}`);
        const data = await response.json();

        if (response.ok) {
          setMessage(data.message);
          setIsSuccess(true);
        } else {
          setMessage(data.message || 'Failed to verify email. Please try again.');
        }
      } catch (error) {
        setMessage('An error occurred during verification. Please try again.');
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-card rounded-md shadow-md text-center">
      <h2 className="text-2xl font-bold mb-4 text-foreground">Email Verification</h2>
      <p className={`mt-4 text-lg ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>
        {message}
      </p>
      {isSuccess && (
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          You can now return to the <a href="/login" className="text-primary hover:underline">login page</a> to sign in.
        </p>
      )}
    </div>
  );
};

export default EmailVerificationPage;
