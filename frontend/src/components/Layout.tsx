import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Send, 
  Mail, 
  BarChart3, 
  Settings, 
  User as UserIcon, 
  LogOut,
  Sparkles,
  ChevronRight,
  Bell
} from 'lucide-react';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Leads Management', path: '/leads', icon: Users },
    { label: 'Campaigns', path: '/campaigns', icon: Send },
    { label: 'Email Sequences', path: '/email-sequences', icon: Mail },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Settings', path: '/settings', icon: Settings },
    { label: 'Profile', path: '/profile', icon: UserIcon },
  ];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 shadow-sm">
        <div>
          {/* Logo Header */}
          <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 tracking-tight text-base leading-tight">Outbound SaaS</h1>
              <p className="text-xs text-slate-500 font-medium">Growth Platform</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Main Menu</p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 text-indigo-500" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="truncate">
                <p className="text-sm font-semibold text-slate-900 truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-slate-500 truncate">{user?.company || 'Agency'}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              title="Logout"
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-slate-900">
              {navItems.find((n) => location.pathname.startsWith(n.path))?.label || 'Outbound Platform'}
            </h2>
            <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-indigo-100">
              v1.0 Live
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 relative">
              <Bell className="w-5 h-5" />
              <span className="w-2 h-2 rounded-full bg-indigo-600 absolute top-2 right-2"></span>
            </button>

            <Link
              to="/campaigns/create"
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-sm shadow-indigo-200 transition"
            >
              <Send className="w-4 h-4" />
              New Campaign
            </Link>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
