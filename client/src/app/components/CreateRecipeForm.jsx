// src/app/components/CreateRecipeForm.jsx
"use client";

import { useState } from 'react';
import { useAuth } from '../providers/AuthContext';
import { Loader2, Upload, Image as ImageIcon, Type, FileText, Sparkles } from 'lucide-react';

const CreateRecipeForm = ({ onRecipeCreated }) => {
  const { user, isLoggedIn, loading: authLoading } = useAuth();
  const [recipeTitle, setRecipeTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  
  if (!isLoggedIn && !authLoading && typeof onRecipeCreated === 'undefined') {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-green-600 text-2xl">!</span>
        </div>
        <p className="text-green-600 font-medium">Please log in to create a recipe.</p>
      </div>
    );
  }
  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setImageUrl(url);
    if (url && (url.includes('.jpg') || url.includes('.jpeg') || url.includes('.png') || url.includes('.webp'))) {
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setIsSuccess(false);
    if (!isLoggedIn || !user) {
      setMessage('You must be logged in to create a recipe.');
      setIsLoading(false);
      return;
    }
    if (!recipeTitle.trim() || !content.trim()) {
      setMessage('Please fill in both the recipe title and content.');
      setIsLoading(false);
      return;
    }
    if (recipeTitle.trim().length < 3) {
      setMessage('Recipe title must be at least 3 characters long.');
      setIsLoading(false);
      return;
    }
    if (content.trim().length < 10) {
      setMessage('Recipe content must be at least 10 characters long.');
      setIsLoading(false);
      return;
    }
    const recipeData = {
      userId: user.id,
      title: recipeTitle.trim(),
      description: content.trim(),
      imageUrl: imageUrl.trim(),
      likes: [],
      comments: [],
      createdAt: new Date(),
    };
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recipeData),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Recipe created successfully! 🎉');
        setIsSuccess(true);
        setRecipeTitle('');
        setContent('');
        setImageUrl('');
        setImagePreview(null);
        if (onRecipeCreated) {
          setTimeout(() => onRecipeCreated(), 1500);
        }
      } else {
        setMessage(data.message || 'Failed to create recipe. Please try again.');
        setIsSuccess(false);
      }
    } catch (error) {
      console.error('Error creating recipe:', error);
      setMessage('Network error. Please check your connection and try again.');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="bg-white">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="text-center pb-2">
          <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-gray-600">Share your culinary masterpiece with the world</p>
        </div>
        {/* Recipe Title */}
        <div className="space-y-2">
          <label
            htmlFor="recipeTitle"
            className="flex items-center gap-2 text-lg font-semibold text-gray-800"
          >
            <Type className="w-5 h-5 text-green-500" />
            Recipe Title
          </label>
          <div className={`relative transition-all duration-200 ${focusedField === 'title' ? 'transform scale-[1.01]' : ''
            }`}>
            <input
              type="text"
              id="recipeTitle"
              className={`w-full p-4 border-2 rounded-xl shadow-sm bg-gray-50 text-gray-900 placeholder-gray-500 transition-all duration-200 focus:outline-none focus:bg-white focus:shadow-md ${focusedField === 'title'
                  ? 'border-green-400 ring-4 ring-green-100'
                  : 'border-gray-200 hover:border-gray-300'
                }`}
              value={recipeTitle}
              onChange={(e) => setRecipeTitle(e.target.value)}
              onFocus={() => setFocusedField('title')}
              onBlur={() => setFocusedField(null)}
              required
              placeholder="e.g., Grandma's Secret Chocolate Chip Cookies"
              maxLength={50}
            />
            <div className="absolute top-2 right-3 text-xs text-gray-400">
              {recipeTitle.length}/50
            </div>
          </div>
        </div>
        {/* Recipe Content */}
        <div className="space-y-2">
          <label
            htmlFor="content"
            className="flex items-center gap-2 text-lg font-semibold text-gray-800"
          >
            <FileText className="w-5 h-5 text-green-500" />
            Recipe Content
          </label>
          <div className={`relative transition-all duration-200 ${focusedField === 'content' ? 'transform scale-[1.01]' : ''
            }`}>
            <textarea
              id="content"
              rows="6"
              className={`w-full p-4 border-2 rounded-xl shadow-sm bg-gray-50 text-gray-900 placeholder-gray-500 transition-all duration-200 focus:outline-none focus:bg-white focus:shadow-md resize-none ${focusedField === 'content'
                  ? 'border-green-400 ring-4 ring-green-100'
                  : 'border-gray-200 hover:border-gray-300'
                }`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setFocusedField('content')}
              onBlur={() => setFocusedField(null)}
              required
              placeholder="Share your recipe details here... Include inggreenients, cooking steps, tips, or any special notes that make this recipe unique!"
            />
          </div>
          <div className="text-xs text-gray-500 flex items-center gap-1">
            💡 <span>Tip: Include inggreenients, cooking time, serving size, and step-by-step instructions</span>
          </div>
        </div>
        {/* Image URL */}
        <div className="space-y-2">
          <label
            htmlFor="imageUrl"
            className="flex items-center gap-2 text-lg font-semibold text-gray-800"
          >
            <ImageIcon className="w-5 h-5 text-green-500" />
            Recipe Image
            <span className="text-sm font-normal text-gray-500">(Optional)</span>
          </label>
          <div className={`relative transition-all duration-200 ${focusedField === 'image' ? 'transform scale-[1.01]' : ''
            }`}>
            <input
              type="url"
              id="imageUrl"
              className={`w-full p-4 border-2 rounded-xl shadow-sm bg-gray-50 text-gray-900 placeholder-gray-500 transition-all duration-200 focus:outline-none focus:bg-white focus:shadow-md ${focusedField === 'image'
                  ? 'border-green-400 ring-4 ring-green-100'
                  : 'border-gray-200 hover:border-gray-300'
                }`}
              value={imageUrl}
              onChange={handleImageUrlChange}
              onFocus={() => setFocusedField('image')}
              onBlur={() => setFocusedField(null)}
              placeholder="https://example.com/your-delicious-recipe-photo.jpg"
            />
          </div>
          {imagePreview && (
            <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
              <div className="relative h-40 rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={imagePreview}
                  alt="Recipe preview"
                  className="w-full h-full object-cover"
                  onError={() => setImagePreview(null)}
                />
              </div>
            </div>
          )}
        </div>
        <div className="pt-4">
          <button
            type="submit"
            className={`w-full bg-gradient-to-r from-green-500 to-green-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 ${!isLoading ? 'hover:from-green-600 hover:to-green-600 transform hover:scale-[1.02]' : ''
              }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Creating Your Recipe...</span>
              </>
            ) : (
              <>
                <Upload size={20} />
                <span>Share My Recipe</span>
              </>
            )}
          </button>
        </div>
      </form>
      {message && (
        <div className={`mt-6 p-4 rounded-xl border-2 text-center font-medium transition-all duration-300 ${isSuccess
            ? 'bg-green-50 border-green-200 text-green-700'
            : 'bg-red-50 border-red-200 text-red-700'
          }`}>
          <div className="flex items-center justify-center gap-2">
            {isSuccess ? (
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            ) : (
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">!</span>
              </div>
            )}
            <span>{message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateRecipeForm;