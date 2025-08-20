"use client";

import { useState, useRef } from 'react';
import { Edit, Trash2, Heart, MessageCircle, ChefHat, MoreVertical, Bookmark } from 'lucide-react';
import { useAuth } from '../../providers/AuthContext';
import { useRouter } from 'next/navigation';
import Modal from '../../components/Modal';
import EditRecipeForm from '../../components/EditRecipeForm';
import Comments from './Comments';

const RecipeCard = ({
  recipe,
  showActions = false,
  showSaveButton = false,
  onDelete,
  onUpdate,
  currentUser
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [selectedRecipeForComments, setSelectedRecipeForComments] = useState(null);
  const { user } = useAuth();
  const router = useRouter();
  const dropdownRef = useRef(null);

  const handleLikeToggle = async () => {
    if (!user?.id) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${recipe._id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });

      if (response.ok && onUpdate) {
        const updatedRecipe = await response.json();
        onUpdate(updatedRecipe);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleSaveToggle = async () => {
    if (!user?.id) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${recipe._id}/save-toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });

       if (response.ok) {
        const updatedRecipe = await response.json();
        if (onUpdate) onUpdate(updatedRecipe);
        setSelectedRecipeForComments(updatedRecipe);
        return true;
      }
    } catch (error) {
      console.error('Error toggling save:', error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${recipe._id}`, {
        method: 'DELETE',
      });

      if (response.ok && onDelete) {
        onDelete(recipe._id);
      }
    } catch (error) {
      console.error('Error deleting recipe:', error);
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
        if (onUpdate) onUpdate(updatedRecipe);
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
        if (onUpdate) onUpdate(updatedRecipe);
        setSelectedRecipeForComments(updatedRecipe);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error deleting comment:', error);
      return false;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const toggleDescription = () => {
    if (onUpdate) {
      onUpdate({
        ...recipe,
        showFullDescription: !recipe.showFullDescription
      });
    }
  };

  const handleCommentClick = (recipe) => {
    setSelectedRecipeForComments(recipe);
    setIsCommentsModalOpen(true);
  };

  const handleCloseCommentsModal = () => {
    setIsCommentsModalOpen(false);
    setSelectedRecipeForComments(null);
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
        if (onUpdate) onUpdate(updatedRecipe);
        setSelectedRecipeForComments(updatedRecipe);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error posting comment:', error);
      return false;
    }
  };

  const displayUser = currentUser || recipe.user || user;

  return (
    <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden relative hover:shadow-md transition-shadow duration-300">
      {/* Recipe Header*/}
      <div className="flex items-center p-4 pb-2">
        <img
          src={displayUser?.profilePicture || 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small_2x/default-avatar-icon-of-social-media-user-vector.jpg'}
          alt={displayUser?.username}
          className="w-10 h-10 rounded-full mr-3 object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small_2x/default-avatar-icon-of-social-media-user-vector.jpg';
          }}
        />
        <div>
          <p className="font-semibold text-gray-900">{displayUser?.username || 'User'}</p>
          <p className="text-xs text-gray-500">{formatDate(recipe.createdAt)}</p>
        </div>
        {/* Actions Dropdown */}
        {showActions && user?.id === recipe.userId && (
          <div className="absolute top-4 right-4" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700"
            >
              <MoreVertical size={20} />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                <button
                  onClick={() => {
                    setIsEditModalOpen(true);
                    setShowDropdown(false);
                  }}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Edit size={16} className="mr-2" /> Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                >
                  <Trash2 size={16} className="mr-2" /> Delete
                </button>
              </div>
            )}
          </div>
        )}
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

        <p className={`whitespace-pre-line text-gray-600 text-sm leading-relaxed mb-2 ${recipe.showFullDescription ? "" : "line-clamp-4"}`}>
          {recipe.description}
        </p>

        {recipe.description?.length > 150 && (
          <button
            onClick={toggleDescription}
            className="text-green-600 text-sm font-medium hover:underline focus:outline-none"
          >
            {recipe.showFullDescription ? "See less" : "See more"}
          </button>
        )}
      </div>

      {/* Like & Comment Buttons */}
      <div className="p-4 border-t border-gray-100 flex items-center justify-between text-gray-600">
        <div className="flex items-center space-x-4">
          <button
            className={`flex items-center space-x-1 transition-colors cursor-pointer ${recipe.likes?.includes(user?.id) ? 'text-green-500' : 'hover:text-green-500'}`}
            onClick={handleLikeToggle}
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
        {showSaveButton && (
          <button
            className={`p-1.5 rounded-full ${recipe.savedBy?.includes(user?.id)
              ? 'text-yellow-500 bg-yellow-50'
              : 'text-gray-500 hover:bg-gray-100'}`}
            onClick={handleSaveToggle}
            title={recipe.savedBy?.includes(user?.id) ? "Unsave recipe" : "Save recipe"}
          >
            <Bookmark size={20} fill={recipe.savedBy?.includes(user?.id) ? 'currentColor' : 'none'} />
          </button>
        )}
      </div>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Recipe"
      >
        <EditRecipeForm
          recipeId={recipe._id}
          onSaveSuccess={(updatedRecipe) => {
            setIsEditModalOpen(false);
            if (onUpdate) onUpdate(updatedRecipe);
          }}
          onCancel={() => setIsEditModalOpen(false)}
        />
      </Modal>

      <Comments
        recipe={selectedRecipeForComments || {}}
        isOpen={isCommentsModalOpen}
        onClose={handleCloseCommentsModal}
        onCommentSubmit={handleCommentSubmit}
        onCommentEdit={handleCommentEdit}
        onCommentDelete={handleCommentDelete}
      />

    </div>
  );
};

export default RecipeCard;