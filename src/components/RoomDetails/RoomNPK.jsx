import React from 'react';
import { FlaskConical, Award } from 'lucide-react';
import { MOCK_NPK_DATA } from './roomDetailData';

const RoomNPK = ({ room }) => {
  const isOffline = room.status === 'offline';
  
  if (isOffline) {
    return (
      <div className="bg-[#131c2e] border border-slate-800/80 p-6 rounded-2xl shadow-lg flex items-center justify-center min-h-[220px]">
        <p className="text-sm text-gray-500">NPK analysis offline</p>
      </div>
    );
  }

  // Standard safe NPK thresholds
  const maxN = 250;
  const maxP = 100;
  const maxK = 350;

  const nPct = Math.min(100, (MOCK_NPK_DATA.nitrogen.value / maxN) * 100);
  const pPct = Math.min(100, (MOCK_NPK_DATA.phosphorus.value / maxP) * 100);
  const kPct = Math.min(100, (MOCK_NPK_DATA.potassium.value / maxK) * 100);

  return (
    <div className="bg-[#131c2e] border border-slate-800/80 p-6 rounded-2xl shadow-lg flex flex-col justify-between h-full">
      {/* Title */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-wide">Soil NPK Ratios</h3>
            <p className="text-xs text-gray-400">Macronutrients concentration in soil</p>
          </div>
        </div>
        <span className="text-[11px] font-semibold text-gray-300 bg-[#0a0f1a] px-2.5 py-1 rounded-lg border border-slate-800">
          Soil: Clay Loam
        </span>
      </div>

      {/* NPK Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center my-2">
        {/* N-P-K Bars */}
        <div className="md:col-span-2 space-y-4">
          {/* Nitrogen (N) */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-emerald-400">Nitrogen (N)</span>
              <span className="text-white">
                {MOCK_NPK_DATA.nitrogen.value} <span className="text-gray-500 font-normal">mg/kg</span>
              </span>
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
              <span className="text-white">
                {MOCK_NPK_DATA.phosphorus.value} <span className="text-gray-500 font-normal">mg/kg</span>
              </span>
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
              <span className="text-white">
                {MOCK_NPK_DATA.potassium.value} <span className="text-gray-500 font-normal">mg/kg</span>
              </span>
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
        <div className="p-4 rounded-xl bg-[#0a0f1a] border border-slate-800/80 flex flex-col justify-center items-center text-center h-full">
          <div className="p-2.5 rounded-full bg-emerald-500/10 text-emerald-400 mb-2 border border-emerald-500/20">
            <Award className="w-5 h-5" />
          </div>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Fertility Index</p>
          <p className="text-lg font-extrabold text-[#00ff88] mt-0.5">Optimal</p>
          <p className="text-[11px] text-gray-500 mt-1 leading-tight">Nutrient solubility index is nominal</p>
        </div>
      </div>
    </div>
  );
};

export default RoomNPK;
