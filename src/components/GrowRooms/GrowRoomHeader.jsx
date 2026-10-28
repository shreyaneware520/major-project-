import React from 'react';
import { Sprout, Plus } from 'lucide-react';

const GrowRoomHeader = ({ onAddRoom }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#00ff88]/10 border border-[#00ff88]/20">
            <Sprout className="w-6 h-6 text-[#00ff88]" />
          </div>
          Grow Rooms
        </h1>
        <p className="text-gray-400 text-sm mt-2 ml-[52px]">
          Monitor and manage all active cultivation environments across your facility.
        </p>
      </div>
      <button
        onClick={onAddRoom}
        className="flex items-center justify-center gap-2 bg-[#00ff88] hover:bg-[#00e67a] text-black px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 shadow-[0_0_20px_rgba(0,255,136,0.25)] hover:shadow-[0_0_30px_rgba(0,255,136,0.4)] cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        Add Room
      </button>
    </div>
  );
};

export default GrowRoomHeader;
