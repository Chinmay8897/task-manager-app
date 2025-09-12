import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  CheckSquare,
  Plus,
  Settings,
  X,
  Star
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, description: 'Overview of your tasks and progress' },
    { name: 'All Tasks', href: '/tasks', icon: CheckSquare, description: 'View and manage all your tasks' },
    { name: 'Create Task', href: '/tasks/new', icon: Plus, description: 'Add a new task to your list' },
    { name: 'Favorites', href: '/favorites', icon: Star, description: 'Quick access to important tasks' },
  ];

  const secondaryNavigation = [
    { name: 'Settings', href: '/settings', icon: Settings, description: 'Manage your account and preferences' },
  ];

  const NavItem = ({ item, onClick }: { item: typeof navigation[0]; onClick?: () => void }) => (
    <NavLink
      to={item.href}
      onClick={onClick}
      className={({ isActive }) =>
        `group flex items-center px-3 py-2.5 lg:py-3 text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-sm ${
          isActive
            ? 'bg-primary-100 text-primary-900 border-l-4 border-primary-500 shadow-sm'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`
      }
      title={item.description}
      aria-label={`Navigate to ${item.name}: ${item.description}`}
    >
      {({ isActive }) => (
        <>
          <item.icon
            className={`mr-3 flex-shrink-0 h-4 w-4 lg:h-5 lg:w-5 transition-colors duration-200 ${
              isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'
            }`}
            aria-hidden="true"
          />
          <span className="truncate text-sm lg:text-sm">{item.name}</span>
        </>
      )}
    </NavLink>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 xl:w-72 lg:flex-col lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:bg-white lg:pt-5 lg:pb-4">
        <div className="flex flex-col min-h-0 flex-1">
          <div className="flex items-center flex-shrink-0 px-4 lg:px-6 mb-6 lg:mb-8">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 lg:h-9 lg:w-9 bg-primary-600 rounded-lg flex items-center justify-center" aria-hidden="true">
                  <CheckSquare className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-lg lg:text-xl font-bold text-gray-900">Task Manager</h1>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col overflow-y-auto">
            {/* Navigation */}
            <nav className="flex-1 px-3 lg:px-4 space-y-1 lg:space-y-2" aria-label="Main navigation">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2 lg:mb-3">
                Main Menu
              </h2>
              {navigation.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </nav>

            {/* Secondary Navigation */}
            <nav className="mt-4 lg:mt-6 px-3 lg:px-4 space-y-1 lg:space-y-2 border-t border-gray-200 pt-4 lg:pt-6" aria-label="Secondary navigation">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2 lg:mb-3">
                Account
              </h2>
              {secondaryNavigation.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity duration-300 ease-in-out"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Sidebar Panel */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white transform transition-transform duration-300 ease-in-out" role="dialog" aria-modal="true" aria-label="Navigation menu">
            {/* Close button */}
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-colors duration-200 hover:bg-white hover:bg-opacity-20"
                onClick={onClose}
                aria-label="Close navigation menu"
                title="Close menu"
              >
                <span className="sr-only">Close navigation menu</span>
                <X className="h-6 w-6 text-white" aria-hidden="true" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center px-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center" aria-hidden="true">
                      <CheckSquare className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-gray-900">TaskManager</h1>
                    <p className="text-xs text-gray-500 mt-0.5">Organize your tasks efficiently</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="mt-5 px-3 space-y-1" aria-label="Main navigation">
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
                  Main Menu
                </h2>
                {navigation.map((item) => (
                  <NavItem key={item.name} item={item} onClick={onClose} />
                ))}
              </nav>

              {/* Secondary Navigation */}
              <nav className="mt-6 px-3 space-y-1 border-t border-gray-200 pt-4" aria-label="Secondary navigation">
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
                  Account
                </h2>
                {secondaryNavigation.map((item) => (
                  <NavItem key={item.name} item={item} onClick={onClose} />
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
