import React from 'react';
import { User, Terminal, HardDrive } from 'lucide-react';

const OverrideLogs = ({ logs }) => {
  return (
    <div className="bg-[#131c2e] border border-slate-800/80 p-6 rounded-2xl shadow-lg flex flex-col h-full">
      <div className="flex items-center justify-between mb-5 border-b border-slate-800/60 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-wide">Override History</h3>
            <p className="text-xs text-gray-400">Manual command override logs database</p>
          </div>
        </div>
        <span className="text-[10px] font-semibold text-gray-400 font-mono">
          Last 10 overrides
        </span>
      </div>

      <div className="space-y-3.5 flex-1 overflow-y-auto max-h-[300px] pr-1">
        {logs.map((log) => {
          const isSystem = log.operator.startsWith('System');
          
          return (
            <div key={log.id} className="p-3 border border-slate-800/40 bg-[#0a0f1a]/30 hover:bg-[#0a0f1a]/50 rounded-xl flex items-start gap-3 transition-colors">
              <div className={`p-2 rounded-lg border mt-0.5 w-9.5 h-9.5 flex items-center justify-center flex-shrink-0 ${
                isSystem 
                  ? 'text-blue-400 bg-blue-500/5 border-blue-500/10' 
                  : 'text-[#00ff88] bg-[#00ff88]/5 border-[#00ff88]/10'
              }`}>
                {isSystem ? <HardDrive className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex justify-between items-baseline gap-2">
                  <h4 className="text-xs font-bold text-white leading-none">{log.operator}</h4>
                  <span className="text-[9px] text-gray-500 font-mono">{log.ip}</span>
                </div>
                <p className="text-sm font-medium text-gray-200 mt-1.5 leading-snug">{log.action}</p>
                <span className="text-[10px] text-gray-500 mt-1 block">{log.timestamp}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OverrideLogs;
