import React, { useEffect, useState } from 'react';
import { Mail, Clock, Plus, Save, Trash2, Sparkles } from 'lucide-react';
import { api } from '../api/client';
import { Campaign, EmailSequence } from '../types';

export const EmailSequences: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('');
  const [sequences, setSequences] = useState<EmailSequence[]>([]);
  const [loading, setLoading] = useState(true);

  // New sequence form
  const [newSubject, setNewSubject] = useState('');
  const [newBody, setNewBody] = useState('');
  const [newDelay, setNewDelay] = useState(2);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await api.get('/campaigns?limit=50');
        setCampaigns(res.data);
        if (res.data.length > 0) {
          setSelectedCampaignId(res.data[0].id);
        }
      } catch (err) {
        console.error('Failed to load campaigns:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  const fetchSequences = async (campaignId: string) => {
    if (!campaignId) return;
    try {
      const res = await api.get(`/email/sequences?campaignId=${campaignId}`);
      setSequences(res.sequences);
    } catch (err) {
      console.error('Failed to load sequences:', err);
    }
  };

  useEffect(() => {
    if (selectedCampaignId) {
      fetchSequences(selectedCampaignId);
    }
  }, [selectedCampaignId]);

  const handleAddStep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaignId) return alert('Select a campaign first');
    try {
      await api.post('/email/sequences', {
        campaignId: selectedCampaignId,
        step_number: sequences.length + 1,
        delay_days: newDelay,
        subject: newSubject,
        body: newBody
      });
      setNewSubject('');
      setNewBody('');
      setNewDelay(2);
      fetchSequences(selectedCampaignId);
    } catch (err: any) {
      alert(err.message || 'Failed to add step');
    }
  };

  const handleDeleteStep = async (id: string) => {
    if (!window.confirm('Delete sequence step?')) return;
    try {
      await api.delete(`/email/sequences/${id}`);
      fetchSequences(selectedCampaignId);
    } catch (err) {
      console.error('Delete step failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Email Sequence Templates</h1>
          <p className="text-sm text-slate-500">Configure multi-step automated email workflows with dynamic variable tags</p>
        </div>

        {/* Campaign Dropdown Selector */}
        <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-xs">
          <label className="text-xs font-semibold text-slate-500 uppercase px-2">Campaign:</label>
          <select
            value={selectedCampaignId}
            onChange={(e) => setSelectedCampaignId(e.target.value)}
            className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-sm font-bold text-slate-900 focus:outline-none"
          >
            {campaigns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid: Sequence Steps & Add New Step */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sequence Steps Timeline */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-bold text-slate-900">Configured Sequence Workflow</h2>

          {sequences.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
              No sequence steps configured for this campaign yet. Use the editor on the right to add Step 1.
            </div>
          ) : (
            sequences.map((seq, index) => (
              <div key={seq.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                      #{seq.step_number}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">{seq.subject}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Delay: {seq.delay_days} days
                    </span>
                    <button
                      onClick={() => handleDeleteStep(seq.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg font-mono text-xs text-slate-800 whitespace-pre-wrap border border-slate-200/60">
                  {seq.body}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Step Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4 h-fit">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Plus className="w-4 h-4 text-indigo-600" />
            Add Follow-Up Sequence Step
          </h3>

          <form onSubmit={handleAddStep} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Delay (Days after previous step)</label>
              <input
                type="number"
                min={0}
                value={newDelay}
                onChange={(e) => setNewDelay(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Step Subject *</label>
              <input
                type="text"
                required
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="e.g. Quick follow-up on {{company}}"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Body *</label>
              <textarea
                rows={5}
                required
                value={newBody}
                onChange={(e) => setNewBody(e.target.value)}
                placeholder="Hi {{first_name}},\n\nWanted to check if you had a chance..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-sans text-slate-900"
              />
            </div>

            <div className="p-3 bg-indigo-50/60 rounded-lg border border-indigo-100 text-[11px] text-slate-600">
              <span className="font-semibold text-indigo-900 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Insert Variables:
              </span>
              <div className="flex gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setNewBody((prev) => prev + ' {{first_name}}')}
                  className="bg-white px-2 py-0.5 rounded border border-indigo-200 font-mono text-indigo-700"
                >
                  {"{{first_name}}"}
                </button>
                <button
                  type="button"
                  onClick={() => setNewBody((prev) => prev + ' {{company}}')}
                  className="bg-white px-2 py-0.5 rounded border border-indigo-200 font-mono text-indigo-700"
                >
                  {"{{company}}"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-sm transition flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Sequence Step
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
