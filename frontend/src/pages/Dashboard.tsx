import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Send, 
  MailOpen, 
  MousePointerClick, 
  MessageSquare, 
  Plus, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { api } from '../api/client';
import { AnalyticsOverview } from '../types';
import { StatCard } from '../components/StatCard';
import { Badge } from '../components/Badge';

export const Dashboard: React.FC = () => {
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/analytics/overview');
        setData(res);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const summary = data?.summary;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 rounded-2xl p-6 text-white shadow-md flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">Outbound Campaign Workspace</h1>
          <p className="text-indigo-100 text-sm">
            You have <span className="font-semibold text-white">{summary?.activeCampaigns} active campaigns</span> running and delivering pipeline.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/leads"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-semibold backdrop-blur-xs transition"
          >
            Import Leads
          </Link>
          <Link
            to="/campaigns/create"
            className="px-4 py-2 bg-white text-indigo-700 hover:bg-indigo-50 rounded-lg text-sm font-bold shadow-sm transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Launch Campaign
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Leads Managed"
          value={summary?.totalLeads || 0}
          subtitle="Prospects in database"
          icon={Users}
          trend={{ value: '12%', isPositive: true }}
        />
        <StatCard
          title="Total Emails Delivered"
          value={summary?.totalEmailsSent || 0}
          subtitle="Sequence emails sent"
          icon={Send}
          trend={{ value: '18%', isPositive: true }}
        />
        <StatCard
          title="Avg Open Rate"
          value={`${summary?.openRate || 0}%`}
          subtitle="Target: >45%"
          icon={MailOpen}
          trend={{ value: '4.2%', isPositive: true }}
        />
        <StatCard
          title="Response Rate"
          value={`${summary?.replyRate || 0}%`}
          subtitle="Interested meetings booked"
          icon={MessageSquare}
          trend={{ value: '1.5%', isPositive: true }}
        />
      </div>

      {/* Main Grid: Funnel & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Email Funnel Progress */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Outbound Conversion Funnel</h3>
              <p className="text-xs text-slate-500">Real-time performance across sequence emails</p>
            </div>
            <Link to="/analytics" className="text-xs font-semibold text-indigo-600 hover:underline">
              View Analytics →
            </Link>
          </div>

          {/* Bar Visualizer */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1 text-slate-700">
                <span>Emails Delivered</span>
                <span>{summary?.totalEmailsSent} (100%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3">
                <div className="bg-indigo-600 h-3 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1 text-slate-700">
                <span>Opened</span>
                <span>{summary?.openRate}% Rate</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3">
                <div className="bg-violet-600 h-3 rounded-full" style={{ width: `${summary?.openRate}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1 text-slate-700">
                <span>Clicked Link</span>
                <span>{summary?.clickRate}% Rate</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3">
                <div className="bg-sky-500 h-3 rounded-full" style={{ width: `${summary?.clickRate}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1 text-slate-700">
                <span>Replied / Interested</span>
                <span>{summary?.replyRate}% Rate</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3">
                <div className="bg-emerald-500 h-3 rounded-full" style={{ width: `${summary?.replyRate}%` }}></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
            <div className="p-3 bg-slate-50 rounded-lg text-center">
              <p className="text-xs text-slate-500">Active Sequences</p>
              <p className="text-lg font-bold text-slate-900">{summary?.activeCampaigns}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg text-center">
              <p className="text-xs text-slate-500">Bounced Rate</p>
              <p className="text-lg font-bold text-slate-900">{summary?.bounced || 0}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg text-center">
              <p className="text-xs text-slate-500">Meeting Rate</p>
              <p className="text-lg font-bold text-emerald-600">8.4%</p>
            </div>
          </div>
        </div>

        {/* Live Activity Stream */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                Live Campaign Feed
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            </div>

            <div className="space-y-4">
              {data?.recentActivity && data.recentActivity.length > 0 ? (
                data.recentActivity.slice(0, 5).map((evt) => (
                  <div key={evt.id} className="flex gap-3 text-xs border-b border-slate-50 pb-3 last:border-0">
                    <div className="mt-0.5">
                      <Badge status={evt.event_type} />
                    </div>
                    <div className="flex-1 truncate">
                      <p className="font-semibold text-slate-900 truncate">
                        {evt.first_name} {evt.last_name}
                      </p>
                      <p className="text-slate-500 truncate">{evt.metadata || evt.campaign_name}</p>
                      <p className="text-slate-400 text-[10px] mt-0.5">{evt.timestamp}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">No recent email interactions logged.</p>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <Link
              to="/campaigns"
              className="w-full block text-center py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg transition"
            >
              View All Campaigns
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
