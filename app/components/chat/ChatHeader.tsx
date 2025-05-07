'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ChatHeaderProps {
  username: string;
  onlinePeopleCount: number;
}

export default function ChatHeader({ username, onlinePeopleCount }: ChatHeaderProps) {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    router.push('/auth/login');
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
      <div className="flex items-center space-x-4 space-x-reverse">
        <h1 className="text-xl font-semibold">چت‌نگار</h1>
        <span className="text-sm text-gray-500">
          {onlinePeopleCount} کاربر آنلاین
        </span>
      </div>
      
      <div className="relative">
        <button
          className="flex items-center space-x-2 space-x-reverse"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <span className="font-medium">{username}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 transform transition-transform ${
              showDropdown ? 'rotate-180' : ''
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        
        {showDropdown && (
          <div className="absolute left-0 z-10 w-48 mt-2 bg-white rounded-md shadow-lg">
            <div className="py-1">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-sm text-right text-gray-700 hover:bg-gray-100"
              >
                خروج از حساب کاربری
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}