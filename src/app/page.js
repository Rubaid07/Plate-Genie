"use client";

import { useState } from 'react';
import Items from './components/Items';
import RecipeDisplay from './components/RecipeDisplay'; 

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const generateRecipes = async (ingredients) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recipes. Please try again.');
      }

      const data = await response.json();
      setRecipes(data);
    } catch (err) {
      setError(err.message);
      console.error(err);
      setRecipes([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 p-4">
      <div className="md:w-1/3">
        <Items onGenerate={generateRecipes} />
      </div>
      <div className="md:w-2/3">
        {isLoading && <p className="text-center text-lg">Generating recipes...</p>}
        {error && <p className="text-center text-red-500 text-lg">Error: {error}</p>}
        {!isLoading && !error && recipes.length === 0 && (
          <p className="text-center text-lg text-gray-500">Add some ingredients and click <b>Generate Recipe</b> to start.</p>
        )}
        {!isLoading && !error && recipes.length > 0 && <RecipeDisplay recipes={recipes} />}
      </div>
    </div>
  );
}