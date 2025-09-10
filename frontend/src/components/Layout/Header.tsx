import React, { useState } from 'react';
import { Menu, Bell, User, LogOut, Settings, Search, Plus } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface HeaderProps {
  onMenuToggle?: () => void;
  onCreateTask?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, onCreateTask }) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <div className="container-responsive">
        <div className="flex justify-between items-center h-16">
          {/* Left section */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button
              onClick={onMenuToggle}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 lg:hidden transition-colors duration-200"
              aria-label="Open navigation menu"
              title="Open navigation menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Center section - Search (Desktop) */}
          <div className="hidden lg:block flex-1 max-w-md mx-4 xl:mx-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all duration-200"
                placeholder="Search your tasks..."
                aria-label="Search tasks"
                title="Search through your tasks by title or description"
              />
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-1 sm:space-x-3">
            {/* Search button - Mobile only */}
            <button
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 lg:hidden transition-colors duration-200"
              aria-label="Search tasks"
              title="Search your tasks"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Create task button */}
            <button
              onClick={onCreateTask}
              className="btn-primary flex items-center space-x-1 sm:space-x-2 text-sm px-2 sm:px-4 py-2 transition-all duration-200 hover:shadow-md"
              aria-label="Create new task"
              title="Create a new task"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden md:inline">New Task</span>
              <span className="md:hidden">New</span>
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 relative transition-colors duration-200"
                aria-label={`View notifications ${showNotifications ? '(open)' : ''}`}
                title="View your notifications"
              >
                <Bell className="h-5 w-5" />
                {/* Notification badge */}
                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" aria-hidden="true" />
              </button>

              {/* Notifications dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 animate-fadeIn">
                  <div className="py-1">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                      <p className="text-xs text-gray-500 mt-1">Stay updated with your task progress</p>
                    </div>
                    <div className="max-h-48 sm:max-h-64 overflow-y-auto">
                      <div className="px-4 py-6 text-sm text-gray-500 text-center">
                        <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                        <p>No new notifications</p>
                        <p className="text-xs mt-1">You're all caught up!</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-200"
                aria-label={`User menu for ${user?.name || 'User'} ${showUserMenu ? '(open)' : ''}`}
                title="Open user menu"
              >
                <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-primary-600" />
                </div>
                <span className="hidden md:block text-sm font-medium">
                  {user?.name || 'User'}
                </span>
              </button>

              {/* User dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-44 sm:w-48 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 animate-fadeIn">
                  <div className="py-1">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user?.name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.email || 'user@example.com'}
                      </p>
                    </div>
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      aria-label="Open settings"
                      title="Manage your account settings"
                    >
                      <Settings className="mr-3 h-4 w-4" />
                      Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      aria-label="Sign out of your account"
                      title="Sign out"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile search bar */}
      <div className="md:hidden px-4 pb-4">
        <label htmlFor="mobile-search" className="sr-only">Search tasks</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            id="mobile-search"
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all duration-200"
            placeholder="Search your tasks..."
            aria-label="Search tasks on mobile"
            title="Search through your tasks by title or description"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
