import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { api } from '../api/client';
import { User } from '../types';

interface LoginProps {
  onLoginSuccess: (user: User, token: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('alex@outboundio.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/login', { email, password });
      onLoginSuccess(res.user, res.token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <div className="flex items-center gap-3 justify-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
            <Sparkles className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold text-slate-900">Outbound SaaS</span>
        </div>

        <h2 className="text-2xl font-bold text-center text-slate-900 mb-1">Welcome back</h2>
        <p className="text-sm text-center text-slate-500 mb-6">Enter your details to sign in to your workspace</p>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
                placeholder="you@company.com"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-slate-700">Password</label>
              <a href="#" className="text-xs text-indigo-600 hover:underline font-medium">Forgot password?</a>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-md shadow-indigo-100 flex items-center justify-center gap-2 transition"
          >
            {loading ? 'Signing in...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 font-semibold hover:underline">
              Create account
            </Link>
          </p>
        </div>

        <div className="mt-6 p-4 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs text-slate-600">
          <p className="font-semibold text-indigo-900 mb-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-indigo-600" /> Demo Admin Account Ready:
          </p>
          <p>Email: <code className="bg-white px-1.5 py-0.5 rounded font-mono text-indigo-700">alex@outboundio.com</code></p>
          <p>Password: <code className="bg-white px-1.5 py-0.5 rounded font-mono text-indigo-700">password123</code></p>
        </div>
      </div>
    </div>
  );
};
