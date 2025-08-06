"use client";

import { useState } from 'react';
import { Wand2 } from 'lucide-react';

export default function RecipeGeneratorPage() {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ingredients, setIngredients] = useState('');

  const generateRecipes = async () => {
    if (!ingredients.trim()) {
      setError("Please enter some ingredients");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const ingredientsArray = ingredients.split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/generate-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: ingredientsArray }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      setRecipes(data);
    } catch (err) {
      setError(err.message.includes('overloaded')
        ? "Our recipe service is currently busy. Please try again shortly."
        : "Failed to generate recipes. Please check your ingredients and try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold  mb-3 text-green-600">
          Recipe Generator
        </h1>
        <p className="text-lg text-gray-600">
          Enter your ingredients (comma separated) and we'll suggest delicious recipes
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
        <div className="mb-6">
          <label htmlFor="ingredients" className="block text-lg font-medium text-gray-700 mb-2">
            Your Ingredients
          </label>
          <textarea
            id="ingredients"
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="e.g. chicken, rice, tomatoes, garlic"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
          />
          <p className="mt-1 text-sm text-gray-500">
            Separate ingredients with commas
          </p>
        </div>

        <button
          onClick={generateRecipes}
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-lg font-bold transition flex items-center justify-center gap-2 ${isLoading
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

      {recipes.length > 0 && (
        <div className="space-y-6">
          {recipes.map((recipe, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <h3 className="flex-grow md:text-2xl text-xl font-bold text-gray-900 pr-4">{recipe.name}</h3>
                {recipe.cookingTime && (
                  <span className="flex-shrink-0 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 text-center">
                    {recipe.cookingTime}
                  </span>
                )}
              </div>
              <div className="grid md:grid-cols-2 gap-6">
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
  );
}