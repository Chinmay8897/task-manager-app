import React from 'react';
import {
  CheckSquare,
  Users,
  Shield,
  Zap,
  ArrowRight,
  Star,
  Play,
  Award,
  TrendingUp
} from 'lucide-react';
import PublicLayout from '../components/Layout/PublicLayout';

const LandingPage: React.FC = () => {
  const handleLoginClick = () => {
    // Navigate to login page
    // TODO: Implement navigation to login
  };

  const handleSignupClick = () => {
    // Navigate to signup page
    // TODO: Implement navigation to signup
  };

  const features = [
    {
      icon: CheckSquare,
      title: 'Smart Task Management',
      description: 'Organize, prioritize, and track your tasks with intelligent automation and insights.'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Work together seamlessly with real-time updates, comments, and file sharing.'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level security with encryption, SSO, and compliance certifications.'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Experience blazing-fast performance with our optimized cloud infrastructure.'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Active Teams' },
    { number: '2M+', label: 'Tasks Completed' },
    { number: '99.9%', label: 'Uptime' },
    { number: '4.9/5', label: 'User Rating' }
  ];

  return (
    <PublicLayout onLoginClick={handleLoginClick} onSignupClick={handleSignupClick}>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-indigo-100 py-20 lg:py-32">
        <div className="container-responsive">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
                <Award className="h-4 w-4 mr-2" />
                #1 Task Management Platform
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Organize Your Work.
              <span className="text-primary-600"> Amplify Your Impact.</span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Transform the way your team works with TaskManager's intelligent task management platform.
              Boost productivity, streamline workflows, and achieve more together.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button
                onClick={handleSignupClick}
                className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>

              <button className="inline-flex items-center px-8 py-4 text-lg font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </button>
            </div>

            <p className="text-sm text-gray-500">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container-responsive">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container-responsive">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to stay organized
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features designed to help teams of all sizes work smarter, not harder.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="container-responsive">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to transform your productivity?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of teams who have already revolutionized their workflow with TaskManager.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleSignupClick}
                className="inline-flex items-center px-8 py-4 text-lg font-semibold text-primary-600 bg-white border border-transparent rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all duration-200 shadow-lg"
              >
                Start Your Free Trial
                <TrendingUp className="ml-2 h-5 w-5" />
              </button>
            </div>

            <div className="mt-8 flex items-center justify-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
              <span className="text-primary-100 ml-3">
                4.9/5 from 1,000+ reviews
              </span>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default LandingPage;
