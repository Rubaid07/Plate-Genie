// src/app/edit-recipe/[id]/page.jsx
"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../providers/AuthContext';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function EditRecipePage({ params }) {
  const { id: recipeId } = React.use(params); 
  const { user, isLoggedIn, loading: authLoading } = useAuth();
  const router = useRouter();

  const [recipeData, setRecipeData] = useState(null);
  const [loadingRecipe, setLoadingRecipe] = useState(true);
  const [error, setError] = useState(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [isSaveSuccess, setIsSaveSuccess] = useState(false);

  useEffect(() => {
    if (authLoading) return; 
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    const fetchRecipe = async () => {
      setLoadingRecipe(true);
      setError(null);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${recipeId}`);
        const data = await response.json();

        if (response.ok) {
          if (data.userId !== user.id) {
            setError('You are not authorized to edit this recipe.');
            setLoadingRecipe(false);
            return;
          }
          setRecipeData(data);
          setTitle(data.title);
          setContent(data.description);
          setImageUrl(data.imageUrl || '');
        } else {
          setError(data.message || 'Failed to fetch recipe.');
        }
      } catch (err) {
        console.error('Error fetching recipe:', err);
        setError('An error occurred while fetching the recipe.');
      } finally {
        setLoadingRecipe(false);
      }
    };

    if (recipeId) {
      fetchRecipe();
    }
  }, [recipeId, user, isLoggedIn, authLoading, router]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage('');
    setIsSaveSuccess(false);

    if (!title || !content) {
      setSaveMessage('Please fill in all required fields.');
      setIsSaving(false);
      return;
    }

    const updatedData = {
      userId: user.id,
      title,
      description: content,
      imageUrl,
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${recipeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      const data = await response.json();

      if (response.ok) {
        setSaveMessage(data.message || 'Recipe updated successfully!');
        setIsSaveSuccess(true);
        setRecipeData(data.recipe); 
        router.push('/profile');
      } else {
        setSaveMessage(data.message || 'Failed to update recipe.');
        setIsSaveSuccess(false);
      }
    } catch (err) {
      console.error('Error updating recipe:', err);
      setSaveMessage('An error occurred. Please try again.');
      setIsSaveSuccess(false);
    } finally {
      setIsSaving(false);
    }
  };

  if (loadingRecipe || authLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
        <Loader2 className="animate-spin h-12 w-12 text-green-500" />
        <p className="ml-3 text-lg text-gray-700">Loading recipe...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-6 text-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg max-w-md w-full">
          <h3 className="text-lg font-medium text-red-800">Error</h3>
          <p className="text-red-600">{error}</p>
          {error === 'You are not authorized to edit this recipe.' && (
            <button 
              onClick={() => router.push('/profile')} 
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Go to Profile
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!recipeData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-6 text-center">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg max-w-md w-full">
          <h3 className="text-lg font-medium text-yellow-800">Recipe Not Found</h3>
          <p className="text-yellow-600">The recipe you are looking for does not exist or you do not have permission to view it.</p>
          <button 
            onClick={() => router.push('/profile')} 
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Go to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-3xl bg-white shadow-lg rounded-lg my-8">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Edit Recipe</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Recipe Title */}
        <div>
          <label htmlFor="title" className="block text-lg font-semibold text-gray-700 mb-2">Recipe Title</label>
          <input
            type="text"
            id="title"
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 bg-gray-50 text-gray-900"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="e.g., Delicious Chicken Curry"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-lg font-semibold text-gray-700 mb-2">Recipe Details</label>
          <textarea
            id="content"
            rows="15"
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 bg-gray-50 text-gray-900"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            placeholder="Write your recipe description, ingredients, and instructions here. You can format it however you like."
          ></textarea>
        </div>

        {/* Image URL */}
        <div>
          <label htmlFor="imageUrl" className="block text-lg font-semibold text-gray-700 mb-2">Image URL (Optional)</label>
          <input
            type="url"
            id="imageUrl"
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 bg-gray-50 text-gray-900"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="e.g., https://example.com/your-image-link.jpg"
          />
          {imageUrl && (
            <div className="mt-4">
              <img src={imageUrl} alt="Recipe Preview" className="max-w-xs h-auto rounded-lg shadow-md mx-auto" onError={(e) => e.target.style.display='none'} />
            </div>
          )}
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-full shadow-md hover:bg-green-700 transition duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
          disabled={isSaving}
        >
          {isSaving && <Loader2 size={20} className="animate-spin" />}
          <span>{isSaving ? 'Saving Changes...' : 'Save Changes'}</span>
        </button>
      </form>

      {saveMessage && (
        <p className={`mt-6 text-center text-lg ${isSaveSuccess ? 'text-green-600' : 'text-red-600'}`}>
          {saveMessage}
        </p>
      )}
    </div>
  );
}
