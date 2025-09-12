import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import type { LoginCredentials } from '../types/auth.types';
import LoginForm from '../components/Auth/LoginForm';

const Login: React.FC = () => {
  const { login, isAuthenticated, isLoading } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      await login(credentials);
      toast.success('Welcome back!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Login Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>
            <h2 className="mt-6 text-2xl font-semibold text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Create one here
              </Link>
            </p>
          </div>

          <div className="mt-8">
            <LoginForm onSubmit={handleLogin} loading={isLoading} />
          </div>

          {/* Demo credentials */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2"></h3>
            <p className="text-xs text-gray-600">
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Image/Branding */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800">
          <div className="flex flex-col justify-center items-center h-full text-white p-12">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-4">
                Organize Your Tasks
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Stay productive with our intuitive task management system
              </p>
              <div className="grid grid-cols-1 gap-4 text-left max-w-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-sm">✓</span>
                  </div>
                  <span>Create and organize tasks</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-sm">📊</span>
                  </div>
                  <span>Track progress and statistics</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-sm">🔔</span>
                  </div>
                  <span>Never miss deadlines</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
