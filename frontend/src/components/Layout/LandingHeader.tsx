import React, { useState } from 'react';
import {
  CheckSquare,
  Menu,
  X,
  ArrowRight,
  LogIn,
  UserPlus,
  Star,
  Shield,
  Zap
} from 'lucide-react';

interface LandingHeaderProps {
  onLoginClick?: () => void;
  onSignupClick?: () => void;
}

const LandingHeader: React.FC<LandingHeaderProps> = ({
  onLoginClick,
  onSignupClick
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { name: 'Features', href: '#features', icon: Zap },
    { name: 'Pricing', href: '#pricing', icon: Star },
    { name: 'Security', href: '#security', icon: Shield },
    { name: 'About', href: '#about', icon: CheckSquare }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50" role="banner">
      <div className="container-responsive">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <CheckSquare className="h-5 w-5 text-white" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">TaskManager</h1>
              <p className="text-xs text-gray-500 -mt-1 hidden sm:block">
                Smart Task Management
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8" aria-label="Main navigation">
            {navigationItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors duration-200 group"
                aria-label={`Learn about ${item.name.toLowerCase()}`}
              >
                <item.icon className="h-4 w-4 mr-2 text-gray-400 group-hover:text-primary-500 transition-colors duration-200" aria-hidden="true" />
                {item.name}
              </a>
            ))}
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={onLoginClick}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors duration-200"
              aria-label="Sign in to your account"
            >
              <LogIn className="h-4 w-4 mr-2" aria-hidden="true" />
              Sign In
            </button>
            <button
              onClick={onSignupClick}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 shadow-sm hover:shadow-md"
              aria-label="Create a new account"
            >
              <UserPlus className="h-4 w-4 mr-2" aria-hidden="true" />
              Get Started
              <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white animate-fadeIn">
            <div className="px-4 py-6 space-y-6">
              {/* Mobile Navigation Links */}
              <nav className="space-y-4" aria-label="Mobile navigation">
                {navigationItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center text-base font-medium text-gray-700 hover:text-primary-600 transition-colors duration-200 group py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-label={`Learn about ${item.name.toLowerCase()}`}
                  >
                    <item.icon className="h-5 w-5 mr-3 text-gray-400 group-hover:text-primary-500 transition-colors duration-200" aria-hidden="true" />
                    {item.name}
                  </a>
                ))}
              </nav>

              {/* Mobile CTA Buttons */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    onLoginClick?.();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center px-4 py-3 text-base font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
                  aria-label="Sign in to your account"
                >
                  <LogIn className="h-5 w-5 mr-2" aria-hidden="true" />
                  Sign In
                </button>
                <button
                  onClick={() => {
                    onSignupClick?.();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center px-4 py-3 text-base font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 shadow-sm"
                  aria-label="Create a new account"
                >
                  <UserPlus className="h-5 w-5 mr-2" aria-hidden="true" />
                  Get Started
                  <ArrowRight className="h-5 w-5 ml-2" aria-hidden="true" />
                </button>
              </div>

              {/* Mobile Additional Info */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 text-center">
                  Join thousands of teams already using TaskManager
                </p>
                <div className="flex items-center justify-center mt-2 space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" aria-hidden="true" />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">4.9/5 rating</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default LandingHeader;
