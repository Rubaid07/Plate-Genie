"use client";

import { useState, useEffect } from 'react';
import { PenSquare, ChefHat, Loader2 } from 'lucide-react';
import { useAuth } from '../../providers/AuthContext';
import { useRouter } from 'next/navigation';
import Modal from '../../components/Modal';
import CreateRecipeForm from '../../components/CreateRecipeForm';
import RecipeCard from './RecipeCard';

const MyRecipesSection = ({ userId }) => {
  const [userRecipes, setUserRecipes] = useState([]);
  const [loadingRecipes, setLoadingRecipes] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const fetchUserRecipes = async () => {
    setLoadingRecipes(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/${userId}?type=created`);
      if (!response.ok) throw new Error('Failed to fetch your created recipes.');
      const data = await response.json();
      setUserRecipes(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching user created recipes:', err);
    } finally {
      setLoadingRecipes(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user?.id) {
      fetchUserRecipes();
    }
  }, [userId, user, authLoading, router]);

  const handleDeleteRecipe = async (recipeId) => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${recipeId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUserRecipes(userRecipes.filter(recipe => recipe._id !== recipeId));
      }
    } catch (err) {
      console.error('Error deleting recipe:', err);
    }
  };

  const handleRecipeUpdate = (updatedRecipe) => {
    setUserRecipes(prevRecipes =>
      prevRecipes.map(recipe => 
        recipe._id === updatedRecipe._id ? updatedRecipe : recipe
      )
    );
  };

  const handleRecipeCreatedSuccess = () => {
    setIsCreateModalOpen(false);
    fetchUserRecipes();
  };

  if (!authLoading && !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-6 text-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg max-w-md w-full">
          <h3 className="text-lg font-medium text-red-800">Authentication Required</h3>
          <p className="text-red-600">Please log in to view your created recipes.</p>
        </div>
      </div>
    );
  }

  if (authLoading || loadingRecipes) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        <p className="ml-3 text-lg text-gray-700">Loading your recipes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-6 text-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-xl mb-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mt-1">
              <span className="text-white text-xs font-bold">!</span>
            </div>
            <div>
              <h3 className="text-red-800 font-semibold">Error loading recipes</h3>
              <p className="text-red-700 mt-1">{error}</p>
              <button onClick={fetchUserRecipes} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (userRecipes.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-6 text-center">
          <ChefHat className="w-16 h-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Recipes Created Yet!</h2>
          <p className="text-gray-600 mb-4">Start your culinary journey by sharing your first recipe with the community!</p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 bg-green-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-green-600 transition-colors duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <PenSquare size={18} />
            Create Your First Recipe
          </button>
        </div>

        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create New Recipe"
        >
          <CreateRecipeForm onRecipeCreated={handleRecipeCreatedSuccess} />
        </Modal>
      </>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 bg-white md:rounded-xl shadow-sm border border-gray-200 md:px-4 py-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-green-100 to-green-100 rounded-xl">
            <ChefHat className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Created Recipes</h2>
            <p className="text-gray-600 text-sm sm:text-base">Recipes you have created and shared</p>
          </div>
        </div>

        {/* Create Recipe Button */}
        <div
          onClick={() => setIsCreateModalOpen(true)}
          className="group relative flex items-center w-full sm:w-auto sm:max-w-sm bg-white border-2 border-dashed border-gray-300 rounded-xl py-3 px-4 sm:px-6 shadow-sm cursor-pointer hover:border-green-400 hover:bg-green-50 transition-all duration-300 ease-in-out"
        >
          <div className="flex items-center gap-3 w-full">
            <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
              <PenSquare size={18} className="text-green-600" />
            </div>
            <span className="text-gray-600 group-hover:text-green-700 font-medium flex-grow text-left">
              What's cooking today?
            </span>
          </div>
        </div>
      </div>

      {/* Recipes section */}
      <div className="grid grid-cols-1 gap-6 sm:gap-8">
        {userRecipes.map((recipe, index) => (
          <RecipeCard
            key={recipe._id}
            recipe={recipe}
            currentUser={user}
            showActions={true}
            showSaveButton={true}
            onDelete={handleDeleteRecipe}
            onUpdate={handleRecipeUpdate}
            style={{ animationDelay: `${index * 100}ms` }}
          />
        ))}
      </div>

      {/* Create Recipe Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Recipe"
      >
        <CreateRecipeForm onRecipeCreated={handleRecipeCreatedSuccess} />
      </Modal>
    </div>
  );
};

export default MyRecipesSection;