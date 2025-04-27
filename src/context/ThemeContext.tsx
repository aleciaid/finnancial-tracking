import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppTheme, STORAGE_KEYS, UserPreferences } from '../types';
import { storageService } from '../utils/storage';

interface ThemeContextType {
  theme: AppTheme;
  toggleTheme: () => void;
  setTheme: (theme: AppTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const DEFAULT_THEME: AppTheme = 'light';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<AppTheme>(DEFAULT_THEME);

  // Initialize theme from localStorage
  useEffect(() => { 
    const userPreferences = storageService.getItem<UserPreferences | null>(
      STORAGE_KEYS.USER_PREFERENCES,
      null
    );
    
    setThemeState(userPreferences?.theme || 'light');
  }, []);

  // Update the document's class when theme changes
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
  }, [theme]);

  // Toggle between light and dark theme
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  // Set a specific theme and update localStorage
  const setTheme = (newTheme: AppTheme) => {
    setThemeState(newTheme);
    
    // Update the theme in user preferences
    const userPreferences = storageService.getItem<UserPreferences | null>(
      STORAGE_KEYS.USER_PREFERENCES,
      null
    );
    
    if (userPreferences) {
      const updatedPreferences = {
        ...userPreferences,
        theme: newTheme
      };
      storageService.setItem(STORAGE_KEYS.USER_PREFERENCES, updatedPreferences);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};