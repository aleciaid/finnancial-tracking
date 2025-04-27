import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { Moon, Sun } from 'lucide-react'; 
import { useTheme } from '../../context/ThemeContext'; 
import { storageService } from '../../utils/storage';
import { STORAGE_KEYS } from '../../types';
import PasswordResetForm from './PasswordResetForm';

const AuthScreen: React.FC = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const userExists = storageService.getItem(STORAGE_KEYS.USER_CREDENTIALS, null) !== null;

  const handleForgotPassword = () => {
    setIsLoginView(false);
    setIsPasswordReset(true);
  };

  const handleBackToLogin = () => {
    setIsLoginView(true);
    setIsPasswordReset(false);
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 py-12 transition-colors duration-200">
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 
                    shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none 
                    focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
      
      <div className="w-full max-w-md flex flex-col items-center">
        <div className="mb-8 flex items-center">
          <div className="bg-blue-600 dark:bg-blue-700 p-3 rounded-full">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="w-8 h-8 text-white"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <h1 className="ml-3 text-3xl font-bold text-gray-900 dark:text-white">FinanceTrack</h1>
        </div>
        
        {isLoginView ? (
          <LoginForm 
            onRegisterClick={() => setIsLoginView(false)} 
            showRegister={!userExists}
            onForgotPassword={handleForgotPassword}
          />
        ) : isPasswordReset ? (
          <PasswordResetForm onBack={handleBackToLogin} />
        ) : (
          <RegisterForm onLoginClick={() => setIsLoginView(true)} />
        )}
        
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>FinanceTrack – Your secure personal finance tracker</p>
          <p className="mt-1">All data is stored securely on your device.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;