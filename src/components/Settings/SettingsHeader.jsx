import React from 'react';
import { Settings } from 'lucide-react';

const SettingsHeader = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#00ff88]/10 border border-[#00ff88]/20">
            <Settings className="w-6 h-6 text-[#00ff88]" />
          </div>
          System Settings
        </h1>
        <p className="text-gray-400 text-sm mt-2 ml-[52px]">
          Configure facility variables, notification thresholds, device uplinks, and security protocols.
        </p>
      </div>
    </div>
  );
};

export default SettingsHeader;
