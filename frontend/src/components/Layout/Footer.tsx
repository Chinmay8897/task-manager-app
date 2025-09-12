import React from 'react';
import {
  CheckSquare
} from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200" role="contentinfo">
      <div className="container-responsive">
        {/* Main Footer Content */}
        <div className="py-8 sm:py-12 lg:py-16">
          <div className="grid grid-cols-1 gap-6 sm:gap-8">
            {/* Brand Section */}
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="h-6 w-6 sm:h-8 sm:w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <CheckSquare className="h-3 w-3 sm:h-5 sm:w-5 text-white" aria-hidden="true" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Task Manager</h2>
              </div>
              <p className="text-gray-600 text-sm max-w-md mx-auto px-4">
                Streamline your workflow and boost productivity with our intuitive task management platform.
                Organize, prioritize, and collaborate seamlessly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
