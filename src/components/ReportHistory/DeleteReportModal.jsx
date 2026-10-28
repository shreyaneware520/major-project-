import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

const DeleteReportModal = ({ isOpen, onClose, onConfirm, reportName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#0d1424] border border-slate-800 rounded-3xl w-full max-w-md shadow-[0_0_50px_rgba(0,0,0,0.6)] overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        {/* Danger Header */}
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <AlertTriangle className="w-5.5 h-5.5" />
            </div>
            <h3 className="text-lg font-bold text-white">Delete Report</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1.5 bg-[#131c2e] hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 text-xs text-gray-300">
          <p className="text-sm font-semibold text-white leading-relaxed">
            Are you sure you want to permanently delete this report?
          </p>
          {reportName && (
            <div className="bg-[#131c2e] p-3 rounded-xl border border-slate-800 font-mono text-gray-300 text-xs truncate">
              {reportName}
            </div>
          )}
          <p className="text-gray-400">
            This action cannot be undone. The report document and associated registry metadata will be permanently removed.
          </p>
        </div>

        {/* Modal Actions */}
        <div className="p-6 border-t border-slate-800/80 bg-[#0d1424] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-[#131c2e] hover:bg-slate-800 border border-slate-800 text-gray-300 font-semibold text-xs transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs transition-all shadow-[0_0_20px_rgba(244,63,94,0.3)] cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteReportModal;
