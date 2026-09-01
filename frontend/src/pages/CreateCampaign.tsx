import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Send, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Users, 
  Mail, 
  Clock,
  Sparkles
} from 'lucide-react';
import { api } from '../api/client';
import { Lead } from '../types';

export const CreateCampaign: React.FC = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [subjectLine, setSubjectLine] = useState('');

  // Sequences
  const [sequences, setSequences] = useState([
    {
      step_number: 1,
      delay_days: 0,
      subject: "Quick question about {{company}}'s growth strategy",
      body: 'Hi {{first_name}},\n\nI noticed {{company}} has been scaling rapidly.\n\nWe help sales teams automate outbound pipeline generation by 3x.\n\nWould you be open to a quick 10-minute chat this week?\n\nBest regards,\nAlex'
    },
    {
      step_number: 2,
      delay_days: 3,
      subject: 'Following up on my previous message',
      body: 'Hi {{first_name}},\n\nJust bumping this to the top of your inbox. Did you get a chance to review my previous note regarding {{company}}?\n\nLooking forward to connecting.\n\nBest,\nAlex'
    }
  ]);

  // Lead selection
  const [availableLeads, setAvailableLeads] = useState<Lead[]>([]);
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await api.get('/leads?limit=100');
        setAvailableLeads(res.data);
        // Default select all available leads
        setSelectedLeadIds(res.data.map((l: Lead) => l.id));
      } catch (err) {
        console.error('Failed to load leads for campaign:', err);
      } finally {
        setLoadingLeads(false);
      }
    };
    fetchLeads();
  }, []);

  const handleAddSequence = () => {
    setSequences([
      ...sequences,
      {
        step_number: sequences.length + 1,
        delay_days: 3,
        subject: `Step ${sequences.length + 1}: Follow-up`,
        body: 'Hi {{first_name}},\n\nFollowing up...'
      }
    ]);
  };

  const handleRemoveSequence = (index: number) => {
    if (sequences.length <= 1) {
      alert('A campaign must have at least 1 sequence step.');
      return;
    }
    setSequences(sequences.filter((_, i) => i !== index));
  };

  const toggleLead = (id: string) => {
    if (selectedLeadIds.includes(id)) {
      setSelectedLeadIds(selectedLeadIds.filter((item) => item !== id));
    } else {
      setSelectedLeadIds([...selectedLeadIds, id]);
    }
  };

  const handleLaunch = async () => {
    if (!name.trim() || !subjectLine.trim()) {
      alert('Please provide a campaign name and default subject line.');
      return;
    }
    if (selectedLeadIds.length === 0) {
      alert('Please select at least 1 lead for this campaign.');
      return;
    }

    try {
      await api.post('/campaigns', {
        name,
        subject_line: subjectLine,
        status: 'Active',
        sequences,
        leadIds: selectedLeadIds
      });
      alert('Campaign created and launched successfully!');
      navigate('/campaigns');
    } catch (err: any) {
      alert(err.message || 'Failed to create campaign');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link to="/campaigns" className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900">
          <ArrowLeft className="w-4 h-4" />
          Back to Campaigns
        </Link>
        <h1 className="text-xl font-bold text-slate-900">Campaign Creation Wizard</h1>
      </div>

      {/* Step Stepper Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex items-center justify-between">
        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-indigo-600 font-bold' : 'text-slate-400'}`}>
          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>1</span>
          <span className="text-sm">Campaign Info</span>
        </div>
        <div className="w-12 h-0.5 bg-slate-200"></div>

        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-indigo-600 font-bold' : 'text-slate-400'}`}>
          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>2</span>
          <span className="text-sm">Sequence Builder</span>
        </div>
        <div className="w-12 h-0.5 bg-slate-200"></div>

        <div className={`flex items-center gap-2 ${step >= 3 ? 'text-indigo-600 font-bold' : 'text-slate-400'}`}>
          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${step >= 3 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>3</span>
          <span className="text-sm">Target Leads</span>
        </div>
      </div>

      {/* STEP 1: CAMPAIGN INFO */}
      {step === 1 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Step 1: Campaign Details</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Campaign Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Q4 FinTech CTO Outreach"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Email Subject Line *</label>
              <input
                type="text"
                required
                value={subjectLine}
                onChange={(e) => setSubjectLine(e.target.value)}
                placeholder="e.g. Quick question about {{company}}'s growth strategy"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-slate-400 mt-1">Available variables: <code className="text-indigo-600 font-mono">{"{{first_name}}"}</code>, <code className="text-indigo-600 font-mono">{"{{company}}"}</code></p>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              onClick={() => {
                if (!name || !subjectLine) return alert('Please enter Campaign Name and Subject Line.');
                setStep(2);
              }}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-sm"
            >
              Continue to Sequence Builder →
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: SEQUENCE BUILDER */}
      {step === 2 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 2: Email Sequence Steps</h2>
              <p className="text-xs text-slate-500">Configure multi-step follow-ups with automatic delays</p>
            </div>
            <button
              onClick={handleAddSequence}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-semibold border border-indigo-200"
            >
              <Plus className="w-4 h-4" /> Add Step
            </button>
          </div>

          <div className="space-y-6">
            {sequences.map((seq, idx) => (
              <div key={idx} className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
                  <span className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <Mail className="w-4 h-4 text-indigo-600" />
                    Step {idx + 1} Email
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Wait</span>
                      <input
                        type="number"
                        min={0}
                        value={seq.delay_days}
                        onChange={(e) => {
                          const updated = [...sequences];
                          updated[idx].delay_days = parseInt(e.target.value, 10) || 0;
                          setSequences(updated);
                        }}
                        className="w-14 px-2 py-1 bg-white border border-slate-200 rounded text-center text-xs font-bold"
                      />
                      <span>days</span>
                    </div>
                    {sequences.length > 1 && (
                      <button
                        onClick={() => handleRemoveSequence(idx)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={seq.subject}
                    onChange={(e) => {
                      const updated = [...sequences];
                      updated[idx].subject = e.target.value;
                      setSequences(updated);
                    }}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Body</label>
                  <textarea
                    rows={4}
                    value={seq.body}
                    onChange={(e) => {
                      const updated = [...sequences];
                      updated[idx].body = e.target.value;
                      setSequences(updated);
                    }}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-sans text-slate-900"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold"
            >
              ← Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-sm"
            >
              Select Target Leads →
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: TARGET LEADS & LAUNCH */}
      {step === 3 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 3: Select Target Prospects</h2>
              <p className="text-xs text-slate-500">
                Selected <strong className="text-indigo-600">{selectedLeadIds.length}</strong> of {availableLeads.length} total leads
              </p>
            </div>
            <button
              onClick={() => {
                if (selectedLeadIds.length === availableLeads.length) {
                  setSelectedLeadIds([]);
                } else {
                  setSelectedLeadIds(availableLeads.map((l) => l.id));
                }
              }}
              className="text-xs font-semibold text-indigo-600 hover:underline"
            >
              {selectedLeadIds.length === availableLeads.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-xl">
            {availableLeads.map((lead) => {
              const isSelected = selectedLeadIds.includes(lead.id);
              return (
                <div
                  key={lead.id}
                  onClick={() => toggleLead(lead.id)}
                  className={`p-3.5 flex items-center justify-between cursor-pointer transition ${
                    isSelected ? 'bg-indigo-50/50' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {lead.first_name} {lead.last_name}
                      </p>
                      <p className="text-xs text-slate-500">{lead.company} • {lead.email}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-indigo-600">Score {lead.score}</span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold"
            >
              ← Back
            </button>
            <button
              onClick={handleLaunch}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold shadow-md shadow-emerald-100 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Launch Outbound Campaign Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
