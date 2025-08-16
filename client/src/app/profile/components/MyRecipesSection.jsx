"use client";

import { useState, useEffect, useRef } from 'react';
import { Edit, Trash2, PenSquare, Heart, MessageCircle, ChefHat, MoreVertical, Bookmark, Loader2 } from 'lucide-react';
import Modal from '../../components/Modal';
import CreateRecipeForm from '../../components/CreateRecipeForm';
import EditRecipeForm from '../../components/EditRecipeForm';
import { useAuth } from '../../providers/AuthContext';
import { useRouter } from 'next/navigation';
import Comments from './Comments';

const MyRecipesSection = ({ userId }) => {
  const [userRecipes, setUserRecipes] = useState([]);
  const [loadingRecipes, setLoadingRecipes] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [selectedRecipeForComments, setSelectedRecipeForComments] = useState(null);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const dropdownRefs = useRef({});

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
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete recipe');
      }
    } catch (err) {
      console.error('Error deleting recipe:', err);
    } finally {
      setOpenDropdownId(null);
    }
  };

  const handleLikeToggle = async (recipeId) => {
    if (!user?.id) {
      alert("Please log in to like a recipe.");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${recipeId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });

      if (response.ok) {
        const updatedRecipe = await response.json();
        setUserRecipes(prevRecipes =>
          prevRecipes.map(recipe =>
            recipe._id === updatedRecipe._id ? updatedRecipe : recipe
          )
        );
      } else {
        const errorData = await response.json();
        console.error('Failed to like recipe:', errorData);
        alert(`Failed to like recipe: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      alert('An error occurred while liking the recipe.');
    }
  };

  const handleSaveToggle = async (recipeId) => {
    if (!user?.id) {
      alert("Please log in to save a recipe.");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${recipeId}/save-toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });

      if (response.ok) {
        const updatedRecipe = await response.json();
        setUserRecipes(prevRecipes =>
          prevRecipes.map(recipe =>
            recipe._id === updatedRecipe._id ? updatedRecipe : recipe
          )
        );
      } else {
        const errorData = await response.json();
        console.error('Failed to save recipe:', errorData);
        alert(`Failed to save recipe: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error toggling save:', error);
      alert('An error occurred while saving the recipe.');
    }
  };

  const handleCloseCommentsModal = () => {
    setIsCommentsModalOpen(false);
  };

  const handleCommentClick = (recipe) => {
    setSelectedRecipeForComments(recipe);
    setIsCommentsModalOpen(true);
  };

  const handleCommentSubmit = async (commentText) => {
    if (!user?.id || !selectedRecipeForComments?._id) return false;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${selectedRecipeForComments._id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          commentText,
          username: user.username,
          userProfilePicture: user.profilePicture,
        }),
      });

      if (response.ok) {
        const updatedRecipe = await response.json();
        setUserRecipes(prevRecipes =>
          prevRecipes.map(recipe =>
            recipe._id === updatedRecipe._id ? updatedRecipe : recipe
          )
        );
        setSelectedRecipeForComments(updatedRecipe);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error posting comment:', error);
      return false;
    }
  };

  const handleCommentEdit = async (commentId, newText) => {
    if (!user?.id || !selectedRecipeForComments?._id) return false;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${selectedRecipeForComments._id}/comments/${commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          commentText: newText
        }),
      });

      if (response.ok) {
        const updatedRecipe = await response.json();
        setUserRecipes(prevRecipes =>
          prevRecipes.map(recipe =>
            recipe._id === updatedRecipe._id ? updatedRecipe : recipe
          )
        );
        setSelectedRecipeForComments(updatedRecipe);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error editing comment:', error);
      return false;
    }
  };

  const handleCommentDelete = async (commentId) => {
    if (!user?.id || !selectedRecipeForComments?._id) return false;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${selectedRecipeForComments._id}/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });

      if (response.ok) {
        const updatedRecipe = await response.json();
        setUserRecipes(prevRecipes =>
          prevRecipes.map(recipe =>
            recipe._id === updatedRecipe._id ? updatedRecipe : recipe
          )
        );
        setSelectedRecipeForComments(updatedRecipe);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting comment:', error);
      return false;
    }
  };

  const handleRecipeCreatedSuccess = () => {
    setIsCreateModalOpen(false);
    fetchUserRecipes();
  };

  const handleRecipeEditSuccess = (updatedRecipe) => {
    setIsEditModalOpen(false);
    setOpenDropdownId(null);
    setUserRecipes(prevRecipes =>
      prevRecipes.map(recipe => (recipe._id === updatedRecipe._id ? updatedRecipe : recipe))
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
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
      if (!openDropdownId) return;
      const node = dropdownRefs.current[openDropdownId];
      if (node && !node.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdownId]);

  const openEditModal = (recipeId) => {
    setSelectedRecipeId(recipeId);
    setIsEditModalOpen(true);
    setOpenDropdownId(null);
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
          <div
            key={recipe._id}
            className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden relative"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Recipe Card Header */}
            <div className="flex items-center p-4 pb-2">
              <img
                src={user?.profilePicture || 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small_2x/default-avatar-icon-of-social-media-user-vector.jpg'}
                alt={user?.username || 'User'}
                className="w-10 h-10 rounded-full mr-3 object-cover"
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small_2x/default-avatar-icon-of-social-media-user-vector.jpg'; }}
              />
              <div>
                <p className="font-semibold text-gray-900">{user?.username || 'Your Name'}</p>
                <p className="text-xs text-gray-500">{recipe.createdAt ? formatDate(recipe.createdAt) : 'Just now'}</p>
              </div>

              {/* Edit/Delete Dropdown */}
              <div
                className="absolute top-4 right-4"
                ref={(el) => { dropdownRefs.current[recipe._id] = el; }}
              >
                <button
                  onClick={() => toggleDropdown(recipe._id)}
                  className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 cursor-pointer transition-colors focus:outline-none"
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
            {/* Recipe Image */}
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
            {/* Recipe Content */}
            <div className="p-4 pt-0">
              <h3 className="text-xl font-bold mb-2 text-gray-900 line-clamp-2">
                {recipe.title}
              </h3>

              {/* Description */}
              <p
                className={`whitespace-pre-line text-gray-600 text-sm leading-relaxed mb-2 ${recipe.showFullDescription ? "" : "line-clamp-4"
                  }`}
              >
                {recipe.description}
              </p>

              {/* Toggle button */}
              {recipe.description?.length > 150 && (
                <button
                  onClick={() => {
                    setUserRecipes((prev) =>
                      prev.map((r) =>
                        r._id === recipe._id
                          ? { ...r, showFullDescription: !r.showFullDescription }
                          : r
                      )
                    );
                  }}
                  className="text-green-600 text-sm font-medium hover:underline focus:outline-none"
                >
                  {recipe.showFullDescription ? "See less" : "See more"}
                </button>
              )}
            </div>
            {/* Like, Comment & Save Buttons */}
            <div className="p-4 border-t border-gray-100 flex items-center justify-between text-gray-600">
              <div className="flex items-center space-x-4">
                <button
                  className={`flex items-center space-x-1 transition-colors cursor-pointer ${recipe.likes?.includes(user?.id) ? 'text-green-500' : 'hover:text-green-500'}`}
                  onClick={() => handleLikeToggle(recipe._id)}
                >
                  <Heart size={18} fill={recipe.likes?.includes(user?.id) ? 'currentColor' : 'none'} />
                  <span>{recipe.likes?.length || 0} Likes</span>
                </button>
                <button
                  className="flex items-center space-x-1 hover:text-green-500 transition-colors cursor-pointer"
                  onClick={() => handleCommentClick(recipe)}
                >
                  <MessageCircle size={18} />
                  <span>{recipe.comments?.length || 0} Comments</span>
                </button>
              </div>
              <button
                className={`flex items-center space-x-1 transition-colors cursor-pointer ${recipe.savedBy?.includes(user?.id) ? 'text-yellow-500' : 'hover:text-yellow-700'}`}
                onClick={() => handleSaveToggle(recipe._id)}
              >
                <Bookmark size={18} fill={recipe.savedBy?.includes(user?.id) ? 'currentColor' : 'none'} />
                <span>{recipe.savedBy?.length || 0} Saves</span>
              </button>
            </div>
          </div>
        ))}
      </div>

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

      {/* Comments Modal */}
      {selectedRecipeForComments && (
        <Comments
          recipe={selectedRecipeForComments}
          isOpen={isCommentsModalOpen}
          onClose={handleCloseCommentsModal}
          onCommentSubmit={handleCommentSubmit}
          onCommentEdit={handleCommentEdit}
          onCommentDelete={handleCommentDelete}
        />
      )}
    </div>
  );
};

export default MyRecipesSection;