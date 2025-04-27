import React, { useState, useEffect } from 'react';
import Header from './Header';
import DashboardLayout from '../dashboard/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import TransactionsView from '../transactions/TransactionsView';
import AccountsView from '../accounts/AccountsView';
import SettingsView from '../settings/SettingsView';

type Route = 'dashboard' | 'transactions' | 'accounts' | 'settings';

const AppLayout: React.FC = () => {
  const { updateLastActive } = useAuth();
  const [currentRoute, setCurrentRoute] = useState<Route>('dashboard');
  
  // Set up activity tracking to update last active timestamp
  useEffect(() => {
    const activityEvents = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    
    const handleUserActivity = () => {
      updateLastActive();
    };
    
    // Add event listeners
    activityEvents.forEach(event => {
      window.addEventListener(event, handleUserActivity);
    });
    
    // Clean up
    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, [updateLastActive]);

  const handleNavigate = (route: string) => {
    setCurrentRoute(route as Route);
  };

  const renderContent = () => {
    switch (currentRoute) {
      case 'dashboard':
        return <DashboardLayout />;
      case 'transactions':
        return <TransactionsView />;
      case 'accounts':
        return <AccountsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardLayout />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header onNavigate={handleNavigate} currentRoute={currentRoute} />
      <main>
        {renderContent()}
      </main>
    </div>
  );
};

export default AppLayout;