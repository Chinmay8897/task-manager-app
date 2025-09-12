import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import Layout from '../components/Layout/Layout';
import TaskForm from '../components/Task/TaskForm';
import { User, Bell, ChevronRight } from 'lucide-react';
import type { CreateTaskData, UpdateTaskData } from '../types/task.types';
import { taskService } from '../services/tasks';

const SettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [showTaskForm, setShowTaskForm] = useState(false);

  const handleCreateTask = async (taskData: CreateTaskData | UpdateTaskData) => {
    try {
      await taskService.createTask(taskData as CreateTaskData);
      setShowTaskForm(false);
      toast.success('Task created successfully');
    } catch (error) {
      console.error('Create task error:', error);
      toast.error('Failed to create task');
    }
  };

  return (
    <Layout onCreateTask={() => setShowTaskForm(true)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account and preferences</p>
        </div>

        {/* Settings Layout */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Settings Navigation - Mobile First */}
          <div className="w-full lg:w-64 lg:flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveSection('profile')}
                  className={`w-full flex items-center justify-between px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeSection === 'profile'
                      ? 'text-primary-600 bg-primary-50 border-l-4 border-primary-500'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </div>
                  <ChevronRight className="h-4 w-4 lg:hidden" />
                </button>

                <button
                  onClick={() => setActiveSection('notifications')}
                  className={`w-full flex items-center justify-between px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeSection === 'notifications'
                      ? 'text-primary-600 bg-primary-50 border-l-4 border-primary-500'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Bell className="h-4 w-4" />
                    <span>Notifications</span>
                  </div>
                  <ChevronRight className="h-4 w-4 lg:hidden" />
                </button>
              </nav>
            </div>
          </div>

          {/* Settings Content */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              {activeSection === 'profile' && (
                <div className="p-4 sm:p-6 lg:p-8">
                  <div className="mb-6">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Profile Information</h3>
                    <p className="text-gray-600 mt-1">Update your account details and profile information.</p>
                  </div>

                  <div className="space-y-6">
                    {/* Profile Picture Section */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-shrink-0">
                        <div className="h-20 w-20 bg-primary-100 rounded-full flex items-center justify-center">
                          <User className="h-8 w-8 text-primary-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">Profile Picture</h4>
                        <p className="text-sm text-gray-600 mt-1">Choose a profile picture to personalize your account.</p>
                        <div className="mt-3 flex flex-col sm:flex-row gap-3">
                          <button className="btn-secondary text-sm">Upload New</button>
                          <button className="btn-ghost text-sm text-red-600 hover:text-red-700">Remove</button>
                        </div>
                      </div>
                    </div>

                    {/* Name Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                          placeholder="Enter your first name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                          placeholder="Enter your last name"
                        />
                      </div>
                    </div>

                    {/* Email Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        placeholder="Enter your email"
                      />
                    </div>

                    {/* Bio Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                      </label>
                      <textarea
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                        placeholder="Tell us about yourself"
                      />
                      <p className="text-xs text-gray-500 mt-1">Write a short description about yourself.</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-6 border-t border-gray-200">
                      <button className="btn-ghost order-2 sm:order-1">
                        Cancel
                      </button>
                      <button className="btn-primary order-1 sm:order-2">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'notifications' && (
                <div className="p-4 sm:p-6 lg:p-8">
                  <div className="mb-6">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Notification Preferences</h3>
                    <p className="text-gray-600 mt-1">Choose how you want to be notified about updates.</p>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                          <p className="text-sm text-gray-600">Receive notifications via email</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between py-3">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">Push Notifications</h4>
                          <p className="text-sm text-gray-600">Receive push notifications in your browser</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-6 border-t border-gray-200">
                      <button className="btn-ghost order-2 sm:order-1">
                        Cancel
                      </button>
                      <button className="btn-primary order-1 sm:order-2">
                        Save Preferences
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Task Form Modal */}
      {showTaskForm && (
        <TaskForm
          onSubmit={handleCreateTask}
          onClose={() => setShowTaskForm(false)}
        />
      )}
    </Layout>
  );
};

export default SettingsPage;
