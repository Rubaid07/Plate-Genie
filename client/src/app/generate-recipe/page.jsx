// src/app/generate-recipe/page.jsx

"use client";

import { useState } from 'react';
import RecipeDisplay from './RecipeDisplay';

export default function RecipeGeneratorPage() {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [inputValue, setInputValue] = useState('');
  const [items, setItems] = useState([]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddItem = () => {
    if (inputValue.trim()) {
      setItems([...items, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleRemoveItem = (itemToRemove) => {
    setItems(items.filter((item) => item !== itemToRemove));
  };

  const generateRecipes = async (ingredients) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/generate-plan`, {
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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Generate Your Recipe</h1>
      <p className='text-center'>Here you can add your ingredients and generate new recipes.</p>

      <div className="flex flex-col gap-16 items-center mt-10">
        <div className="md:w-1/3">
          <div className="p-4 rounded-md shadow-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Your Pantry Items</h2>
            <div className="flex mb-4">
              <input
                type="text"
                className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter an ingredient..."
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddItem();
                  }
                }}
              />
              <button
                className="bg-blue-600 text-white p-2 rounded-r-md hover:bg-blue-700 transition-colors"
                onClick={handleAddItem}
              >
                Add
              </button>
            </div>
  
            <ul className="list-none pl-0 mb-4 space-y-2">
              {items.map((item, index) => (
                <li key={index} className="flex justify-between items-center p-2 rounded-md bg-gray-100 text-gray-800 shadow-sm">
                  <span>{item}</span>
                  <button
                    className="ml-4 text-red-500 hover:text-red-700 transition-colors"
                    onClick={() => handleRemoveItem(item)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
  
            <button
              className="w-full bg-blue-600 text-white p-3 rounded-md font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
              onClick={() => generateRecipes(items)}
              disabled={items.length === 0}
            >
              Generate Recipe
            </button>
          </div>
        </div>

        <div className="">
          {isLoading && <p className="text-center text-lg text-gray-700">Generating recipes...</p>}
          {error && <p className="text-center text-red-500 text-lg">Error: {error}</p>}
          {!isLoading && !error && recipes.length === 0 && (
            <p className="text-center text-lg text-gray-700">Add some ingredients and click <b>Generate Recipe</b> to start.</p>
          )}
          {!isLoading && !error && recipes.length > 0 && <RecipeDisplay recipes={recipes} />}
        </div>
      </div>
    </div>
  );
}
