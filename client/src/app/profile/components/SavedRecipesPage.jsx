"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../../providers/AuthContext';
import { useRouter } from 'next/navigation';
import { Bookmark, Loader2 } from 'lucide-react';
import RecipeCard from './RecipeCard';

const SavedRecipesPage = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user?.id) {
      fetchSavedRecipes();
    }
  }, [user, authLoading, router]);

  const fetchSavedRecipes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/saved/${user.id}`);
      if (!response.ok) throw new Error('Failed to fetch saved recipes.');
      const data = await response.json();
      setSavedRecipes(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching saved recipes:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!authLoading && !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-6 text-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg max-w-md w-full">
          <h3 className="text-lg font-medium text-red-800">Authentication Required</h3>
          <p className="text-red-600">Please log in to view saved recipes.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        <p className="ml-3 text-lg text-gray-700">Loading your saved recipes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-6 text-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg max-w-md w-full">
          <h3 className="text-lg font-medium text-red-800">Error loading recipes</h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchSavedRecipes}
            className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (savedRecipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-6 text-center">
        <Bookmark className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Saved Recipes Yet!</h2>
        <p className="text-gray-600 mb-4">Save your favorite recipes to access them later.</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 bg-white md:rounded-xl shadow-sm border border-gray-200 md:px-4 py-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-gradient-to-r from-yellow-100 to-yellow-100 rounded-xl">
          <Bookmark className="w-6 h-6 text-yellow-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Saved Recipes</h2>
          <p className="text-gray-600 text-sm sm:text-base">Your collection of favorite recipes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:gap-8">
        {savedRecipes.map((recipe) => (
          <RecipeCard
            key={recipe._id}
            recipe={recipe}
            showSaveButton={true}
            onUpdate={(updatedRecipe) => {
              setSavedRecipes((prev) => prev.filter(r => r._id !== updatedRecipe._id));
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default SavedRecipesPage;