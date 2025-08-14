// src/app/components/EditRecipeForm.jsx
"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../providers/AuthContext';
import { Loader2, Type, FileText, Image as ImageIcon } from 'lucide-react';

const EditRecipeForm = ({ recipeId, onSaveSuccess, onCancel }) => {
    const { user, isLoggedIn, loading: authLoading } = useAuth();

    const [recipeData, setRecipeData] = useState(null);
    const [loadingRecipe, setLoadingRecipe] = useState(true);
    const [error, setError] = useState(null);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [imagePreview, setImagePreview] = useState(null);

    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');
    const [isSaveSuccess, setIsSaveSuccess] = useState(false);

    const [focusedField, setFocusedField] = useState(null); 

    useEffect(() => {
        if (authLoading) return;
        if (!isLoggedIn) {
            setError('You must be logged in to edit a recipe.');
            setLoadingRecipe(false);
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
                    setTitle(data.title || '');
                    setDescription(data.description || '');
                    setImageUrl(data.imageUrl || '');
                    setImagePreview(data.imageUrl || null); 
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

        if (recipeId && user?.id) {
            fetchRecipe();
        }
    }, [recipeId, user, isLoggedIn, authLoading]);

    const handleImageUrlChange = (e) => {
        const url = e.target.value;
        setImageUrl(url);
        if (url && (url.includes('.jpg') || url.includes('.jpeg') || url.includes('.png') || url.includes('.webp') || url.includes('.gif'))) {
            setImagePreview(url);
        } else {
            setImagePreview(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveMessage('');
        setIsSaveSuccess(false);

        if (!title.trim() || !description.trim()) {
            setSaveMessage('Please fill in the required fields: Title and Description.');
            setIsSaving(false);
            return;
        }

        const updatedData = {
            userId: user.id,
            title: title.trim(),
            description: description.trim(),
            imageUrl: imageUrl.trim(),
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
                setSaveMessage(data.message || 'Recipe updated successfully! 🎉');
                setIsSaveSuccess(true);
                if (onSaveSuccess) {
                    onSaveSuccess(data.recipe);
                }
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
            <div className="flex justify-center items-center h-full min-h-[300px]">
                <Loader2 className="animate-spin h-12 w-12 text-green-500" />
                <p className="ml-3 text-lg text-gray-700">Loading recipe...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] p-6 text-center">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg max-w-md w-full">
                    <h3 className="text-lg font-medium text-red-800">Error</h3>
                    <p className="text-red-600">{error}</p>
                    <button
                        onClick={onCancel}
                        className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    if (!recipeData) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] p-6 text-center">
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg max-w-md w-full">
                    <h3 className="text-lg font-medium text-yellow-800">Recipe Not Found</h3>
                    <p className="text-yellow-600">The recipe you are looking for does not exist or you do not have permission to view it.</p>
                    <button
                        onClick={onCancel}
                        className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 md:p-8 rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Recipe Title */}
                <div className="space-y-2">
                    <label
                        htmlFor="title"
                        className="flex items-center gap-2 text-lg font-semibold text-gray-800"
                    >
                        <Type className="w-5 h-5 text-green-500" />
                        Recipe Title
                    </label>
                    <div className={`relative transition-all duration-200 ${focusedField === 'title' ? 'transform scale-[1.01]' : ''
                        }`}>
                        <input
                            type="text"
                            id="title"
                            className={`w-full p-4 border-2 rounded-xl shadow-sm bg-gray-50 text-gray-900 placeholder-gray-500 transition-all duration-200 focus:outline-none focus:bg-white focus:shadow-md ${focusedField === 'title'
                                    ? 'border-green-400 ring-4 ring-green-100'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onFocus={() => setFocusedField('title')}
                            onBlur={() => setFocusedField(null)}
                            required
                            placeholder="e.g., Delicious Chicken Curry"
                            maxLength={50}
                        />
                        <div className="absolute top-2 right-3 text-xs text-gray-400">
                            {title.length}/50
                        </div>
                    </div>
                </div>

                {/* Recipe Content */}
                <div className="space-y-2">
                    <label
                        htmlFor="description"
                        className="flex items-center gap-2 text-lg font-semibold text-gray-800"
                    >
                        <FileText className="w-5 h-5 text-green-500" />
                        Recipe Description & Instructions
                    </label>
                    <div className={`relative transition-all duration-200 ${focusedField === 'description' ? 'transform scale-[1.01]' : ''
                        }`}>
                        <textarea
                            id="description"
                            rows="6"
                            className={`w-full p-4 border-2 rounded-xl shadow-sm bg-gray-50 text-gray-900 placeholder-gray-500 transition-all duration-200 focus:outline-none focus:bg-white focus:shadow-md resize-none ${focusedField === 'description'
                                    ? 'border-green-400 ring-4 ring-green-100'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            onFocus={() => setFocusedField('description')}
                            onBlur={() => setFocusedField(null)}
                            required
                            placeholder="Write your full recipe here, including ingredients, instructions, and any notes. You can format it as you like."
                        ></textarea>
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

                    {/* Image Preview */}
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

                {/* Submit Button */}
                <div className="pt-4 flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-3 rounded-full font-semibold text-gray-700 border border-gray-300 hover:bg-gray-100 transition duration-300"
                        disabled={isSaving}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-green-600 text-white font-bold py-3 px-6 rounded-full shadow-md hover:bg-green-700 transition duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
                        disabled={isSaving}
                    >
                        {isSaving && <Loader2 size={20} className="animate-spin" />}
                        <span>{isSaving ? 'Saving Changes...' : 'Save Changes'}</span>
                    </button>
                </div>
            </form>

            {saveMessage && (
                <p className={`mt-6 p-3 text-center rounded-lg ${isSaveSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {saveMessage}
                </p>
            )}
        </div>
    );
};

export default EditRecipeForm;
