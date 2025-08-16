// src/app/profile/page.jsx
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../providers/AuthContext';
import ProfileHeader from './components/ProfileHeader';
import MyRecipesSection from './components/MyRecipesSection';

export default function ProfilePage() {
  const { user, isLoggedIn, loading, login } = useAuth();
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    setMessage({ text: '', type: '' });
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-6 text-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg max-w-md w-full">
          <h3 className="text-lg font-medium text-red-800">Authentication Required</h3>
          <p className="text-red-600">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto lg:flex lg:justify-around min-h-[calc(100vh-64px)] md:my-8">
      {/* fixed profile sidebar */}
      <div className="hidden lg:block w-96 flex-shrink-0">
        <div className="sticky top-24 h-max overflow-y-auto">
          <ProfileHeader user={user} onProfileUpdate={login} />
        </div>
      </div>

      {/* mobile profile header */}
      <div className="lg:hidden w-full">
        <ProfileHeader user={user} onProfileUpdate={login} />
      </div>

      <div className="overflow-y-auto ">
        <div className="max-w-4xl mx-auto">
          <MyRecipesSection userId={user?.id} />
        </div>
      </div>
    </div>
  );
}