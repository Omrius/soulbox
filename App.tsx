
import React, { useState, useEffect } from 'react';
// Fix: Add .tsx extension to imports
import { useAuth } from './contexts/AuthContext';
import { useI18n } from './contexts/I18nContext';
// Fix: Corrected import paths to be relative
// Fix: Add .tsx extension to component imports
import LandingPage from './components/LandingPage';
// Fix: Add .tsx extension to component imports
import LoginPage from './components/LoginPage';
// Fix: Add .tsx extension to component imports
import DashboardLayout from './components/DashboardLayout';
// Fix: Add .tsx extension to component imports
import ProcheDashboard from './components/PublicChatPortal';
// Fix: Add .tsx extension to component imports
import AdminDashboardLayout from './components/AdminDashboardLayout';

const App: React.FC = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { isLoaded: isI18nLoaded } = useI18n();
  // State to manage which public page is shown when not authenticated
  const [publicView, setPublicView] = useState<'landing' | 'login'>('landing');

  useEffect(() => {
    // This allows direct navigation to the login page via URL, e.g., for shared links
    const path = window.location.pathname;
    if (path.startsWith('/login') || path.startsWith('/portal') || path.startsWith('/admin')) {
      setPublicView('login');
    }
  }, []);

  if (isAuthLoading || !isI18nLoaded) {
    return (
      <div className="loading-screen">
        Loading...
      </div>
    );
  }
  
  // If the user is authenticated, route based on their role
  if (user) {
    if (user.role === 'CLONE') {
       return <DashboardLayout />;
    }
    if (user.role === 'CONSULTEUR') {
        return <ProcheDashboard />;
    }
    if (user.role === 'ADMIN') {
        return <AdminDashboardLayout />;
    }
  }

  // If not authenticated, show the public-facing pages based on state
  if (publicView === 'login') {
    const path = window.location.pathname;
    const initialView = path.startsWith('/portal') ? 'consulteur' : path.startsWith('/admin') ? 'admin' : 'clone';
    // The link back to home on LoginPage will reload the page, resetting state correctly.
    return <LoginPage initialView={initialView} />;
  }
  
  // Default to Landing Page
  return <LandingPage onLoginClick={() => setPublicView('login')} />;
};

export default App;