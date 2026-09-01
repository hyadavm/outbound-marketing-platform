import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { User } from './types';
import { api } from './api/client';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';

import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Leads } from './pages/Leads';
import { LeadDetails } from './pages/LeadDetails';
import { Campaigns } from './pages/Campaigns';
import { CreateCampaign } from './pages/CreateCampaign';
import { CampaignDetails } from './pages/CampaignDetails';
import { EmailSequences } from './pages/EmailSequences';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';
import { Profile } from './pages/Profile';

export const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('outbound_auth_token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.user);
          setIsAuthenticated(true);
        } catch (err) {
          console.error('Session expired:', err);
          localStorage.removeItem('outbound_auth_token');
        }
      }
      setCheckingAuth(false);
    };
    checkUser();
  }, []);

  const handleLoginSuccess = (userData: User, token: string) => {
    localStorage.setItem('outbound_auth_token', token);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('outbound_auth_token');
    setUser(null);
    setIsAuthenticated(false);
  };

  if (checkingAuth) {
    return (
      <div className="h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login onLoginSuccess={handleLoginSuccess} />
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register onLoginSuccess={handleLoginSuccess} />
          }
        />

        {/* Protected App Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Layout user={user} onLogout={handleLogout}>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/leads" element={<Leads />} />
                  <Route path="/leads/:id" element={<LeadDetails />} />
                  <Route path="/campaigns" element={<Campaigns />} />
                  <Route path="/campaigns/create" element={<CreateCampaign />} />
                  <Route path="/campaigns/:id" element={<CampaignDetails />} />
                  <Route path="/email-sequences" element={<EmailSequences />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/profile" element={<Profile user={user} onUserUpdate={(u) => setUser(u)} />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
