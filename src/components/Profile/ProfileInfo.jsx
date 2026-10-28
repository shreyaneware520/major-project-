import React, { useState } from 'react';
import { Lock, Key, ShieldCheck, Check } from 'lucide-react';

const ProfileInfo = () => {
  const [passwordState, setPasswordState] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [updated, setUpdated] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordState((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setUpdated(true);
    setPasswordState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setUpdated(false), 3000);
  };

  return (
    <div className="bg-[#131c2e] border border-slate-800/80 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/30">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-wide">Security & Change Password</h3>
            <p className="text-xs text-gray-400">Manage your credentials and authentication settings</p>
          </div>
        </div>

        {updated && (
          <span className="text-xs font-semibold text-[#00ff88] bg-[#00ff88]/10 px-3 py-1 rounded-full border border-[#00ff88]/30 flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5" /> Password updated
          </span>
        )}
      </div>

      <form onSubmit={handlePasswordSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
            Current Password
          </label>
          <div className="relative">
            <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="password"
              required
              name="currentPassword"
              value={passwordState.currentPassword}
              onChange={handleChange}
              placeholder="••••••••••••"
              className="w-full bg-[#0a0f1a] text-white text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-700/80 focus:outline-none focus:border-[#00ff88] focus:ring-1 focus:ring-[#00ff88] transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                required
                name="newPassword"
                value={passwordState.newPassword}
                onChange={handleChange}
                placeholder="••••••••••••"
                className="w-full bg-[#0a0f1a] text-white text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-700/80 focus:outline-none focus:border-[#00ff88] focus:ring-1 focus:ring-[#00ff88] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                required
                name="confirmPassword"
                value={passwordState.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••••••"
                className="w-full bg-[#0a0f1a] text-white text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-700/80 focus:outline-none focus:border-[#00ff88] focus:ring-1 focus:ring-[#00ff88] transition-all"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <ShieldCheck className="w-4 h-4 text-[#00ff88]" />
            <span>2FA Security Enabled</span>
          </div>

          <button
            type="submit"
            className="bg-[#131c2e] hover:bg-slate-800 text-[#00ff88] border border-[#00ff88]/50 hover:border-[#00ff88] font-bold py-2 px-5 rounded-xl transition-all duration-200 text-sm cursor-pointer"
          >
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileInfo;
