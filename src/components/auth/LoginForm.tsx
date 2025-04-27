import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, Lock, User } from 'lucide-react';

interface LoginFormProps {
  onRegisterClick: () => void;
  showRegister: boolean;
  onForgotPassword: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onRegisterClick, showRegister, onForgotPassword }) => {
  const { login, isLoading, error } = useAuth();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!username.trim()) {
      setFormError('Username is required');
      return;
    }
    
    if (!password) {
      setFormError('Password is required');
      return;
    }
    
    setFormError(null);
    
    try {
      const success = await login(username, password);
      
      if (!success && !error) {
        setFormError('Invalid username or password');
      }
    } catch (err) {
      setFormError('An error occurred during login');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Sign in to access your financial dashboard
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {(error || formError) && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-3 rounded-md text-sm">
            {error || formError}
          </div>
        )}
        
        <div className="space-y-2">
          <label 
            htmlFor="username" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Username
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <User size={18} className="text-gray-500 dark:text-gray-400" />
            </div>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full pl-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                        shadow-sm placeholder-gray-400 
                        focus:outline-none focus:ring-blue-500 focus:border-blue-500 
                        dark:bg-gray-700 dark:text-white"
              placeholder="Enter your username"
              disabled={isLoading}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label 
            htmlFor="password" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Lock size={18} className="text-gray-500 dark:text-gray-400" />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-10 pr-10 px-3 py-2 border border-gray-300 dark:border-gray-600 
                        rounded-md shadow-sm placeholder-gray-400 
                        focus:outline-none focus:ring-blue-500 focus:border-blue-500 
                        dark:bg-gray-700 dark:text-white"
              placeholder="Enter your password"
              disabled={isLoading}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onForgotPassword();
            }}
            className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 
                     dark:hover:text-blue-300 focus:outline-none cursor-pointer"
          >
            Forgot password?
          </a>
        </div>
        
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
                      shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                      disabled:opacity-50 disabled:cursor-not-allowed transition-colors
                      dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>
      </form>
      {showRegister && (
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onRegisterClick}
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 
                       focus:outline-none"
          >
            Register
          </button>
        </p>
      </div>
      )}
    </div>
  );
};

export default LoginForm;