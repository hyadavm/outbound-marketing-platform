import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Send, 
  Play, 
  Pause, 
  Mail, 
  Users, 
  Zap, 
  Clock,
  Eye,
  MousePointerClick,
  MessageSquare
} from 'lucide-react';
import { api } from '../api/client';
import { Badge } from '../components/Badge';

export const CampaignDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [campaignData, setCampaignData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDetails = async () => {
    try {
      const res = await api.get(`/campaigns/${id}`);
      setCampaignData(res.campaign);
    } catch (err) {
      console.error('Failed to load campaign details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleSimulateBatch = async () => {
    try {
      const res = await api.post('/email/simulate-send', { campaignId: id });
      alert(res.message);
      fetchDetails();
    } catch (err: any) {
      alert(err.message || 'Simulation failed');
    }
  };

  const handleToggleStatus = async () => {
    const newStatus = campaignData.status === 'Active' ? 'Paused' : 'Active';
    try {
      await api.patch(`/campaigns/${id}/status`, { status: newStatus });
      fetchDetails();
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading campaign performance...</div>;
  }

  if (!campaignData) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-600 mb-4">Campaign not found.</p>
        <Link to="/campaigns" className="text-indigo-600 font-semibold hover:underline">
          ← Back to Campaigns
        </Link>
      </div>
    );
  }

  const metrics = campaignData.metrics;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link to="/campaigns" className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900">
          <ArrowLeft className="w-4 h-4" />
          Back to Campaigns
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSimulateBatch}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-sm transition"
          >
            <Zap className="w-4 h-4" />
            Send Email Batch
          </button>
          <button
            onClick={handleToggleStatus}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition border ${
              campaignData.status === 'Active'
                ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            {campaignData.status === 'Active' ? 'Pause Campaign' : 'Activate Campaign'}
          </button>
        </div>
      </div>

      {/* Main Campaign Overview Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-slate-900">{campaignData.name}</h1>
            <Badge status={campaignData.status} />
          </div>
          <p className="text-sm text-slate-500 font-mono">
            Subject: "{campaignData.subject_line}"
          </p>
          <p className="text-xs text-slate-400 mt-1">Created on {campaignData.created_at}</p>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 uppercase font-semibold">Total Target Leads</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{metrics?.totalLeads || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 uppercase font-semibold">Delivered</p>
          <p className="text-2xl font-bold text-indigo-600 mt-1">{metrics?.sent || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 uppercase font-semibold">Open Rate</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{metrics?.openRate || 0}%</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 uppercase font-semibold">Reply Rate</p>
          <p className="text-2xl font-bold text-violet-600 mt-1">{metrics?.replyRate || 0}%</p>
        </div>
      </div>

      {/* Grid: Sequences & Enrolled Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Email Sequence Steps */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Mail className="w-4 h-4 text-indigo-600" />
            Configured Sequence Steps ({campaignData.sequences?.length || 0})
          </h3>

          <div className="space-y-4">
            {campaignData.sequences && campaignData.sequences.map((seq: any) => (
              <div key={seq.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                    Step {seq.step_number}
                  </span>
                  <span className="text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Delay: {seq.delay_days} days
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-900">Subject: {seq.subject}</p>
                <p className="text-xs text-slate-600 font-mono whitespace-pre-wrap line-clamp-3 bg-white p-2.5 rounded border border-slate-200/60">
                  {seq.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Enrolled Prospects List */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" />
            Enrolled Prospects & Status
          </h3>

          <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
            {campaignData.leads && campaignData.leads.map((l: any) => (
              <div key={l.campaign_lead_id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    {l.first_name} {l.last_name}
                  </p>
                  <p className="text-[11px] text-slate-500">{l.company} • {l.email}</p>
                </div>
                <Badge status={l.campaign_lead_status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
