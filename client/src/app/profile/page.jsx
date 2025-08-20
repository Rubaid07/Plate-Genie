// src/app/profile/page.jsx
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../providers/AuthContext';
import ProfileHeader from './components/ProfileHeader';
import MyRecipesSection from './components/MyRecipesSection';
import SavedRecipesPage from './components/SavedRecipesPage';

export default function ProfilePage() {
  const { user, isLoggedIn, loading, login } = useAuth();
  const [message, setMessage] = useState({ text: '', type: '' });
  const [activeTab, setActiveTab] = useState('myRecipes');

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
    <div className="container mx-auto min-h-[calc(100vh-64px)]">
      {/* Profile Header (Top) */}
      <div className="w-full mb-6">
        <ProfileHeader user={user} onProfileUpdate={login} />
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 max-w-4xl mx-auto px-4">
          <button
            onClick={() => setActiveTab('myRecipes')}
            className={`py-4 px-1 font-medium text-sm border-b-2 transition-colors duration-200 ${
              activeTab === 'myRecipes'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Recipes
          </button>
          <button
            onClick={() => setActiveTab('savedRecipes')}
            className={`py-4 px-1 font-medium text-sm border-b-2 transition-colors duration-200 ${
              activeTab === 'savedRecipes'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Saved Recipes
          </button>
        </nav>
      </div>

      {/* Tabs Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {activeTab === 'myRecipes' ? (
          <MyRecipesSection userId={user?.id} />
        ) : (
          <SavedRecipesPage userId={user?.id} />
        )}
      </div>
    </div>
  );
}