import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider } from './context/DataContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthScreen from './components/auth/AuthScreen';
import AppLayout from './components/layout/AppLayout';
import LandingPage from './components/landing/LandingPage';
import { useAuth } from './context/AuthContext'; 
import { useEffect, useRef } from 'react';
import SupportWidget from './components/ui/SupportWidget';

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  
  useEffect(() => {
    // Load Ko-fi widget script
    const script = document.createElement('script');
    script.src = 'https://storage.ko-fi.com/cdn/scripts/overlay-widget.js';
    script.async = true;
    scriptRef.current = script;
    document.body.appendChild(script);

    return () => {
      if (scriptRef.current) {
        document.body.removeChild(scriptRef.current);
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your financial data...</p>
        </div>
      </div>
    );
  }
  
  return isAuthenticated ? <AppLayout /> : <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<AuthScreen />} />
    <Route path="*" element={<LandingPage />} />
  </Routes>;
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <DataProvider>
            <AppContent />
            <SupportWidget />
          </DataProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;