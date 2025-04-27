import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, Shield, Clock, PieChart, Wallet,
  ChevronRight, Star, CheckCircle, ArrowRight,
  Lock, Zap, Globe, Users
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  // Animated counter for statistics
  const [counters, setCounters] = React.useState({ users: 0, savings: 0, security: 0 });
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCounters(prev => ({
        users: prev.users < 10000 ? prev.users + 100 : prev.users,
        savings: prev.savings < 25 ? prev.savings + 1 : prev.savings,
        security: prev.security < 100 ? prev.security + 1 : prev.security
      }));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <BarChart3 className="w-8 h-8 text-blue-500" />,
      title: "Smart Financial Tracking",
      description: "Monitor your income and expenses with intelligent categorization and real-time insights."
    },
    {
      icon: <Shield className="w-8 h-8 text-green-500" />,
      title: "Secure & Private",
      description: "Your financial data stays on your device with enterprise-grade encryption."
    },
    {
      icon: <Clock className="w-8 h-8 text-purple-500" />,
      title: "Time-Saving Automation",
      description: "Automate recurring transactions and get instant financial reports."
    },
    {
      icon: <PieChart className="w-8 h-8 text-orange-500" />,
      title: "Visual Analytics",
      description: "Understand your spending patterns with beautiful, interactive charts."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Small Business Owner",
      content: "This app has transformed how I manage my business finances. The insights are invaluable!",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Freelancer",
      content: "Finally, a finance app that's both powerful and easy to use. Highly recommended!",
      rating: 5
    },
    {
      name: "Emma Davis",
      role: "Personal Finance Enthusiast",
      content: "The best tool I've found for tracking my savings goals and daily expenses.",
      rating: 5
    }
  ];

  const benefits = [
    {
      metric: "40%",
      title: "Time Saved",
      description: "Reduce time spent on financial management"
    },
    {
      metric: "25%",
      title: "Better Savings",
      description: "Average increase in monthly savings"
    },
    {
      metric: "100%",
      title: "Privacy",
      description: "Your data stays on your device"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                <span className="block">Take Control of</span>
                <span className="block text-blue-600 dark:text-blue-500">Your Finances</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 dark:text-gray-300 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Transform your financial future with our intelligent tracking and analytics platform. Experience the power of data-driven financial management.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left">
                <button
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Login to Dashboard
                  <ChevronRight className="ml-2 -mr-1 h-5 w-5" />
                </button>
                <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Lock className="w-4 h-4 mr-2" />
                  <span>Bank-grade security</span>
                  <span className="mx-2">•</span>
                  <Globe className="w-4 h-4 mr-2" />
                  <span>Cloud sync</span>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-500">
                    {counters.users.toLocaleString()}+
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-500">
                    {counters.savings}%
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Avg. Savings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-500">
                    {counters.security}%
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Secure</div>
                </div>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                <img
                  className="w-full rounded-lg"
                  src="https://images.pexels.com/photos/6802042/pexels-photo-6802042.jpeg"
                  alt="Dashboard preview"
                  loading="lazy"
                />
                <div className="absolute -bottom-4 -right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
                  <Wallet className="w-8 h-8 text-blue-500" />
                  <div className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Smart Tracking</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Powerful Features for Your Financial Success
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 lg:mx-auto">
              Everything you need to manage your finances effectively, all in one place.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <div key={index} className="relative p-6 bg-white dark:bg-gray-700 rounded-xl shadow-sm hover:shadow-lg transition-all transform hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <div className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400">
              <Users className="w-5 h-5" />
              <span className="text-sm font-medium">
                Join {(counters.users / 1000).toFixed(1)}k+ users already managing their finances
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Real Results, Real Benefits
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, index) => (
              <div key={index} className="relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-lg transition-shadow">
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-500 mb-2">
                  {benefit.metric}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-300">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white text-center mb-12">
            What Our Users Say
          </h2>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  "{testimonial.content}"
                </p>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-8">
            Start Managing Your Finances Today
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-600 focus:ring-white transition-all transform hover:-translate-y-1"
            >
              Login to Dashboard
              <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
            </button>
            <button
              onClick={() => navigate('/register')}
              className="inline-flex items-center px-6 py-3 border-2 border-white text-base font-medium rounded-md text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-600 focus:ring-white transition-colors"
            >
              Create Account
              <CheckCircle className="ml-2 -mr-1 h-5 w-5" />
            </button>
          </div>
          <div className="mt-8 flex justify-center space-x-6">
            <div className="flex items-center text-white/80">
              <Lock className="w-5 h-5 mr-2" /> End-to-end encryption
            </div>
            <div className="flex items-center text-white/80">
              <Zap className="w-5 h-5 mr-2" /> Real-time sync
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;