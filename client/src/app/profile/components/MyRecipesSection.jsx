// src/app/profile/components/MyRecipesSection.jsx
"use client";

import { useState, useEffect, useRef } from 'react';
import { Edit, Trash2, PenSquare, Heart, MessageCircle, ChefHat, MoreVertical } from 'lucide-react';
import Modal from '../../components/Modal';
import CreateRecipeForm from '../../components/CreateRecipeForm';
import EditRecipeForm from '../../components/EditRecipeForm';
import { useAuth } from '../../providers/AuthContext';

const MyRecipesSection = ({ userId }) => {
  const [userRecipes, setUserRecipes] = useState([]);
  const [loadingRecipes, setLoadingRecipes] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null); 
  const { user, loading: authLoading } = useAuth();

  const dropdownRef = useRef(null);

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
    if (!userId) {
      setLoadingRecipes(false);
      return;
    }
    fetchUserRecipes();
  }, [userId]);

  const handleDeleteRecipe = async (recipeId) => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) {
      return;
    }
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${recipeId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUserRecipes(userRecipes.filter(recipe => recipe._id !== recipeId));
      } else {
        throw new Error('Failed to delete recipe');
      }
    } catch (err) {
      console.error('Error deleting recipe:', err);
    } finally {
      setOpenDropdownId(null);
    }
  };

  const handleRecipeCreatedSuccess = () => {
    setIsCreateModalOpen(false);
    if (user?.id) {
      fetchUserRecipes(user.id); 
    }
  };

  const handleRecipeEditSuccess = (updatedRecipe) => {
    setIsEditModalOpen(false); 
    setOpenDropdownId(null);
    setUserRecipes(prevRecipes => 
      prevRecipes.map(recipe => (recipe._id === updatedRecipe._id ? updatedRecipe : recipe))
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const toggleDropdown = (recipeId) => {
    setOpenDropdownId(openDropdownId === recipeId ? null : recipeId);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const openEditModal = (recipeId) => {
    setSelectedRecipeId(recipeId);
    setIsEditModalOpen(true);
    setOpenDropdownId(null); 
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 bg-white md:rounded-xl shadow-sm border border-gray-200 md:px-4 py-8 max-w-3xl mx-auto">
      {/* Header  */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-green-100 to-green-100 rounded-xl">
            <ChefHat className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">My Created Recipes</h2>
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

      {/* Loading State */}
      {(loadingRecipes || authLoading) && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-200"></div>
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-500 absolute top-0"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading your recipes...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-xl mb-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mt-1">
              <span className="text-white text-xs font-bold">!</span>
            </div>
            <div>
              <h3 className="text-red-800 font-semibold">Error loading recipes</h3>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loadingRecipes && !error && userRecipes.length === 0 && (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 sm:p-12 text-center border border-gray-200 shadow-sm">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ChefHat className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">No recipes yet</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Start your culinary journey by sharing your first recipe with the community!
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-500 text-white font-semibold px-6 py-3 rounded-xl hover:from-green-600 hover:to-green-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <PenSquare size={18} />
              Create Your First Recipe
            </button>
          </div>
        </div>
      )}

      {/* Recipes Grid */}
      {!loadingRecipes && !error && userRecipes.length > 0 && (
        <>
          <div className="mb-6 flex items-center justify-between">
            <p className="text-gray-600 text-sm sm:text-base">
              {userRecipes.length} recipe{userRecipes.length !== 1 ? 's' : ''} shared
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 sm:gap-8">
            {userRecipes.map((recipe, index) => (
              <div 
                key={recipe._id} 
                className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden relative"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Recipe Card Header - Facebook-like */}
                <div className="flex items-center p-4 pb-2">
                  <img
                    src={user?.profilePicture || 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small_2x/default-avatar-icon-of-social-media-user-vector.jpg'}
                    alt={user?.username || 'User'}
                    className="w-10 h-10 rounded-full mr-3 object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.src='https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small_2x/default-avatar-icon-of-social-media-user-vector.jpg'; }}
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{user?.username || 'Your Name'}</p>
                    <p className="text-xs text-gray-500">{recipe.createdAt ? formatDate(recipe.createdAt) : 'Just now'}</p>
                  </div>
                  
                  {/* Edit/Delete */}
                  <div className="absolute top-4 right-4" ref={dropdownRef}>
                    <button 
                      onClick={() => toggleDropdown(recipe._id)}
                      className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors focus:outline-none"
                      title="More options"
                    >
                      <MoreVertical size={20} />
                    </button>
                    {openDropdownId === recipe._id && (
                      <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg py-1 z-10">
                        <button
                          onClick={() => openEditModal(recipe._id)}
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Edit size={16} className="mr-2" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteRecipe(recipe._id)}
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          <Trash2 size={16} className="mr-2" /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recipe Content */}
                <div className="p-4 pt-0">
                  <h3 className="text-xl font-bold mb-2 text-gray-900 line-clamp-2">
                    {recipe.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                    {recipe.description}
                  </p>
                </div>
                
                {/* Recipe Image  */}
                {recipe.imageUrl && (
                  <div className="relative h-60 overflow-hidden bg-gray-100">
                    <img
                      src={recipe.imageUrl}
                      alt={recipe.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    <div className="hidden w-full h-full bg-gradient-to-br from-green-100 to-green-100 items-center justify-center">
                      <ChefHat className="w-16 h-16 text-green-400" />
                    </div>
                  </div>
                )}
                {/* Like & Comment Section */}
                <div className="p-4 border-t border-gray-100 flex items-center justify-between text-gray-600">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-1 hover:text-blue-500 transition-colors">
                      <Heart size={18} />
                      <span>{recipe.likes?.length || 0} Likes</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-blue-500 transition-colors">
                      <MessageCircle size={18} />
                      <span>{recipe.comments?.length || 0} Comments</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal for Create Recipe Form */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Recipe"
      >
        <CreateRecipeForm onRecipeCreated={handleRecipeCreatedSuccess} />
      </Modal>

      {/* Modal for Edit Recipe Form */}
      {selectedRecipeId && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Recipe"
        >
          <EditRecipeForm 
            recipeId={selectedRecipeId} 
            onSaveSuccess={handleRecipeEditSuccess} 
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedRecipeId(null);
            }} 
          />
        </Modal>
      )}
    </div>
  );
};

export default MyRecipesSection;
