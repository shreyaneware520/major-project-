import React, { useState } from 'react';
import { User, Mail, Phone, Shield, FileText, Save, Check } from 'lucide-react';

const ProfileEditForm = () => {
  const [formData, setFormData] = useState({
    fullName: 'Dr. Sarah Vance',
    email: 's.vance@agriintel.io',
    phone: '+1 (555) 234-5678',
    role: 'Enterprise Operator',
    bio: 'Senior Plant Scientist specializing in automated hydroponic telemetry, nutrient solution balancing, and AI yield modeling across commercial greenhouses.',
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="bg-[#131c2e] border border-slate-800/80 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
        <h3 className="text-lg font-bold text-white tracking-wide">Edit Profile Details</h3>
        {saved && (
          <span className="text-xs font-semibold text-[#00ff88] bg-[#00ff88]/10 px-3 py-1 rounded-full border border-[#00ff88]/30 flex items-center gap-1.5 animate-fade-in">
            <Check className="w-3.5 h-3.5" /> Changes saved successfully
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full bg-[#0a0f1a] text-white text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-700/80 focus:outline-none focus:border-[#00ff88] focus:ring-1 focus:ring-[#00ff88] transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-[#0a0f1a] text-white text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-700/80 focus:outline-none focus:border-[#00ff88] focus:ring-1 focus:ring-[#00ff88] transition-all"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-[#0a0f1a] text-white text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-700/80 focus:outline-none focus:border-[#00ff88] focus:ring-1 focus:ring-[#00ff88] transition-all"
              />
            </div>
          </div>

          {/* Role (Disabled) */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>System Role</span>
              <span className="text-[10px] text-amber-400 font-normal">Managed by Admin</span>
            </label>
            <div className="relative">
              <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                name="role"
                disabled
                value={formData.role}
                className="w-full bg-slate-900/60 text-gray-400 text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
            Bio / Agronomist Notes
          </label>
          <div className="relative">
            <FileText className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
            <textarea
              name="bio"
              rows={3}
              value={formData.bio}
              onChange={handleChange}
              className="w-full bg-[#0a0f1a] text-white text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-700/80 focus:outline-none focus:border-[#00ff88] focus:ring-1 focus:ring-[#00ff88] transition-all"
            />
          </div>
        </div>

        {/* Save Changes Green Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="bg-[#00ff88] hover:bg-[#00e67a] text-black font-bold py-2.5 px-6 rounded-xl shadow-[0_0_15px_rgba(0,255,136,0.3)] hover:shadow-[0_0_20px_rgba(0,255,136,0.5)] transition-all duration-200 flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditForm;
