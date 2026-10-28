import React, { useState } from 'react';
import { Bell, ToggleLeft, ToggleRight, Mail, Phone, Server, Send } from 'lucide-react';

const ToggleRow = ({ icon: Icon, label, description, status, onToggle }) => (
  <div className="flex items-start justify-between gap-4 py-3 border-b border-slate-800/40 last:border-0">
    <div className="flex gap-3 min-w-0">
      <div className={`p-2 rounded-lg border mt-0.5 w-9.5 h-9.5 flex items-center justify-center flex-shrink-0 ${
        status 
          ? 'text-[#00ff88] bg-[#00ff88]/5 border-[#00ff88]/10' 
          : 'text-gray-500 bg-[#0a0f1a] border-slate-800'
      }`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <h4 className="text-sm font-bold text-white leading-tight">{label}</h4>
        <p className="text-[11px] text-gray-400 mt-1 leading-snug">{description}</p>
      </div>
    </div>
    <button
      type="button"
      onClick={onToggle}
      className="text-gray-400 hover:text-white transition-colors cursor-pointer flex-shrink-0 ml-4"
    >
      {status ? (
        <ToggleRight className="w-8 h-8 text-[#00ff88]" />
      ) : (
        <ToggleLeft className="w-8 h-8 text-gray-600" />
      )}
    </button>
  </div>
);

const NotificationSettings = ({ onSave }) => {
  const [preferences, setPreferences] = useState({
    emailAlerts: true,
    smsAlerts: false,
    criticalOnly: true,
    dailySummary: true,
  });

  const handleToggle = (key) => {
    setPreferences(prev => {
      const next = { ...prev, [key]: !prev[key] };
      onSave('Notification preferences updated.', next);
      return next;
    });
  };

  return (
    <div className="bg-[#131c2e] border border-slate-800/80 p-6 rounded-2xl shadow-lg flex flex-col h-full justify-between">
      <div>
        <div className="flex items-center gap-2.5 mb-5 border-b border-slate-800/60 pb-4">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wide">Alerts & Notifications</h3>
            <p className="text-xs text-gray-400">Configure alert routing channels and frequency</p>
          </div>
        </div>

        <div className="space-y-1">
          <ToggleRow
            icon={Mail}
            label="Email Alerts Feed"
            description="Send real-time alerts to primary operator email address on drift events."
            status={preferences.emailAlerts}
            onToggle={() => handleToggle('emailAlerts')}
          />
          <ToggleRow
            icon={Phone}
            label="SMS Critical Warnings"
            description="Receive immediate phone text messages when sensor parameters exceed fatal limits."
            status={preferences.smsAlerts}
            onToggle={() => handleToggle('smsAlerts')}
          />
          <ToggleRow
            icon={Server}
            label="Filter Critical Events only"
            description="Suppress minor warnings and parameter drifts from routing channels."
            status={preferences.criticalOnly}
            onToggle={() => handleToggle('criticalOnly')}
          />
          <ToggleRow
            icon={Send}
            label="Daily Status Summary"
            description="Compile and send a daily summary report of crop health metrics every evening."
            status={preferences.dailySummary}
            onToggle={() => handleToggle('dailySummary')}
          />
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
