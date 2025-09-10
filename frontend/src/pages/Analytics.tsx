import React from 'react';
import Layout from '../components/Layout/Layout';
import { BarChart3, TrendingUp, Clock, CheckCircle } from 'lucide-react';

const Analytics: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600 mt-1">Track your productivity and insights</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-lg bg-blue-100">
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <h3 className="text-xs sm:text-sm font-medium text-gray-500">Completed Tasks</h3>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">24</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-lg bg-yellow-100">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <h3 className="text-xs sm:text-sm font-medium text-gray-500">Pending Tasks</h3>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">8</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-lg bg-green-100">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <h3 className="text-xs sm:text-sm font-medium text-gray-500">Productivity</h3>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">87%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-lg bg-purple-100">
                <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <h3 className="text-xs sm:text-sm font-medium text-gray-500">This Week</h3>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Placeholder */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Dashboard</h3>
              <p className="text-gray-600">Detailed charts and insights coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;
