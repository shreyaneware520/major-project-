import React from 'react';
import { TrendingUp, Zap } from 'lucide-react';
import { MOCK_GROW_ROOMS } from './growRoomData';

const YieldOverview = () => {
  return (
    <div className="bg-[#131c2e] border border-slate-800/80 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <TrendingUp className="w-5 h-5 text-[#00ff88]" />
        <h3 className="text-lg font-bold text-white tracking-wide">Yield Prediction Overview</h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {MOCK_GROW_ROOMS.map(room => (
          <div key={room.id} className="bg-[#0a0f1a] border border-slate-800/60 rounded-xl p-3 text-center hover:border-slate-700/60 transition-all">
            <div className="text-lg mb-1">{room.cropIcon}</div>
            <p className="text-[10px] text-gray-500 font-medium truncate mb-1">{room.name}</p>
            <p className="text-sm font-bold text-white">
              {room.yieldPrediction}<span className="text-[10px] text-gray-400 font-normal ml-0.5">kg</span>
            </p>
            <div className="flex items-center justify-center gap-1 mt-1">
              <Zap className="w-3 h-3 text-[#00ff88]" />
              <span className="text-[10px] text-[#00ff88] font-semibold">{room.crop}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YieldOverview;
