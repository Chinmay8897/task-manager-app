import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import Layout from '../components/Layout/Layout';
import TaskForm from '../components/Task/TaskForm';
import { Star, Plus, Search } from 'lucide-react';
import type { CreateTaskData, UpdateTaskData } from '../types/task.types';
import { taskService } from '../services/tasks';

const Favorites: React.FC = () => {
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
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Favorites</h1>
            <p className="text-gray-600 mt-1">Quick access to your important tasks</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search favorites..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        {/* Favorites List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
                <p className="text-gray-600 mb-4">Mark important tasks as favorites for quick access</p>
                <button
                  onClick={() => setShowTaskForm(true)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Task</span>
                </button>
              </div>
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

export default Favorites;
