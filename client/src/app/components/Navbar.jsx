'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home as HomeIcon, 
  Soup, 
  LogOut, 
  User, 
  ChevronDown, 
  Menu,
  X, 
  WandSparkles
} from 'lucide-react';
import { useAuth } from '../providers/AuthContext';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const navItems = [
    { href: '/', label: 'Home', icon: <HomeIcon className="w-5 h-5" /> },
    { 
      href: '/generate-recipe', 
      label: 'Generate Recipe', 
      icon: <WandSparkles className="w-5 h-5" />,
      protected: true
    },
  ];

  const filteredNavItems = navItems.filter(item => 
    !item.protected || (item.protected && isLoggedIn)
  );

  const isActive = (path) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 relative">
        <div className="flex items-center gap-4">
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          
          <Link href="/" className="flex items-center gap-2 font-bold text-gray-800">
            <Soup className="h-6 w-6 text-green-600" />
            <span className="hidden sm:inline-block text-lg">PlateGenie</span>
          </Link>
        </div>
        <div className="flex items-center gap-1">
        <div className="hidden md:flex items-center gap-1">
          {filteredNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? 'bg-green-50 text-green-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>
          {isLoggedIn ? (
            <div className="relative">
              <button
                className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-50 border border-gray-200"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="h-8 w-8 rounded-full overflow-hidden">
                  <img
                    src={user?.profilePicture || "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small_2x/default-avatar-icon-of-social-media-user-vector.jpg"}
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:inline-block">
                  {user?.username || 'Account'}
                </span>
                <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-md border border-gray-200 bg-white shadow-lg z-50">
                  <Link
                    href="/profile"
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center px-4 py-3 text-sm text-red-500 hover:bg-red-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <Link
                href="/login"
                className="text-sm font-medium py-2 px-4 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Sign In
              </Link>
              <Link
                href="/login"
                className="bg-green-600 text-white text-sm font-medium py-2 px-4 rounded-md hover:bg-green-700 transition"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="container px-4 py-3 space-y-1">
            {filteredNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 w-full px-3 py-3 rounded-md text-sm font-medium ${
                  isActive(item.href)
                    ? 'bg-green-50 text-green-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}

            {isLoggedIn && (
              <>
                <Link
                  href="/profile"
                  className="flex items-center gap-3 w-full px-3 py-3 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <User className="h-5 w-5" />
                  Profile
                </Link>
                <button
                  className="flex items-center gap-3 w-full px-3 py-3 rounded-md text-sm font-medium text-red-500 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}