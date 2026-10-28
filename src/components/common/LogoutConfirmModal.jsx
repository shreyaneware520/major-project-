import React from 'react';
import { LogOut, X } from 'lucide-react';

const LogoutConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
      <div className="bg-[#0d1424] border border-slate-800 rounded-3xl w-full max-w-md shadow-[0_0_50px_rgba(0,0,0,0.7)] overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <LogOut className="w-5.5 h-5.5" />
            </div>
            <h3 className="text-lg font-bold text-white">Confirm Sign Out</h3>
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
        <div className="p-6 space-y-3 text-xs text-gray-300">
          <p className="text-sm font-semibold text-white leading-relaxed">
            Are you sure you want to sign out of your account?
          </p>
          <p className="text-gray-400 leading-relaxed">
            Your active session will be terminated and you will be redirected to the login page. Any unsaved changes in progress may be lost.
          </p>
        </div>

        {/* Modal Actions */}
        <div className="p-6 border-t border-slate-800/80 bg-[#0d1424] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#131c2e] hover:bg-slate-800 border border-slate-800 text-gray-300 font-semibold text-xs transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs transition-all shadow-[0_0_20px_rgba(244,63,94,0.3)] cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmModal;
