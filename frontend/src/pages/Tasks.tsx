import React from 'react';
import Layout from '../components/Layout/Layout';
import { CheckSquare, Plus, Filter, Search } from 'lucide-react';

const Tasks: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-4 sm:space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">All Tasks</h1>
            <p className="text-gray-600 mt-1">Manage and organize all your tasks</p>
          </div>
          <button className="btn-primary flex items-center justify-center space-x-2 w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            <span>New Task</span>
          </button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <button className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 w-full sm:w-auto">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>
        </div>

        {/* Tasks List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
                <p className="text-gray-600 mb-4">Get started by creating your first task</p>
                <button className="btn-primary">Create Task</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Tasks;
