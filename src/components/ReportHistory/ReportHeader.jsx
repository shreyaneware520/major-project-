import React from 'react';
import { FileText, Plus } from 'lucide-react';

const ReportHeader = ({ onGenerateClick }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
      <div>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#00ff88]/10 border border-[#00ff88]/20 text-[#00ff88]">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Reports Registry
            </h1>
            <p className="text-xs md:text-sm text-gray-400 mt-0.5">
              Manage environmental reports, crop health reports, harvest reports, irrigation reports and farm analytics.
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={onGenerateClick}
        className="flex items-center justify-center gap-2 bg-[#00ff88] hover:bg-[#00e67a] text-black font-bold text-xs md:text-sm px-5 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(0,255,136,0.2)] hover:shadow-[0_0_30px_rgba(0,255,136,0.4)] cursor-pointer shrink-0"
      >
        <Plus className="w-4 h-4 stroke-[3]" />
        <span>Generate Report</span>
      </button>
    </div>
  );
};

export default ReportHeader;
