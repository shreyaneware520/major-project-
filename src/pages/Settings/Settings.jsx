import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  SettingsHeader,
  ProfileSettings,
  NotificationSettings,
} from '../../components/Settings';
import { CheckCircle2 } from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();
  const [toastMsg, setToastMsg] = useState(null);

  const triggerToast = (message) => {
    setToastMsg(message);
    setTimeout(() => {
      setToastMsg(null);
    }, 4000);
  };

  return (
    <main className="p-6 md:p-8 space-y-8 flex-1">
          {/* Settings Header */}
          <SettingsHeader />

          {/* Success Toast Notification Banner */}
          {toastMsg && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-[#00ff88] px-4 py-3.5 rounded-xl text-xs font-bold flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2 duration-300">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{toastMsg}</span>
            </div>
          )}

          {/* Settings Main Panels Grid (2 columns on large screens) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ProfileSettings user={user} onSave={triggerToast} />
            <NotificationSettings onSave={triggerToast} />
          </div>
    </main>
  );
};

export default Settings;
