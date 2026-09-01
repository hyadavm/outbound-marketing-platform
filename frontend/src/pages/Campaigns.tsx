import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Send, 
  Plus, 
  Search, 
  Play, 
  Pause, 
  Trash2, 
  BarChart2, 
  Mail, 
  Users, 
  ChevronRight,
  Zap
} from 'lucide-react';
import { api } from '../api/client';
import { Campaign, CampaignStatus } from '../types';
import { Badge } from '../components/Badge';

export const Campaigns: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/campaigns?search=${search}`);
      setCampaigns(res.data);
    } catch (err) {
      console.error('Failed to fetch campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCampaigns();
  };

  const handleToggleStatus = async (e: React.MouseEvent, campaign: Campaign) => {
    e.stopPropagation();
    const newStatus: CampaignStatus = campaign.status === 'Active' ? 'Paused' : 'Active';
    try {
      await api.patch(`/campaigns/${campaign.id}/status`, { status: newStatus });
      fetchCampaigns();
    } catch (err) {
      console.error('Toggle status error:', err);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this campaign?')) return;
    try {
      await api.delete(`/campaigns/${id}`);
      fetchCampaigns();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleSimulateSend = async (e: React.MouseEvent, campaignId: string) => {
    e.stopPropagation();
    try {
      const res = await api.post('/email/simulate-send', { campaignId });
      alert(res.message);
      fetchCampaigns();
    } catch (err: any) {
      alert(err.message || 'Simulate send failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Outbound Email Campaigns</h1>
          <p className="text-sm text-slate-500">Create, schedule, and automate automated outreach sequences</p>
        </div>
        <Link
          to="/campaigns/create"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-sm shadow-indigo-200 transition"
        >
          <Plus className="w-4 h-4" />
          Create New Campaign
        </Link>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search campaigns by name or subject line..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
          />
        </form>
      </div>

      {/* Campaigns Cards List */}
      {loading ? (
        <div className="p-8 text-center text-slate-400">Loading campaigns...</div>
      ) : campaigns.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
          <Send className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800 mb-1">No Campaigns Created Yet</h3>
          <p className="text-xs text-slate-500 mb-4">Start your first automated outbound email campaign sequence now.</p>
          <Link
            to="/campaigns/create"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold inline-block"
          >
            Create Campaign
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {campaigns.map((c) => (
            <div
              key={c.id}
              onClick={() => navigate(`/campaigns/${c.id}`)}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-bold text-slate-900 hover:text-indigo-600 transition">
                    {c.name}
                  </h3>
                  <Badge status={c.status} />
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  Subject: <span className="font-mono text-slate-700">"{c.subject_line}"</span>
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span>Created {c.created_at}</span>
                  <span>•</span>
                  <span>{c.sequenceStepsCount || 1} Sequence Steps</span>
                </div>
              </div>

              {/* Metrics Pills */}
              <div className="grid grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-center min-w-[320px]">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Leads</p>
                  <p className="text-sm font-bold text-slate-900">{c.metrics?.totalLeads || 0}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Sent</p>
                  <p className="text-sm font-bold text-slate-900">{c.metrics?.sent || 0}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Open Rate</p>
                  <p className="text-sm font-bold text-emerald-600">{c.metrics?.openRate || 0}%</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Reply Rate</p>
                  <p className="text-sm font-bold text-indigo-600">{c.metrics?.replyRate || 0}%</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={(e) => handleSimulateSend(e, c.id)}
                  title="Simulate Sending Emails Now"
                  className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-indigo-200 transition"
                >
                  <Zap className="w-3.5 h-3.5 text-indigo-600" />
                  Send Batch
                </button>

                <button
                  onClick={(e) => handleToggleStatus(e, c)}
                  className={`p-2 rounded-lg border text-xs font-semibold transition ${
                    c.status === 'Active'
                      ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
                      : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  }`}
                  title={c.status === 'Active' ? 'Pause Campaign' : 'Activate Campaign'}
                >
                  {c.status === 'Active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>

                <button
                  onClick={(e) => handleDelete(e, c.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  title="Delete Campaign"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <ChevronRight className="w-5 h-5 text-slate-300 ml-2" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
