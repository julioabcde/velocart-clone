// src/components/header/HeaderIndex.tsx
'use client';

import SearchBar from './HeaderSearchBar';
import DateDisplay from './HeaderDate';
import { useAuth } from '@/context/AuthContext';
import { LogIn, LogOut, User } from 'lucide-react';
import { useEffect, useState } from 'react';

const Header = () => {
  const { isLoggedIn, logout } = useAuth();
  const [staffName, setStaffName] = useState('');

  useEffect(() => {
    // Get staff info from localStorage
    const name = localStorage.getItem('staffId');
    if (name) setStaffName(name);
  }, [isLoggedIn]);

  return (
    <header className="sticky top-0 z-30 bg-white border-b shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 gap-4">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <SearchBar />
        </div>

        {/* Right side: Date & Auth */}
        <div className="flex items-center gap-4">
          {/* Date Display */}
          <div className="hidden md:block">
            <DateDisplay />
          </div>

          {/* User Info & Logout */}
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                <User className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium">{staffName}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => (window.location.href = '/login')}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;