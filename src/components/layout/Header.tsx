import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, User, Settings, LogOut, Moon, Sun, FileText, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

interface HeaderProps {
  onNavigate: (route: string) => void;
  currentRoute: string;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentRoute }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  
  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
  };

  const navItems = [
    { name: 'Dashboard', icon: <Home size={18} />, route: 'dashboard' },
    { name: 'Transactions', icon: <FileText size={18} />, route: 'transactions' },
    { name: 'Accounts', icon: <User size={18} />, route: 'accounts' },
    { name: 'Settings', icon: <Settings size={18} />, route: 'settings' },
  ];

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo and app name */}
          <div 
            className="flex items-center space-x-2 cursor-pointer" 
            onClick={() => onNavigate('dashboard')}
          >
            <div className="bg-blue-600 dark:bg-blue-700 p-1.5 rounded-full">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="w-5 h-5 text-white"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">FinanceTrack</span>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map(item => (
              <button
                key={item.route}
                onClick={() => onNavigate(item.route)}
                className={`flex items-center text-sm font-medium transition-colors ${
                  currentRoute === item.route
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                <span className="mr-1.5">{item.icon}</span>
                {item.name}
              </button>
            ))}
          </nav>

          {/* User profile and mobile menu toggle */}
          <div className="flex items-center space-x-4">
            {/* User profile dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="h-9 w-9 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center 
                              text-blue-600 dark:text-blue-300 border-2 border-white dark:border-gray-800
                              ring-2 ring-gray-200 dark:ring-gray-700">
                  <User size={18} />
                </div>
                <span className="hidden sm:inline-block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user?.username}
                </span>
              </button>
              
              {/* Profile dropdown menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg 
                               py-1 z-50 ring-1 ring-gray-200 dark:ring-gray-700">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Signed in as</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {user?.username}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onNavigate('settings');
                      setIsProfileOpen(false);
                    }}
                    className="w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-300 
                              hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  >
                    <Settings size={16} className="mr-2" />
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-sm text-left text-red-600 dark:text-red-400 
                              hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  >
                    <LogOut size={16} className="mr-2" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
            
            {/* Mobile menu toggle */}
            <button
              type="button"
              className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 
                        hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile navigation menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 shadow-md" ref={menuRef}>
          <div className="px-4 py-3 space-y-1">
            {navItems.map(item => (
              <button
                key={item.route}
                onClick={() => {
                  onNavigate(item.route);
                  setIsMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md ${
                  currentRoute === item.route
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </button>
            ))}
            <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-md
                          text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <LogOut size={18} />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;