import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, ArrowLeft } from 'lucide-react';

interface PasswordResetFormProps {
  onBack: () => void;
}

const PasswordResetForm: React.FC<PasswordResetFormProps> = ({ onBack }) => {
  const { resetPassword, isLoading, error } = useAuth();
  const [username, setUsername] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!username.trim()) {
      setFormError('Username is required');
      return;
    }

    if (!securityAnswer.trim()) {
      setFormError('Security answer is required');
      return;
    }

    if (newPassword.length < 6) {
      setFormError('New password must be at least 6 characters');
      return;
    }

    try {
      const success = await resetPassword(username, securityAnswer, newPassword);
      if (success) {
        setSuccess(true);
      }
    } catch (err) {
      setFormError('Failed to reset password. Please check your information.');
    }
  };

  if (success) {
    return (
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 
                         rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Password Reset Successful</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Your password has been reset successfully. You can now log in with your new password.
          </p>
        </div>
        <button
          onClick={onBack}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
                    shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Return to Login
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
      <button
        onClick={onBack}
        className="mb-6 flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 
                  dark:hover:text-gray-200 transition-colors"
      >
        <ArrowLeft size={16} className="mr-1" />
        Back to Login
      </button>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reset Password</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Enter your information to reset your password
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {(error || formError) && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-3 rounded-md text-sm">
            {error || formError}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Username
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <User size={18} className="text-gray-500 dark:text-gray-400" />
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full pl-10 px-3 py-2 border border-gray-300 dark:border-gray-600 
                        rounded-md shadow-sm placeholder-gray-400 
                        focus:outline-none focus:ring-blue-500 focus:border-blue-500 
                        dark:bg-gray-700 dark:text-white"
              placeholder="Enter your username"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            What is your mother's maiden name? (Security Question)
          </label>
          <input
            type="text"
            value={securityAnswer}
            onChange={(e) => setSecurityAnswer(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                      rounded-md shadow-sm placeholder-gray-400 
                      focus:outline-none focus:ring-blue-500 focus:border-blue-500 
                      dark:bg-gray-700 dark:text-white"
            placeholder="Enter your answer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                      rounded-md shadow-sm placeholder-gray-400 
                      focus:outline-none focus:ring-blue-500 focus:border-blue-500 
                      dark:bg-gray-700 dark:text-white"
            placeholder="Enter new password"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Password must be at least 6 characters long
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
                    shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                    disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Resetting Password...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
};

export default PasswordResetForm;