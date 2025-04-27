import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserCredentials } from '../types';
import { STORAGE_KEYS } from '../types';
import { storageService } from '../utils/storage';
import { hashPassword, verifyPassword, isSessionValid } from '../utils/security';

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserCredentials | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  resetPassword: (username: string, securityAnswer: string, newPassword: string) => Promise<boolean>;
  updateLastActive: () => void;
  checkSessionValidity: () => boolean;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserCredentials | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedUser = storageService.getItem<UserCredentials | null>(
      STORAGE_KEYS.USER_CREDENTIALS,
      null
    );
    
    if (storedUser) {
      // Check if session is still valid (not timed out)
      if (isSessionValid(storedUser.lastActive)) {
        setUser(storedUser);
        setIsAuthenticated(true);
        updateLastActive();
      } else {
        // Session expired, log out
        logout();
      }
    }
    
    setIsLoading(false);
  }, []);

  // Set up inactivity timer
  useEffect(() => {
    if (isAuthenticated) {
      const checkInterval = setInterval(() => {
        if (user && !isSessionValid(user.lastActive)) {
          logout();
          setError('Your session has expired due to inactivity');
        }
      }, 60000); // Check every minute
      
      return () => clearInterval(checkInterval);
    }
  }, [isAuthenticated, user]);

  // Update last active timestamp
  const updateLastActive = () => {
    if (user) {
      const updatedUser = {
        ...user,
        lastActive: Date.now()
      };
      setUser(updatedUser);
      storageService.setItem(STORAGE_KEYS.USER_CREDENTIALS, updatedUser);
    }
  };

  // Check if the current session is valid
  const checkSessionValidity = (): boolean => {
    if (!user) return false;
    return isSessionValid(user.lastActive);
  };

  // Login function
  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const storedUser = storageService.getItem<UserCredentials | null>(
        STORAGE_KEYS.USER_CREDENTIALS,
        null
      );
      
      if (!storedUser || storedUser.username !== username) {
        setError('Invalid username or password');
        return false;
      }
      
      const isPasswordValid = await verifyPassword(password, storedUser.passwordHash);
      
      if (!isPasswordValid) {
        setError('Invalid username or password');
        return false;
      }
      
      const updatedUser = {
        ...storedUser,
        lastActive: Date.now()
      };
      
      setUser(updatedUser);
      setIsAuthenticated(true);
      storageService.setItem(STORAGE_KEYS.USER_CREDENTIALS, updatedUser);
      
      return true;
    } catch (err) {
      setError('An error occurred during login');
      console.error('Login error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (
    username: string, 
    password: string, 
    securityAnswer: string
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if a user already exists
      const existingUser = storageService.getItem<UserCredentials | null>(
        STORAGE_KEYS.USER_CREDENTIALS,
        null
      );
      
      if (existingUser) {
        setError('A user already exists. Only one user is supported in this app.');
        return false;
      }
      
      // Create a new user
      const passwordHash = await hashPassword(password);
      
      const newUser: UserCredentials = {
        username,
        passwordHash,
        securityAnswer,
        lastActive: Date.now()
      };
      
      storageService.setItem(STORAGE_KEYS.USER_CREDENTIALS, newUser);
      setUser(newUser);
      setIsAuthenticated(true);
      
      return true;
    } catch (err) {
      setError('An error occurred during registration');
      console.error('Registration error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    // We don't clear the credentials from localStorage as we need them for login
  };

  // Reset password function
  const resetPassword = async (
    username: string,
    securityAnswer: string,
    newPassword: string
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const storedUser = storageService.getItem<UserCredentials | null>(
        STORAGE_KEYS.USER_CREDENTIALS,
        null
      );
      
      if (!storedUser || storedUser.username !== username) {
        setError('User not found');
        return false;
      }
      
      // Verify security answer (in a real app, this would be hashed)
      if (storedUser.securityAnswer !== securityAnswer) {
        setError('Incorrect security answer');
        return false;
      }
      
      // Update password
      const passwordHash = await hashPassword(newPassword);
      const updatedUser = {
        ...storedUser,
        passwordHash,
        lastActive: Date.now()
      };
      
      storageService.setItem(STORAGE_KEYS.USER_CREDENTIALS, updatedUser);
      return true;
    } catch (err) {
      setError('An error occurred while resetting password');
      console.error('Password reset error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        register,
        logout,
        resetPassword,
        updateLastActive,
        checkSessionValidity,
        isLoading,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};