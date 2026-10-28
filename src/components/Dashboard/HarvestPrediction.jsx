import React from 'react';
import { Sparkles, BarChart2, Lightbulb, TrendingUp, Award, Droplet } from 'lucide-react';
import { useTelemetry } from '../../context/TelemetryContext';

const HarvestPrediction = React.memo(() => {
  const { telemetry } = useTelemetry();

  // TelemetryContext guarantees telemetry is never null on mount (cache/seed fallback).

  // Calculate yield match discrepancy
  const predicted = telemetry.yield_prediction || 0;
  const actual = telemetry.actual_yield_kg || 0;
  const discrepancy = predicted > 0 ? parseFloat((((actual - predicted) / predicted) * 100).toFixed(1)) : 0;
  const isPositiveDiscrepancy = discrepancy >= 0;

  return (
    <div className="bg-[#131c2e] border border-slate-800/80 p-5 rounded-2xl shadow-xl flex flex-col items-start w-full">
      {/* Card Header */}
      <div className="w-full flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-[#00ff88]/20 to-emerald-500/20 text-[#00ff88] border border-[#00ff88]/40 shadow-[0_0_10px_rgba(0,255,136,0.2)]">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wide leading-tight">AI Harvest & Yield Analytics</h3>
            <p className="text-xs text-gray-400 mt-0.5">Agricultural optimization engine active</p>
          </div>
        </div>
        <span className="text-[11px] font-semibold text-gray-300 bg-[#0a0f1a] px-2.5 py-1 rounded-lg border border-slate-800">
          Thermal: {telemetry.temp_ty || 'Normal'}
        </span>
      </div>

      {/* Main Statistics Grid (Positioned Immediately Below Header) */}
      <div className="w-full grid grid-cols-2 gap-3 mb-3">
        {/* Yield Prediction */}
        <div className="p-3 rounded-xl bg-[#0a0f1a] border border-slate-800/80 hover:border-slate-700 transition-colors">
          <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-0.5">
            <TrendingUp className="w-3.5 h-3.5 text-[#00ff88]" />
            <span className="font-medium">Yield Prediction</span>
          </div>
          <p className="text-base font-bold text-white leading-snug">{predicted} kg</p>
          <p className="text-[10px] text-[#00ff88] mt-0.5 font-medium">Target per cycle</p>
        </div>

        {/* Actual Yield */}
        <div className="p-3 rounded-xl bg-[#0a0f1a] border border-slate-800/80 hover:border-slate-700 transition-colors">
          <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-0.5">
            <BarChart2 className="w-3.5 h-3.5 text-[#00ff88]" />
            <span className="font-medium">Actual Yield</span>
          </div>
          <p className="text-base font-bold text-white leading-snug">{actual} kg</p>
          <p className={`text-[10px] mt-0.5 font-medium ${isPositiveDiscrepancy ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isPositiveDiscrepancy ? `+${discrepancy}% vs target` : `${discrepancy}% vs target`}
          </p>
        </div>

        {/* Daily Photoperiod (Light Hours) */}
        <div className="p-3 rounded-xl bg-[#0a0f1a] border border-slate-800/80 hover:border-slate-700 transition-colors">
          <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-0.5">
            <Lightbulb className="w-3.5 h-3.5 text-yellow-400" />
            <span className="font-medium">Daily Light</span>
          </div>
          <p className="text-base font-bold text-white leading-snug">{telemetry.light_h || 0} hrs/day</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Photosynthetic cycle</p>
        </div>

        {/* Irrigation Efficiency */}
        <div className="p-3 rounded-xl bg-[#0a0f1a] border border-slate-800/80 hover:border-slate-700 transition-colors">
          <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-0.5">
            <Droplet className="w-3.5 h-3.5 text-sky-400" />
            <span className="font-medium">Irrigation Eff.</span>
          </div>
          <p className="text-base font-bold text-white leading-snug">{telemetry.irrigation_efficiency || 0}%</p>
          <p className="text-[10px] text-emerald-400 mt-0.5 font-medium">Optimal uptake</p>
        </div>
      </div>

      {/* Suggested Action Bar */}
      <div className="w-full p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-indigo-400" />
          <span className="text-xs text-gray-300 font-medium">Key Element Needed:</span>
        </div>
        <span className="text-xs font-bold text-indigo-400 px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/30">
          {telemetry.key_element || 'None'}
        </span>
      </div>
    </div>
  );
});

export default HarvestPrediction;

