import React from 'react';
import { FileText, Plus } from 'lucide-react';

const EmptyState = ({ onGenerateClick }) => {
  return (
    <div className="bg-[#131c2e] border border-slate-800/80 rounded-3xl p-12 md:p-16 text-center max-w-xl mx-auto my-8 shadow-xl">
      <div className="w-16 h-16 rounded-2xl bg-[#00ff88]/10 border border-[#00ff88]/20 text-[#00ff88] flex items-center justify-center mx-auto mb-5 shadow-[0_0_30px_rgba(0,255,136,0.15)]">
        <FileText className="w-8 h-8" />
      </div>

      <h3 className="text-xl font-bold text-white mb-2">No Reports Available</h3>
      <p className="text-xs md:text-sm text-gray-400 max-w-md mx-auto mb-6 leading-relaxed">
        No telemetry or crop health reports found matching your criteria. Generate your first report to start tracking farm analytics.
      </p>

      {onGenerateClick && (
        <button
          onClick={onGenerateClick}
          className="inline-flex items-center gap-2 bg-[#00ff88] hover:bg-[#00e67a] text-black font-bold text-xs md:text-sm px-6 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(0,255,136,0.2)] hover:shadow-[0_0_30px_rgba(0,255,136,0.4)] cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Generate Report</span>
        </button>
      )}
    </div>
  );
};

export default EmptyState;
