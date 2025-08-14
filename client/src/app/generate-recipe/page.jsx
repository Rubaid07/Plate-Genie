// src/app/generate-recipe/page.jsx
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../providers/AuthContext';
import { useRouter } from 'next/navigation';
import { Wand2, ChefHat, Trash2, Loader2, Save, Check } from 'lucide-react';

export default function RecipeGeneratorPage() {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saveMessage, setSaveMessage] = useState('');
  const [ingredients, setIngredients] = useState('');
  
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [savedLoading, setSavedLoading] = useState(true);
  const [savedError, setSavedError] = useState(null);
  
  const [activeTab, setActiveTab] = useState('generate');
  
  const { isLoggedIn, user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn && user?.id && activeTab === 'saved') {
      fetchSavedRecipes(user.id);
    }
  }, [isLoggedIn, user, activeTab]);

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
        <p className="text-lg text-gray-700">Loading...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    router.push('/login');
    return null;
  }

  const fetchSavedRecipes = async (userId) => {
    setSavedLoading(true);
    setSavedError(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/${userId}?type=saved`);
      if (!response.ok) {
        throw new Error('Failed to fetch saved recipes.');
      }
      const data = await response.json();
      setSavedRecipes(data);
    } catch (err) {
      setSavedError(err.message);
      console.error('Error fetching recipes:', err);
    } finally {
      setSavedLoading(false);
    }
  };

  const handleIngredientsChange = (e) => {
    setIngredients(e.target.value);
  };

  const generateRecipes = async () => {
    if (!ingredients.trim()) {
      setError("Please enter some ingredients");
      return;
    }

    setIsLoading(true);
    setError(null);
    setRecipes([]);
    setSaveMessage(''); 

    try {
      const ingredientsArray = ingredients.split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/generate-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients: ingredientsArray }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }
      const data = await response.json();
      setRecipes(data);
      setActiveTab('results');
    } catch (err) {
      setError(
        err.message.includes('overloaded')
          ? "Our recipe service is currently busy. Please try again shortly."
          : `Failed to generate recipes: ${err.message}. Please check your ingredients and try again.`
      );
      console.error(err);
      setRecipes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveRecipe = async (recipeToSave, index) => {
    setSaveMessage('');
    setRecipes(prevRecipes => 
      prevRecipes.map((r, i) => i === index ? { ...r, isSaving: true } : r)
    );

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          name: recipeToSave.name,
          ingredients: recipeToSave.ingredients,
          instructions: recipeToSave.instructions,
          cookingTime: recipeToSave.cookingTime,
          difficulty: recipeToSave.difficulty,
          imageUrl: recipeToSave.imageUrl || '' 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setRecipes(prevRecipes => 
          prevRecipes.map((r, i) => i === index ? { ...r, isSaved: true, isSaving: false } : r)
        );
        fetchSavedRecipes(user.id);
      } else {
        throw new Error(data.message || 'Failed to save recipe.');
      }
    } catch (err) {
      setSaveMessage(`Error saving recipe: ${err.message}`);
      setRecipes(prevRecipes => 
        prevRecipes.map((r, i) => i === index ? { ...r, isSaved: false, isSaving: false } : r)
      );
      console.error('Error saving recipe:', err);
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    if (!confirm('Are you sure you want to delete this recipe?')) {
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${recipeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete the recipe.');
      }

      setSavedRecipes(savedRecipes.filter(recipe => recipe._id !== recipeId));
    } catch (err) {
      setSavedError(err.message);
      console.error('Error deleting recipe:', err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          Recipe Magic
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Transform your ingredients into delicious recipes or browse your saved creations
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-8">
        <button
          onClick={() => setActiveTab('generate')}
          className={`py-3 px-6 font-medium text-sm focus:outline-none ${activeTab === 'generate' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Generate Recipes
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`py-3 px-6 font-medium text-sm focus:outline-none ${activeTab === 'saved' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          My Saved Recipes
        </button>
        {recipes.length > 0 && (
          <button
            onClick={() => setActiveTab('results')}
            className={`py-3 px-6 font-medium text-sm focus:outline-none ${activeTab === 'results' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Generated Results
          </button>
        )}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
        {activeTab === 'generate' && (
          <div>
            <div className="mb-6">
              <label htmlFor="ingredients" className="block text-lg font-medium text-gray-700 mb-2">
                Your Ingredients
              </label>
              <textarea
                id="ingredients"
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="e.g. chicken, rice, tomatoes, garlic (comma separated)"
                value={ingredients}
                onChange={handleIngredientsChange}
              ></textarea>
              <p className="mt-1 text-sm text-gray-500">
                Separate ingredients with commas
              </p>
            </div>

            <button
              onClick={generateRecipes}
              disabled={!ingredients.trim() || isLoading}
              className={`w-full py-3 px-4 rounded-lg font-bold transition flex items-center justify-center gap-2 ${
                isLoading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-emerald-600 hover:to-green-600 text-white cursor-pointer shadow-md hover:shadow-lg duration-200'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 size={20} />
                  Generate Recipes
                </>
              )}
            </button>

            {error && (
              <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                <p className="text-red-700">{error}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'results' && (
          <div>
            {isLoading && (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                <p className="ml-3 text-lg text-gray-700">Generating recipes...</p>
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {saveMessage && (
              <p className={`text-center mt-4 ${saveMessage.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
                {saveMessage}
              </p>
            )}

            {!isLoading && !error && recipes.length === 0 && (
              <div className="text-center py-12">
                <p className="text-lg text-gray-700">No recipes generated yet. Add some ingredients and click <b>Generate Recipe</b> to start.</p>
                <button
                  onClick={() => setActiveTab('generate')}
                  className="mt-4 inline-flex items-center gap-2 bg-green-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Wand2 size={18} />
                  Generate Recipes
                </button>
              </div>
            )}

            {!isLoading && !error && recipes.length > 0 && (
              <div className="space-y-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Generated Recipes</h2>
                  <button
                    onClick={() => setActiveTab('generate')}
                    className="text-green-600 hover:text-green-800 font-medium"
                  >
                    Generate More
                  </button>
                </div>
                
                {recipes.map((recipe, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-grow">
                        <h3 className="md:text-2xl text-xl font-bold text-gray-900 pr-4">{recipe.name}</h3>
                        {recipe.difficulty && (
                          <span className="text-sm text-gray-500 mt-1">
                            Difficulty: {recipe.difficulty}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {recipe.cookingTime && (
                          <span className="flex-shrink-0 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 text-center">
                            {recipe.cookingTime}
                          </span>
                        )}
                        <button
                          onClick={() => handleSaveRecipe(recipe, index)}
                          className={`p-2 rounded-full transition-colors ${
                            recipe.isSaved
                              ? 'bg-green-100 text-green-600 cursor-not-allowed'
                              : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                          } ${recipe.isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                          disabled={recipe.isSaved || recipe.isSaving}
                          title={recipe.isSaved ? "Saved" : "Save Recipe"}
                        >
                          {recipe.isSaving ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : recipe.isSaved ? (
                            <Check className="h-5 w-5" />
                          ) : (
                            <Save className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6 mb-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">Ingredients</h4>
                        <ul className="space-y-2">
                          {recipe.ingredients.map((ingredient, i) => (
                            <li key={i} className="flex items-start">
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mt-2 mr-2"></span>
                              <span className="text-gray-700">{ingredient}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">Instructions</h4>
                        <div className="whitespace-pre-line text-gray-700">
                          {recipe.instructions}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'saved' && (
          <div>
            {savedLoading && (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                <p className="ml-3 text-lg text-gray-700">Loading saved recipes...</p>
              </div>
            )}

            {savedError && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-medium text-red-800">Error</h3>
                <p className="text-red-600">{savedError}</p>
                <button 
                  onClick={() => fetchSavedRecipes(user?.id)} 
                  className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Retry
                </button>
              </div>
            )}

            {!savedLoading && !savedError && savedRecipes.length === 0 && (
              <div className="text-center py-12">
                <ChefHat className="w-16 h-16 text-gray-400 mb-4 mx-auto" />
                <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Saved Recipes Yet!</h2>
                <p className="text-gray-600 mb-6">Recipes you save from the generator will appear here.</p>
                <button
                  onClick={() => setActiveTab('generate')}
                  className="inline-flex items-center gap-2 bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Wand2 size={18} />
                  Generate Your First Recipe
                </button>
              </div>
            )}

            {!savedLoading && !savedError && savedRecipes.length > 0 && (
              <div className="space-y-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">My Saved Recipes</h2>
                  <span className="text-sm text-gray-500">
                    {savedRecipes.length} {savedRecipes.length === 1 ? 'recipe' : 'recipes'}
                  </span>
                </div>
                
                {savedRecipes.map((recipe) => (
                  <div key={recipe._id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-grow">
                        <h3 className="md:text-2xl text-xl font-bold text-gray-900 pr-4">{recipe.title || recipe.name}</h3>
                        {recipe.difficulty && (
                          <span className="text-sm text-gray-500 mt-1">
                            Difficulty: {recipe.difficulty}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {recipe.cookingTime && (
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 text-center">
                            {recipe.cookingTime}
                          </span>
                        )}
                        <button
                          onClick={() => handleDeleteRecipe(recipe._id)}
                          className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700 transition-colors"
                          title="Delete Recipe"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">Ingredients</h4>
                        <ul className="space-y-2">
                          {Array.isArray(recipe.ingredients) && recipe.ingredients.map((ingredient, i) => (
                            <li key={i} className="flex items-start">
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mt-2 mr-2"></span>
                              <span className="text-gray-700">{ingredient}</span>
                            </li>
                          ))}
                          {!Array.isArray(recipe.ingredients) && recipe.ingredients && (
                            <li className="text-gray-700">{recipe.ingredients}</li>
                          )}
                        </ul>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">Instructions</h4>
                        <div className="whitespace-pre-line text-gray-700">
                          {recipe.instructions || recipe.description}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}