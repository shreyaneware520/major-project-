import React, { useState } from 'react';
import { User, Mail, Phone, Shield, Save } from 'lucide-react';

const ProfileSettings = ({ user, onSave }) => {
  const [prevUser, setPrevUser] = useState(user);
  const [formData, setFormData] = useState({
    name: user?.displayName || user?.name || '',
    email: user?.email || '',
    phone: user?.phone || user?.phoneNumber || '',
  });

  if (user !== prevUser) {
    setPrevUser(user);
    setFormData({
      name: user?.displayName || user?.name || '',
      email: user?.email || '',
      phone: user?.phone || user?.phoneNumber || '',
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave('Profile settings updated successfully!', formData);
  };

  return (
    <div className="bg-[#131c2e] border border-slate-800/80 p-6 rounded-2xl shadow-lg flex flex-col h-full justify-between">
      <div>
        <div className="flex items-center gap-2.5 mb-5 border-b border-slate-800/60 pb-4">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wide">Operator Profile</h3>
            <p className="text-xs text-gray-400">Manage your contact details and account permission</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#0a0f1a] text-sm text-white placeholder-gray-500 pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-[#00ff88] transition-all"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                disabled
                value={formData.email}
                className="w-full bg-[#0a0f1a]/50 text-sm text-gray-500 pl-10 pr-4 py-2.5 rounded-xl border border-slate-800/50 focus:outline-none cursor-not-allowed"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-2">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. +91 98765 43210"
                className="w-full bg-[#0a0f1a] text-sm text-white placeholder-gray-500 pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-[#00ff88] transition-all"
              />
            </div>
          </div>

          {/* Permission Level Readonly */}
          <div>
            <label className="block text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-2">
              Permission Level
            </label>
            <div className="flex items-center gap-2 bg-[#0a0f1a]/30 border border-slate-800/80 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-gray-400">
              <Shield className="w-4 h-4 text-[#00ff88]" />
              <span className="capitalize">{user?.role || 'operator'} access</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[#00ff88] hover:bg-[#00e67a] text-black font-bold text-sm py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(0,255,136,0.15)] cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Save Profile changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettings;
