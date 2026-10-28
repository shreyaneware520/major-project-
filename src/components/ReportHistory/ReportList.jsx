import React from 'react';
import {
  Download,
  FileText,
  Calendar,
  User,
  Eye,
  Trash2,
  Sprout,
  Thermometer,
  Droplets,
  Cpu,
  BarChart3,
  Building2,
} from 'lucide-react';
import EmptyState from './EmptyState';

const typeIcons = {
  'Crop Health': Sprout,
  Environmental: Thermometer,
  Harvest: BarChart3,
  Irrigation: Droplets,
  Hardware: Cpu,
  'Monthly Summary': FileText,
};

const typeColors = {
  'Crop Health': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Environmental: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  Harvest: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Irrigation: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Hardware: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'Monthly Summary': 'bg-teal-500/10 text-teal-400 border-teal-500/20',
};

const statusColors = {
  Available: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Archived: 'bg-slate-800/80 text-gray-400 border-slate-700',
  Draft: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

const ReportCard = ({ report, onPreview, onDownload, onDelete }) => {
  const IconComponent = typeIcons[report.type] || FileText;
  const badgeColor = typeColors[report.type] || 'bg-slate-800 text-gray-400 border-slate-700';
  const statusColor = statusColors[report.status] || statusColors.Available;

  return (
    <div className="bg-[#131c2e] border border-slate-800/80 hover:border-slate-700 rounded-2xl p-5 transition-all duration-250 ease-out hover:-translate-y-0.5 shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.6),0_0_20px_rgba(0,255,136,0.08)] flex flex-col justify-between min-h-[195px] max-h-[220px] group relative overflow-hidden">
      
      {/* Title Header Row: Icon + Title + Action Buttons */}
      <div className="flex items-start justify-between gap-3.5">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-11 h-11 rounded-xl border shrink-0 flex items-center justify-center ${badgeColor} transition-transform duration-250 group-hover:scale-105 shadow-inner`}>
            <IconComponent className="w-5.5 h-5.5" />
          </div>
          <h3 className="text-base sm:text-[17px] font-bold text-white group-hover:text-[#00ff88] transition-colors leading-snug truncate tracking-tight">
            {report.name}
          </h3>
        </div>

        {/* Action buttons: View, Download, Delete */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => onPreview(report)}
            className="p-2 bg-[#0a0f1a] hover:bg-[#00ff88]/10 text-gray-400 hover:text-[#00ff88] border border-slate-800 hover:border-[#00ff88]/30 rounded-xl transition-all cursor-pointer shadow-sm"
            title="View report details"
            aria-label="View report details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDownload(report)}
            className="p-2 bg-[#00ff88]/15 hover:bg-[#00ff88] text-[#00ff88] hover:text-black border border-[#00ff88]/30 transition-all shadow-[0_0_12px_rgba(0,255,136,0.15)] cursor-pointer"
            title="Download PDF report"
            aria-label="Download PDF report"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(report)}
            className="p-2 bg-[#0a0f1a] hover:bg-rose-500/10 text-gray-500 hover:text-rose-400 border border-slate-800 hover:border-rose-500/20 transition-all cursor-pointer shadow-sm"
            title="Delete report"
            aria-label="Delete report"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Row 1: REP-2026-001 | Crop Health | Available */}
      <div className="flex items-center gap-2">
        <span className="font-mono text-[11px] font-bold text-[#00ff88] bg-[#00ff88]/10 px-2.5 py-0.5 rounded-md border border-[#00ff88]/20 shrink-0">
          {report.id}
        </span>
        <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-md border shrink-0 ${badgeColor}`}>
          {report.type}
        </span>
        <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-md border shrink-0 ${statusColor}`}>
          {report.status || 'Available'}
        </span>
      </div>

      {/* Row 2: Hydroponics Alpha | Romaine Lettuce */}
      <div className="flex items-center gap-3 text-xs font-semibold text-gray-300">
        <span className="flex items-center gap-1.5 truncate">
          <Building2 className="w-3.5 h-3.5 text-[#00ff88] shrink-0" />
          {report.room}
        </span>
        <span className="text-gray-600">•</span>
        <span className="flex items-center gap-1.5 truncate">
          <Sprout className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          {report.crop || 'Crop System'}
        </span>
      </div>

      {/* Row 3 (Bottom Footer): Date | Author | File Size */}
      <div className="border-t border-slate-800/60 pt-2.5 flex items-center justify-between text-xs text-gray-400 font-medium">
        <div className="flex items-center gap-3 min-w-0">
          <span className="flex items-center gap-1.5 shrink-0">
            <Calendar className="w-3.5 h-3.5 text-gray-500" />
            {new Date(report.date).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' })}
          </span>
          <span className="text-gray-700">•</span>
          <span className="flex items-center gap-1.5 truncate">
            <User className="w-3.5 h-3.5 text-gray-500 shrink-0" />
            Author: <span className="text-gray-300 font-semibold">{report.author}</span>
          </span>
        </div>
        <span className="font-mono text-[10px] text-gray-400 bg-[#0a0f1a] px-2.5 py-0.5 rounded-md border border-slate-800 shrink-0 font-medium">
          {report.size}
        </span>
      </div>
    </div>
  );
};

const ReportList = ({ reports, onPreview, onDownload, onDelete, onGenerateClick }) => {
  if (reports.length === 0) {
    return <EmptyState onGenerateClick={onGenerateClick} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {reports.map((report) => (
        <ReportCard
          key={report.id}
          report={report}
          onPreview={onPreview}
          onDownload={onDownload}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ReportList;
