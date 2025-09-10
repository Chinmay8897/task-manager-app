import React from 'react';
import Layout from '../components/Layout/Layout';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarPage: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
            <p className="text-gray-600 mt-1">View your tasks in calendar format</p>
          </div>
        </div>

        {/* Calendar Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">September 2025</h2>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Calendar View Placeholder */}
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Calendar View</h3>
              <p className="text-gray-600">Calendar functionality coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CalendarPage;
