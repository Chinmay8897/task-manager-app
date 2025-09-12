import React, { useState } from 'react';
import {
  CheckSquare,
  Menu,
  X,
  Search,
  Bell,
  Settings,
  User,
  LogOut,
  Plus,
  Home
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface AppHeaderProps {
  onMobileMenuToggle?: () => void;
  onCreateTask?: () => void;
  isMobileMenuOpen?: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  onMobileMenuToggle,
  onCreateTask,
  isMobileMenuOpen = false
}) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    try {
      await logout();
      setShowUserMenu(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    // TODO: Add search functionality
  };

  const quickActions = [
    { name: 'Dashboard', icon: Home, href: '/dashboard' }
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50" role="banner">
      <div className="container-responsive">
        <div className="flex items-center justify-between h-16">
          {/* Left Section: Logo and Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <button
              onClick={onMobileMenuToggle}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 lg:hidden transition-all duration-200"
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>

            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <CheckSquare className="h-5 w-5 text-white" aria-hidden="true" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">TaskManager</h1>
                <p className="text-xs text-gray-500 -mt-1">Productivity Suite</p>
              </div>
            </div>
          </div>

          {/* Center Section: Search (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="search"
                  placeholder="Search tasks, projects, or team members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                  aria-label="Search across all content"
                />
              </div>
            </form>
          </div>

          {/* Right Section: Actions and User Menu */}
          <div className="flex items-center space-x-3">
            {/* Quick Actions (Desktop) */}
            <div className="hidden lg:flex items-center space-x-2">
              {quickActions.map((action) => (
                <a
                  key={action.name}
                  href={action.href}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                  title={`Go to ${action.name}`}
                  aria-label={`Navigate to ${action.name}`}
                >
                  <action.icon className="h-5 w-5" aria-hidden="true" />
                </a>
              ))}
            </div>

            {/* Create Task Button */}
            <button
              onClick={onCreateTask}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 shadow-sm hover:shadow-md"
              aria-label="Create a new task"
            >
              <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
              <span className="hidden sm:inline">New Task</span>
              <span className="sm:hidden">New</span>
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 relative transition-all duration-200"
                aria-label={`Notifications ${showNotifications ? '(open)' : ''}`}
                aria-expanded={showNotifications}
                aria-haspopup="true"
              >
                <Bell className="h-5 w-5" aria-hidden="true" />
                {/* Notification Badge */}
                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" aria-hidden="true" />
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-10 animate-fadeIn">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="text-gray-400 hover:text-gray-600"
                        aria-label="Close notifications"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div className="text-center py-8">
                        <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No new notifications</p>
                        <p className="text-sm text-gray-400">You're all caught up!</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 text-gray-700 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                aria-label={`User menu for ${user?.name || 'User'} ${showUserMenu ? '(open)' : ''}`}
                aria-expanded={showUserMenu}
                aria-haspopup="true"
              >
                <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-primary-600" aria-hidden="true" />
                </div>
                <span className="hidden md:block text-sm font-medium max-w-32 truncate">
                  {user?.name || 'User'}
                </span>
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-10 animate-fadeIn">
                  <div className="p-4 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {user?.email || 'user@example.com'}
                    </p>
                  </div>
                  <div className="py-2">
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      aria-label="Open account settings"
                    >
                      <Settings className="mr-3 h-4 w-4" aria-hidden="true" />
                      Account Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      aria-label="Sign out of your account"
                    >
                      <LogOut className="mr-3 h-4 w-4" aria-hidden="true" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden px-4 pb-4">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="search"
                placeholder="Search tasks and projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                aria-label="Search on mobile"
              />
            </div>
          </form>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
