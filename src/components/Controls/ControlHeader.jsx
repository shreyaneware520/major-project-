import React from 'react';
import { Sliders, ShieldCheck } from 'lucide-react';

const ControlHeader = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#00ff88]/10 border border-[#00ff88]/20">
            <Sliders className="w-6 h-6 text-[#00ff88]" />
          </div>
          Actuator Controls
        </h1>
        <p className="text-gray-400 text-sm mt-2 ml-[52px]">
          Directly override state or configure automation criteria for hardware relays.
        </p>
      </div>

      <div className="p-3 bg-[#131c2e] border border-slate-800 rounded-xl flex items-center gap-3 shadow-inner">
        <div className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff88] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00ff88]"></span>
        </div>
        <div>
          <div className="text-xs font-semibold text-white flex items-center gap-1">
            Manual Override Enabled <ShieldCheck className="w-3.5 h-3.5 text-[#00ff88]" />
          </div>
          <div className="text-[10px] text-gray-400">Node Uplink: MQTT Secured</div>
        </div>
      </div>
    </div>
  );
};

export default ControlHeader;
