import React from 'react';
import { Leaf, ArrowUp, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useTelemetry } from '../../context/TelemetryContext';

const CropHealth = React.memo(() => {
  const { telemetry } = useTelemetry();

  // TelemetryContext guarantees telemetry is never null on mount (cache/seed fallback).

  // Calculate dynamic vitality index
  let vitalityIndex = 95;
  if (telemetry.crop_health_st === 'Warning') vitalityIndex = 72;
  else if (telemetry.crop_health_st === 'Critical') vitalityIndex = 38;

  if (telemetry.pest_occurrence === 'Low') vitalityIndex -= 5;
  else if (telemetry.pest_occurrence === 'Medium') vitalityIndex -= 15;
  else if (telemetry.pest_occurrence === 'High') vitalityIndex -= 35;

  vitalityIndex = Math.max(0, Math.min(100, vitalityIndex));

  const radius = 48;
  const strokeWidth = 9;
  const normalizedRadius = radius - strokeWidth * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (vitalityIndex / 100) * circumference;

  return (
    <div className="bg-[#131c2e] border border-slate-800/80 p-5 rounded-2xl shadow-xl flex flex-col items-start w-full">
      {/* Card Header */}
      <div className="w-full flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/30">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wide leading-tight">Crop Health Status</h3>
            <p className="text-xs text-gray-400 mt-0.5">Biological sensor integration</p>
          </div>
        </div>
        <span className="text-[11px] font-semibold text-[#00ff88] bg-[#00ff88]/10 px-2.5 py-1 rounded-full border border-[#00ff88]/30">
          {telemetry.typeofcrop || 'Unknown'} • {telemetry.crop_status || 'Active'}
        </span>
      </div>

      {/* Main Content Grid (Positioned Immediately Below Header) */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        {/* Circular Vitality Gauge */}
        <div className="flex flex-col items-center justify-center p-3 bg-[#0a0f1a] rounded-xl border border-slate-800/80 relative">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg height="128" width="128" className="transform -rotate-90">
              <circle
                stroke="#1e293b"
                fill="transparent"
                strokeWidth={strokeWidth}
                r={normalizedRadius}
                cx="64"
                cy="64"
              />
              <circle
                stroke={telemetry.crop_health_st === 'Critical' ? '#f43f5e' : telemetry.crop_health_st === 'Warning' ? '#f59e0b' : '#00ff88'}
                fill="transparent"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset }}
                strokeLinecap="round"
                r={normalizedRadius}
                cx="64"
                cy="64"
                className="transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(0,255,136,0.5)]"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-2xl font-extrabold text-white">{vitalityIndex}%</span>
              <p className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">Vitality Index</p>
            </div>
          </div>
          <p className="text-xs font-semibold mt-1.5 text-gray-300">
            Health: <span className={telemetry.crop_health_st === 'Critical' ? 'text-rose-400' : telemetry.crop_health_st === 'Warning' ? 'text-amber-400' : 'text-[#00ff88]'}>{telemetry.crop_health_st || 'Healthy'}</span>
          </p>
        </div>

        {/* Height & Pest Indicators */}
        <div className="space-y-3 w-full">
          {/* Plant Height Indicator */}
          <div className="p-3 rounded-xl bg-[#0a0f1a] border border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <ArrowUp className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white leading-tight">Plant Height</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Growth: {telemetry.crop_growth_st || 'N/A'}</p>
              </div>
            </div>
            <span className="text-sm font-bold text-white">{telemetry.plant_height || 0} cm</span>
          </div>

          {/* Pest Occurrence Indicator */}
          <div className="p-3 rounded-xl bg-[#0a0f1a] border border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`p-1.5 rounded-lg ${telemetry.pest_occurrence === 'None' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'} border`}>
                {telemetry.pest_occurrence === 'None' ? <ShieldCheck className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              </div>
              <div>
                <p className="text-xs font-semibold text-white leading-tight">Pest Presence</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Sensory Analysis</p>
              </div>
            </div>
            <span className={`text-xs font-bold ${telemetry.pest_occurrence === 'None' ? 'text-[#00ff88]' : 'text-rose-400'}`}>
              {telemetry.pest_occurrence || 'None'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

export default CropHealth;

