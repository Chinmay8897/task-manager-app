import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import type { RegisterCredentials } from '../types/auth.types';
import RegisterForm from '../components/Auth/RegisterForm';

const Register: React.FC = () => {
  const { register, isAuthenticated, isLoading } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleRegister = async (credentials: RegisterCredentials) => {
    try {
      await register(credentials);
      toast.success('Account created successfully! Welcome aboard!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Registration Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>
            <h2 className="mt-6 text-2xl font-semibold text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign in here
              </Link>
            </p>
          </div>

          <div className="mt-8">
            <RegisterForm onSubmit={handleRegister} loading={isLoading} />
          </div>
        </div>
      </div>

      {/* Right side - Features */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-blue-600">
          <div className="flex flex-col justify-center items-center h-full text-white p-12">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-4">
                Join Thousands of Users
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Start managing your tasks efficiently today
              </p>
              <div className="grid grid-cols-1 gap-6 text-left max-w-md">
                <div className="bg-white bg-opacity-10 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">🚀 Get Started Quickly</h3>
                  <p className="text-sm opacity-90">
                    Set up your account in under a minute and start organizing immediately
                  </p>
                </div>
                <div className="bg-white bg-opacity-10 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">📱 Works Everywhere</h3>
                  <p className="text-sm opacity-90">
                    Access your tasks from any device, anywhere, anytime
                  </p>
                </div>
                <div className="bg-white bg-opacity-10 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">🔒 Secure & Private</h3>
                  <p className="text-sm opacity-90">
                    Your data is encrypted and protected with industry-standard security
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
