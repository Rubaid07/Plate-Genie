// src/app/profile/components/ProfileHeader.jsx
"use client";

import { useState } from 'react';
import { Edit, Calendar, Star, Users } from 'lucide-react';
import Modal from '../../components/Modal';
import EditProfileForm from '../components/EditProfileForm';

const ProfileHeader = ({ user, onProfileUpdate }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const formatJoinDate = (dateString) => {
    if (!dateString) return 'Recently joined';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  const defaultAvatar =
    'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small_2x/default-avatar-icon-of-social-media-user-vector.jpg';

  const handleEditClick = () => {
    setIsEditModalOpen(true);
    setMessage({ text: '', type: '' });
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setMessage({ text: '', type: '' });
  };

  const handleSaveProfile = async (formData) => {
    try {
      setMessage({ text: '', type: '' });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id, ...formData }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setMessage({
          text: 'Profile updated successfully! 🎉',
          type: 'success'
        });

        if (onProfileUpdate) {
          onProfileUpdate(updatedUser.user);
        }

        setTimeout(() => {
          setIsEditModalOpen(false);
          setMessage({ text: '', type: '' });
        }, 2000);
      } else {
        const errorData = await response.json();
        setMessage({
          text: errorData.message || 'Failed to update profile. Please try again.',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({
        text: 'Network error. Please check your connection and try again.',
        type: 'error'
      });
    }
  };

  return (
    <>
      {/* Desktop Version */}
      <div className="hidden lg:flex flex-col h-full bg-gradient-to-b from-emerald-50 to-white rounded-lg">
        <div className="px-6 py-8">
          <div className="flex flex-col items-center">
            {/* Profile Picture */}
            <div className="relative group mb-6">
              <div className="w-32 h-32 rounded-full p-1 bg-white/20 backdrop-blur-sm shadow-lg border-4 border-white">
                <img
                  src={user?.profilePicture || defaultAvatar}
                  alt={user?.username || 'User'}
                  className="object-cover w-full h-full rounded-full bg-gray-200"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultAvatar;
                  }}
                />
              </div>
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-400 border-2 border-white rounded-full">
                <div className="w-full h-full bg-green-500 rounded-full animate-ping opacity-75"></div>
              </div>
            </div>

            {/* User Info */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {user?.username || 'Guest User'}
                </h1>
                {user?.isPro && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-500" />
                    Pro
                  </span>
                )}
              </div>
              <p className="text-gray-600 mb-4">{user?.email || 'N/A'}</p>
              <div className="text-sm text-gray-500 flex items-center justify-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Joined {formatJoinDate(user?.createdAt)}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 w-full max-w-xs mb-8">
              <div className="bg-white p-3 rounded-lg shadow-sm text-center border border-gray-100">
                <div className="text-xl font-bold text-gray-900">{user?.recipesCount || 0}</div>
                <div className="text-xs text-gray-500">Recipes</div>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm text-center border border-gray-100">
                <div className="text-xl font-bold text-gray-900">{user?.followersCount || 0}</div>
                <div className="text-xs text-gray-500">Followers</div>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm text-center border border-gray-100">
                <div className="text-xl font-bold text-gray-900">{user?.likesCount || 0}</div>
                <div className="text-xs text-gray-500">Likes</div>
              </div>
            </div>

            {/* Bio */}
            {user?.bio && (
              <div className="w-full max-w-xs mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">About Me</h3>
                  <p className="text-gray-600 text-sm">{user.bio}</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="w-full max-w-xs space-y-3">
              <button
                onClick={handleEditClick}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
              <button className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors">
                <Users className="w-4 h-4" />
                View Followers
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Version */}
      <div className="lg:hidden bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-700 md:rounded-b-xl shadow-lg">
        <div className="px-6 py-8">
          <div className="flex flex-col items-center">
            {/* Profile Picture */}
            <div className="relative group mb-6">
              <div className="w-32 h-32 rounded-full p-1 bg-white/20 backdrop-blur-sm shadow-lg border-4 border-white">
                <img
                  src={user?.profilePicture || defaultAvatar}
                  alt={user?.username || 'User'}
                  className="object-cover w-full h-full rounded-full bg-gray-200"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultAvatar;
                  }}
                />
              </div>
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-400 border-2 border-white rounded-full">
                <div className="w-full h-full bg-green-500 rounded-full animate-ping opacity-75"></div>
              </div>
            </div>

            {/* User Info */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <h1 className="text-2xl font-bold text-white">
                  {user?.username || 'Guest User'}
                </h1>
                {user?.isPro && (
                  <span className="bg-yellow-400 text-yellow-900 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-800" />
                    Pro Chef
                  </span>
                )}
              </div>
              <p className="text-emerald-100 mb-4">{user?.email || 'N/A'}</p>
              <div className="text-sm text-emerald-100 flex items-center justify-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Joined {formatJoinDate(user?.createdAt)}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 w-full mb-8">
              {[
                { label: 'Recipes', value: user?.recipesCount || 0 },
                { label: 'Followers', value: user?.followersCount || 0 },
                { label: 'Likes', value: user?.likesCount || 0 }
              ].map((stat, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-sm p-3 rounded-lg text-center border border-white/20">
                  <div className="text-xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-emerald-100">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3 w-full">
              <button
                onClick={handleEditClick}
                className="flex-1 flex items-center justify-center gap-2 bg-white text-emerald-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 bg-white/10 text-white border border-white/30 px-4 py-2 rounded-lg font-medium hover:bg-white/20 transition-colors">
                <Users className="w-4 h-4" />
                Followers
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        title="Edit Your Profile"
      >
        <EditProfileForm
          user={user}
          onSave={handleSaveProfile}
          onCancel={handleCloseModal}
          message={message}
        />
      </Modal>
    </>
  );
};

export default ProfileHeader;