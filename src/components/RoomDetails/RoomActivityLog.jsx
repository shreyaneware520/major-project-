import React from 'react';
import { RefreshCw, Droplet, AlertTriangle, Sun, FlaskConical, Thermometer, Wind, Sprout } from 'lucide-react';
import { MOCK_ACTIVITY_LOG } from './roomDetailData';

const logIcons = {
  sync: RefreshCw,
  water: Droplet,
  alert: AlertTriangle,
  light: Sun,
  nutrient: FlaskConical,
  temp: Thermometer,
  fan: Wind,
  growth: Sprout,
};

const RoomActivityLog = () => {
  return (
    <div className="bg-[#131c2e] border border-slate-800/80 p-6 rounded-2xl shadow-lg flex flex-col h-full">
      <div className="flex items-center justify-between mb-5 border-b border-slate-800/60 pb-4">
        <div>
          <h3 className="text-lg font-bold text-white tracking-wide">Activity Logs</h3>
          <p className="text-xs text-gray-400">Recent system events and sensor triggers</p>
        </div>
        <span className="text-[10px] px-2.5 py-1 rounded-full font-bold uppercase bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/30">
          Live Feed
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 max-h-[360px] pr-2 scrollbar-thin scrollbar-thumb-slate-800">
        {MOCK_ACTIVITY_LOG.map((log) => {
          const Icon = logIcons[log.icon] || RefreshCw;
          let iconColor = 'text-[#00ff88] bg-[#00ff88]/10 border-[#00ff88]/20';
          
          if (log.type === 'warning') {
            iconColor = 'text-amber-400 bg-amber-400/10 border-amber-400/30';
          } else if (log.type === 'error') {
            iconColor = 'text-rose-400 bg-rose-400/10 border-rose-500/30';
          } else if (log.type === 'info') {
            iconColor = 'text-blue-400 bg-blue-400/10 border-blue-500/30';
          }

          return (
            <div key={log.id} className="flex gap-4 p-3 rounded-xl border border-slate-800/30 bg-[#0a0f1a]/30 hover:bg-[#0a0f1a]/60 transition-colors">
              <div className={`p-2.5 rounded-lg border flex-shrink-0 w-10 h-10 flex items-center justify-center ${iconColor}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-200 leading-snug">{log.message}</p>
                <span className="text-[10px] text-gray-500 mt-1 block">{log.time}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoomActivityLog;
