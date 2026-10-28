import React, { useMemo } from 'react';
import { FlaskConical, Award } from 'lucide-react';
import { useTelemetry } from '../../context/TelemetryContext';

const NPKAnalysis = React.memo(() => {
  const { telemetry } = useTelemetry();

  // TelemetryContext guarantees telemetry is never null on mount (cache/seed fallback).

  const npkData = useMemo(() => {
    const maxN = 250;
    const maxP = 100;
    const maxK = 350;
    return {
      nPct: Math.min(100, (telemetry.nitrogen_ra / maxN) * 100),
      pPct: Math.min(100, (telemetry.phosphorous_ra / maxP) * 100),
      kPct: Math.min(100, (telemetry.potassium_ra / maxK) * 100),
    };
  }, [telemetry?.nitrogen_ra, telemetry?.phosphorous_ra, telemetry?.potassium_ra]);

  const { nPct, pPct, kPct } = npkData;

  return (
    <div className="bg-[#131c2e] border border-slate-800/80 p-5 rounded-2xl shadow-xl flex flex-col items-start w-full">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wide leading-tight">Soil NPK Ratios</h3>
            <p className="text-xs text-gray-400 mt-0.5">Macronutrients concentration in soil</p>
          </div>
        </div>
        <span className="text-[11px] font-semibold text-gray-300 bg-[#0a0f1a] px-2.5 py-1 rounded-lg border border-slate-800">
          Soil: {telemetry.soil_type || 'N/A'}
        </span>
      </div>

      {/* Main NPK Content Grid (Positioned Immediately Below Header) */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
        {/* N-P-K Progress Bars */}
        <div className="sm:col-span-2 space-y-3.5 w-full">
          {/* Nitrogen (N) */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-emerald-400">Nitrogen (N)</span>
              <span className="text-white">{telemetry.nitrogen_ra} <span className="text-gray-500 font-normal">mg/kg</span></span>
            </div>
            <div className="h-2.5 w-full bg-[#0a0f1a] rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 to-[#00ff88] rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(0,255,136,0.4)]"
                style={{ width: `${nPct}%` }}
              ></div>
            </div>
          </div>

          {/* Phosphorus (P) */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-amber-400">Phosphorus (P)</span>
              <span className="text-white">{telemetry.phosphorous_ra} <span className="text-gray-500 font-normal">mg/kg</span></span>
            </div>
            <div className="h-2.5 w-full bg-[#0a0f1a] rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-amber-600 to-yellow-400 rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(251,191,36,0.4)]"
                style={{ width: `${pPct}%` }}
              ></div>
            </div>
          </div>

          {/* Potassium (K) */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-indigo-400">Potassium (K)</span>
              <span className="text-white">{telemetry.potassium_ra} <span className="text-gray-500 font-normal">mg/kg</span></span>
            </div>
            <div className="h-2.5 w-full bg-[#0a0f1a] rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-indigo-600 to-violet-400 rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(129,140,248,0.4)]"
                style={{ width: `${kPct}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Soil Fertility Status Card */}
        <div className="p-3.5 rounded-xl bg-[#0a0f1a] border border-slate-800/80 flex flex-col justify-center items-center text-center h-full w-full">
          <div className="p-2 rounded-full bg-emerald-500/10 text-emerald-400 mb-1.5 border border-emerald-500/20">
            <Award className="w-4 h-4" />
          </div>
          <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">Fertility Index</p>
          <p className="text-base font-extrabold text-[#00ff88] mt-0.5">{telemetry.soil_fertility || 'Optimal'}</p>
          <p className="text-[10px] text-gray-500 mt-1 leading-tight">Nutrient solubility index is nominal</p>
        </div>
      </div>
    </div>
  );
});

export default NPKAnalysis;

