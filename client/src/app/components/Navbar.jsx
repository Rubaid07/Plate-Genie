"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../providers/AuthContext';

const Navbar = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-4 shadow-md transition-colors duration-300">
      <div className="container mx-auto max-w-7xl flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold hover:text-blue-500 transition-colors duration-300">
          PlateGenie
        </Link>

        {isLoggedIn ? (
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-10 h-10 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              <img src={user?.profilePicture || 'https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small_2x/default-avatar-profile-icon-of-social-media-user-vector.jpg'} alt={user?.username || 'User'} className="object-cover w-full h-full" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg py-2 z-10 transition-transform duration-300 transform origin-top-right scale-100">
                <p className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
                  {user?.username
                    || 'User Name'}
                </p>
                <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300 shadow-md">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
