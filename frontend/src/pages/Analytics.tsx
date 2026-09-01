import React, { useEffect, useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  MailOpen, 
  MousePointerClick, 
  MessageSquare, 
  Users, 
  PieChart, 
  Calendar
} from 'lucide-react';
import { api } from '../api/client';
import { AnalyticsOverview } from '../types';
import { StatCard } from '../components/StatCard';
import { Badge } from '../components/Badge';

export const Analytics: React.FC = () => {
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [campaignPerf, setCampaignPerf] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [overviewRes, campaignRes] = await Promise.all([
          api.get('/analytics/overview'),
          api.get('/analytics/campaigns')
        ]);
        setData(overviewRes);
        setCampaignPerf(campaignRes.campaigns);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading analytics reports...</div>;
  }

  const summary = data?.summary;
  const timeSeries = data?.timeSeriesData || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Campaign Performance & Analytics</h1>
        <p className="text-sm text-slate-500">Track email open rates, click-throughs, response rates, and pipeline generation</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Sent"
          value={summary?.totalEmailsSent || 0}
          subtitle="Outbound emails delivered"
          icon={BarChart3}
        />
        <StatCard
          title="Open Rate"
          value={`${summary?.openRate || 0}%`}
          subtitle="Unique opens"
          icon={MailOpen}
          color="emerald"
        />
        <StatCard
          title="Click Rate"
          value={`${summary?.clickRate || 0}%`}
          subtitle="Call-to-action clicks"
          icon={MousePointerClick}
          color="sky"
        />
        <StatCard
          title="Reply Rate"
          value={`${summary?.replyRate || 0}%`}
          subtitle="Meetings booked"
          icon={MessageSquare}
          color="violet"
        />
      </div>

      {/* Time Series Chart Representation */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Weekly Activity & Engagement Metrics</h3>
            <p className="text-xs text-slate-500">Sent vs Opened vs Clicked vs Replied (Last 7 Days)</p>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg border border-slate-200 text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>This Week</span>
          </div>
        </div>

        {/* Visual Bar Chart Grid */}
        <div className="grid grid-cols-7 gap-4 h-64 items-end pt-6 border-b border-slate-100 pb-4">
          {timeSeries.map((item, idx) => {
            const maxVal = Math.max(...timeSeries.map((t) => t.sent)) || 1;
            const sentHeight = (item.sent / maxVal) * 100;
            const openHeight = (item.opened / maxVal) * 100;

            return (
              <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                <div className="w-full flex items-end justify-center gap-1.5 h-full relative">
                  {/* Sent Bar */}
                  <div
                    style={{ height: `${sentHeight}%` }}
                    className="w-1/2 bg-indigo-500 hover:bg-indigo-600 rounded-t transition-all"
                    title={`Sent: ${item.sent}`}
                  ></div>
                  {/* Opened Bar */}
                  <div
                    style={{ height: `${openHeight}%` }}
                    className="w-1/2 bg-emerald-500 hover:bg-emerald-600 rounded-t transition-all"
                    title={`Opened: ${item.opened}`}
                  ></div>
                </div>
                <span className="text-xs font-semibold text-slate-600">{item.date}</span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-indigo-500"></span>
            <span className="text-slate-600">Emails Sent</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-emerald-500"></span>
            <span className="text-slate-600">Opened</span>
          </div>
        </div>
      </div>

      {/* Campaign Performance Leaderboard */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">
          Campaign Performance Leaderboard
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Campaign Name</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Target Prospects</th>
                <th className="py-3 px-4">Delivered</th>
                <th className="py-3 px-4">Open Rate</th>
                <th className="py-3 px-4">Click Rate</th>
                <th className="py-3 px-4">Reply Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {campaignPerf.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{c.name}</td>
                  <td className="py-3.5 px-4"><Badge status={c.status} /></td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">{c.totalTarget}</td>
                  <td className="py-3.5 px-4 text-slate-700">{c.sent}</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-600">{c.openRate}%</td>
                  <td className="py-3.5 px-4 text-sky-600 font-semibold">{c.clickRate}%</td>
                  <td className="py-3.5 px-4 font-bold text-indigo-600">{c.replyRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
