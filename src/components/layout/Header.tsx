import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { user } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-6">
      <button
        className="md:hidden p-2 -ml-2 text-gray-600"
        onClick={onMenuClick}
      >
        <Menu className="h-6 w-6" />
      </button>

      <div className="flex flex-1 items-center justify-end gap-4 md:justify-between md:gap-8">
        <div className="hidden lg:flex lg:flex-1 lg:max-w-md relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="search"
            placeholder="Search dashboard..."
            className="w-full rounded-md border border-gray-200 bg-gray-50 pl-9 pr-4 py-2 text-sm outline-none focus:border-[#e7b008] focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-4">
          <button className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>

          <div className="flex items-center gap-3">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name || 'Admin'}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role || 'Super Admin'}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
              {user?.name?.[0] || 'A'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
