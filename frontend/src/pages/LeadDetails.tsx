import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Building, 
  Briefcase, 
  Calendar, 
  Star, 
  Send, 
  History,
  CheckCircle,
  Save
} from 'lucide-react';
import { api } from '../api/client';
import { Lead, LeadStatus } from '../types';
import { Badge } from '../components/Badge';

export const LeadDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [leadData, setLeadData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState<LeadStatus>('New');
  const [score, setScore] = useState<number>(50);
  const [updating, setUpdating] = useState(false);

  const fetchLeadDetails = async () => {
    try {
      const res = await api.get(`/leads/${id}`);
      setLeadData(res.lead);
      setStatus(res.lead.status);
      setScore(res.lead.score);
    } catch (err) {
      console.error('Error fetching lead details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeadDetails();
  }, [id]);

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      await api.put(`/leads/${id}`, { status, score });
      await fetchLeadDetails();
      alert('Lead status and score updated successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to update lead');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading lead details...</div>;
  }

  if (!leadData) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-600 mb-4">Lead not found.</p>
        <Link to="/leads" className="text-indigo-600 font-semibold hover:underline">
          ← Back to Leads
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <Link to="/leads" className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900">
          <ArrowLeft className="w-4 h-4" />
          Back to Leads Database
        </Link>
        <button
          onClick={handleUpdate}
          disabled={updating}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-sm transition"
        >
          <Save className="w-4 h-4" />
          {updating ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Main Profile Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-2xl flex items-center justify-center">
            {leadData.first_name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">
                {leadData.first_name} {leadData.last_name}
              </h1>
              <Badge status={leadData.status} />
            </div>
            <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-slate-400" />
              {leadData.title || 'No Title'} at <span className="font-semibold text-slate-700">{leadData.company || 'Unknown Company'}</span>
            </p>
          </div>
        </div>

        {/* Lead Score & Status Modifier */}
        <div className="flex items-center gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200 w-full md:w-auto justify-between">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as LeadStatus)}
              className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-sm font-semibold text-slate-800"
            >
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Converted">Converted</option>
              <option value="Unsubscribed">Unsubscribed</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Lead Score</label>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <input
                type="number"
                min={0}
                max={100}
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                className="w-16 bg-white border border-slate-200 px-2 py-1 rounded-lg text-sm font-bold text-slate-900 text-center"
              />
              <span className="text-xs text-slate-400">/ 100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Contact Information & Campaign History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Info Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Contact Details</h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 text-slate-700">
              <Mail className="w-4 h-4 text-indigo-600" />
              <span className="font-mono text-xs text-slate-900">{leadData.email}</span>
            </div>

            <div className="flex items-center gap-3 text-slate-700">
              <Phone className="w-4 h-4 text-indigo-600" />
              <span>{leadData.phone || 'Not provided'}</span>
            </div>

            <div className="flex items-center gap-3 text-slate-700">
              <Building className="w-4 h-4 text-indigo-600" />
              <span>{leadData.company || 'Not provided'}</span>
            </div>

            <div className="flex items-center gap-3 text-slate-700">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span className="text-xs text-slate-500">Added on {leadData.created_at}</span>
            </div>
          </div>
        </div>

        {/* Campaign & Email History */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-600" />
            Outbound Campaign Interactions & Activity History
          </h3>

          {leadData.campaignHistory && leadData.campaignHistory.length > 0 ? (
            <div className="space-y-4">
              {leadData.campaignHistory.map((ch: any) => (
                <div key={ch.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{ch.campaign_name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Subject: "{ch.subject_line}"</p>
                    <p className="text-[10px] text-slate-400 mt-1">Last activity: {ch.sent_at || 'Pending send'}</p>
                  </div>
                  <Badge status={ch.status} />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <Send className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500">This lead is not currently enrolled in any active campaign.</p>
              <Link to="/campaigns" className="text-xs font-semibold text-indigo-600 hover:underline mt-2 inline-block">
                Enroll in Campaign →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
