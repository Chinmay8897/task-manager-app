import React from 'react';
import Layout from '../components/Layout/Layout';
import { Users, UserPlus, Mail, Settings } from 'lucide-react';

const Team: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Team</h1>
            <p className="text-gray-600 mt-1">Collaborate with team members</p>
          </div>
          <button className="btn-primary flex items-center space-x-2">
            <UserPlus className="h-4 w-4" />
            <span>Invite Member</span>
          </button>
        </div>

        {/* Team Members */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Team Members</h3>

            {/* Sample Team Member */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-medium">JD</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">John Doe</h4>
                    <p className="text-sm text-gray-500">john@example.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    Admin
                  </span>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Settings className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>

            {/* Empty State */}
            <div className="flex items-center justify-center py-12 mt-8">
              <div className="text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Invite your team</h3>
                <p className="text-gray-600 mb-4">Start collaborating by inviting team members</p>
                <button className="btn-primary flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>Send Invitation</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Team;
