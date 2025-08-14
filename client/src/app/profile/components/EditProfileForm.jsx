// src/app/profile/components/EditProfile.jsx
"use client";

import { useState, useEffect } from 'react';
import { UploadCloud, X, User, Link as LinkIcon, Camera, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';

const EditProfileForm = ({ user, onSave, onCancel, message }) => {
  const [formData, setFormData] = useState({
    username: '',
    profilePicture: ''
  });
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (user) {
      const initialData = {
        username: user.username || '',
        profilePicture: user.profilePicture || ''
      };
      setFormData(initialData);
      setPreviewImage(user.profilePicture || '');
    }
  }, [user]);

  useEffect(() => {
    // Check if form has changes
    if (user) {
      const hasChanged = 
        formData.username !== (user.username || '') ||
        formData.profilePicture !== (user.profilePicture || '');
      setHasChanges(hasChanged);
    }
  }, [formData, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'profilePicture') {
      if (value.trim()) {
        setImageLoading(true);
        setPreviewImage(value);
      } else {
        setPreviewImage('');
        setImageLoading(false);
      }
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setPreviewImage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username.trim()) {
      return;
    }

    setLoading(true);
    await onSave(formData);
    setLoading(false);
  };

  const clearImage = () => {
    setFormData(prev => ({ ...prev, profilePicture: '' }));
    setPreviewImage('');
    setImageLoading(false);
  };

  return (
    <div className="">
      <form onSubmit={handleSubmit} className="p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Picture Section */}
          <div className="lg:col-span-1">
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <Camera className="w-5 h-5 text-green-600" />
                <label className="text-lg font-semibold text-gray-800">Profile Picture</label>
              </div>
              
              <div className="relative group">
                {previewImage ? (
                  <div className="relative">
                    <div className="w-full aspect-square max-w-sm mx-auto rounded-2xl overflow-hidden border-4 border-green-100 shadow-lg">
                      {imageLoading && (
                        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
                          <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-500 border-t-transparent"></div>
                        </div>
                      )}
                      <img 
                        src={previewImage} 
                        alt="Profile preview" 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                      title="Remove image"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="w-full aspect-square max-w-sm mx-auto rounded-2xl border-3 border-dashed border-gray-300 bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center group-hover:border-green-400 group-hover:bg-green-100 transition-all duration-300">
                    <div className="text-center p-6">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                        <UploadCloud className="w-8 h-8 text-green-600" />
                      </div>
                      <p className="text-gray-600 font-medium mb-1">Add Profile Picture</p>
                      <p className="text-sm text-gray-500">Paste an image URL below</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form Fields Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <label 
                htmlFor="username" 
                className="flex items-center gap-2 text-lg font-semibold text-gray-800"
              >
                <User className="w-5 h-5 text-green-600" />
                Username
              </label>
              <div className={`relative transition-all duration-200 ${
                focusedField === 'username' ? 'transform scale-[1.01]' : ''
              }`}>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className={`w-full px-4 py-4 border-2 rounded-xl shadow-sm bg-gray-50 text-gray-900 placeholder-gray-500 transition-all duration-200 focus:outline-none focus:bg-white focus:shadow-md ${
                    focusedField === 'username' 
                      ? 'border-green-400 ring-4 ring-green-100' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  value={formData.username}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField(null)}
                  required
                  placeholder="Enter your username"
                  maxLength={50}
                />
                <div className="absolute top-3 right-3 text-xs text-gray-400">
                  {formData.username.length}/50
                </div>
              </div>
            </div>

            {/* Profile Picture URL  */}
            <div className="space-y-2">
              <label 
                htmlFor="profilePicture" 
                className="flex items-center gap-2 text-lg font-semibold text-gray-800"
              >
                <LinkIcon className="w-5 h-5 text-green-600" />
                Profile Picture URL
                <span className="text-sm font-normal text-gray-500">(Optional)</span>
              </label>
              <div className={`relative transition-all duration-200 ${
                focusedField === 'profilePicture' ? 'transform scale-[1.01]' : ''
              }`}>
                <input
                  type="url"
                  id="profilePicture"
                  name="profilePicture"
                  className={`w-full px-4 py-4 border-2 rounded-xl shadow-sm bg-gray-50 text-gray-900 placeholder-gray-500 transition-all duration-200 focus:outline-none focus:bg-white focus:shadow-md ${
                    focusedField === 'profilePicture' 
                      ? 'border-green-400 ring-4 ring-green-100' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  value={formData.profilePicture}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('profilePicture')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="https://example.com/your-profile-picture.jpg"
                />
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                💡 <span>Tip: Use a square image (1:1 ratio) for best results</span>
              </div>
            </div>

            {/* Message Display */}
            {message && message.text && (
              <div className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                message.type === 'success' 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                <div className="flex items-center gap-3">
                  {message.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  )}
                  <span className="font-medium">{message.text}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-3 disabled:cursor-not-allowed ${
                  hasChanges && !loading
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
                disabled={loading || !hasChanges || !formData.username.trim()}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
            
            {hasChanges && (
              <p className="text-sm text-green-600 text-center mt-2 flex items-center justify-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                You have unsaved changes
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProfileForm;