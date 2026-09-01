import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Key, 
  Server, 
  Globe, 
  ShieldCheck, 
  Save, 
  Mail 
} from 'lucide-react';

export const Settings: React.FC = () => {
  const [smtpHost, setSmtpHost] = useState('smtp.mailgun.org');
  const [smtpPort, setSmtpPort] = useState('587');
  const [smtpUser, setSmtpUser] = useState('outbound-sender@mailgun.org');
  const [trackingDomain, setTrackingDomain] = useState('track.outboundio.com');
  const [apiKey, setApiKey] = useState('ob_live_99842189a7f302b1c9');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Workspace Settings & Integrations</h1>
        <p className="text-sm text-slate-500">Configure outbound email delivery servers, tracking domains, and API credentials</p>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* SMTP Configuration */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Server className="w-4 h-4 text-indigo-600" />
            SMTP & Email Delivery Server Setup
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">SMTP Host</label>
              <input
                type="text"
                value={smtpHost}
                onChange={(e) => setSmtpHost(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">SMTP Port</label>
              <input
                type="text"
                value={smtpPort}
                onChange={(e) => setSmtpPort(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Sender Email / SMTP Username</label>
            <input
              type="email"
              value={smtpUser}
              onChange={(e) => setSmtpUser(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono text-slate-900"
            />
          </div>
        </div>

        {/* Custom Tracking Domain */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-600" />
            Custom Email Tracking Domain
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tracking CNAME Domain</label>
            <input
              type="text"
              value={trackingDomain}
              onChange={(e) => setTrackingDomain(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono text-slate-900"
            />
            <p className="text-xs text-slate-400 mt-1">Ensures high deliverability for open and click tracking pixel links.</p>
          </div>
        </div>

        {/* API Credentials */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Key className="w-4 h-4 text-indigo-600" />
            API Key Access
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Secret API Key</label>
            <input
              type="text"
              readOnly
              value={apiKey}
              className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm font-mono text-slate-700 cursor-not-allowed"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-sm flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};
