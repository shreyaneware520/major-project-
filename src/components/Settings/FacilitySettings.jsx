import React, { useState } from 'react';
import { Building2, Save, Wifi } from 'lucide-react';

const FacilitySettings = ({ onSave }) => {
  const [formData, setFormData] = useState({
    facilityName: 'Facility #04 - Hydroponics Alpha',
    tempUnit: 'C',
    brokerHost: 'mqtt.farmtech.org',
    brokerPort: '8883',
    qos: '1',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave('Facility network configurations saved successfully!', formData);
  };

  return (
    <div className="bg-[#131c2e] border border-slate-800/80 p-6 rounded-2xl shadow-lg flex flex-col h-full justify-between">
      <div>
        <div className="flex items-center gap-2.5 mb-5 border-b border-slate-800/60 pb-4">
          <div className="p-2 rounded-lg bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/20">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wide">Facility & Network</h3>
            <p className="text-xs text-gray-400">Configure central node variables and units</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Facility Name */}
          <div>
            <label className="block text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-2">
              Facility Location Name
            </label>
            <input
              type="text"
              required
              value={formData.facilityName}
              onChange={(e) => setFormData({ ...formData, facilityName: e.target.value })}
              className="w-full bg-[#0a0f1a] text-sm text-white px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-[#00ff88] transition-all"
            />
          </div>

          {/* Temperature Scale Selection */}
          <div>
            <label className="block text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-2">
              Temperature Metric Scale
            </label>
            <div className="grid grid-cols-2 gap-2 bg-[#0a0f1a] p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, tempUnit: 'C' })}
                className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  formData.tempUnit === 'C'
                    ? 'bg-[#00ff88] text-black shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Celsius (°C)
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, tempUnit: 'F' })}
                className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  formData.tempUnit === 'F'
                    ? 'bg-[#00ff88] text-black shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Fahrenheit (°F)
              </button>
            </div>
          </div>

          {/* MQTT Broker details */}
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <label className="block text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-2">
                MQTT Host Uplink
              </label>
              <div className="relative">
                <Wifi className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  required
                  value={formData.brokerHost}
                  onChange={(e) => setFormData({ ...formData, brokerHost: e.target.value })}
                  className="w-full bg-[#0a0f1a] text-sm text-white pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-[#00ff88] transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-2">
                Port
              </label>
              <input
                type="text"
                required
                value={formData.brokerPort}
                onChange={(e) => setFormData({ ...formData, brokerPort: e.target.value })}
                className="w-full bg-[#0a0f1a] text-sm text-white px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-[#00ff88] transition-all font-mono"
              />
            </div>
          </div>

          {/* MQTT QoS */}
          <div>
            <label className="block text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-2">
              Quality of Service (QoS)
            </label>
            <select
              value={formData.qos}
              onChange={(e) => setFormData({ ...formData, qos: e.target.value })}
              className="w-full bg-[#0a0f1a] text-sm text-white px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-[#00ff88] cursor-pointer"
            >
              <option value="0">QoS 0 — At most once (Fastest)</option>
              <option value="1">QoS 1 — At least once (Standard)</option>
              <option value="2">QoS 2 — Exactly once (Safest)</option>
            </select>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[#00ff88] hover:bg-[#00e67a] text-black font-bold text-sm py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(0,255,136,0.15)] cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Save facility network config
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FacilitySettings;
