import React, { useState } from 'react';
import { ChevronDown, Building2 } from 'lucide-react';
import { MOCK_GROW_ROOMS } from '../GrowRooms/growRoomData';

const ControlSelector = ({ activeRoomId, onRoomChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const activeRoom = MOCK_GROW_ROOMS.find(r => r.id === activeRoomId) || MOCK_GROW_ROOMS[0];

  return (
    <>
      <div className="bg-[#131c2e] border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-[#00ff88]/10 text-[#00ff88]">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Active Control Channel</h3>
            <p className="text-xs text-gray-400 mt-0.5">Directing commands to assigned micro-controller node</p>
          </div>
        </div>

        {/* Dropdown Selector */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2.5 bg-[#0a0f1a] border border-slate-800 hover:border-slate-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer min-w-[200px]"
          >
            <span>{activeRoom.cropIcon} {activeRoom.name}</span>
            <span className="text-[10px] text-[#00ff88] bg-[#00ff88]/5 px-2 py-0.5 border border-[#00ff88]/10 rounded font-mono ml-auto">
              {activeRoom.id}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
          
          {isOpen && (
            <div className="absolute right-0 top-full mt-2 bg-[#0d1424] border border-slate-800 rounded-xl shadow-2xl z-50 min-w-[220px] overflow-hidden">
              {MOCK_GROW_ROOMS.map((room) => (
                <button
                  key={room.id}
                  onClick={() => {
                    onRoomChange(room.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-4 py-3 text-left text-sm transition-colors cursor-pointer border-b border-slate-800/40 last:border-b-0 ${
                    activeRoomId === room.id
                      ? 'bg-[#00ff88]/10 text-[#00ff88] font-bold'
                      : 'text-gray-300 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <span className="text-base">{room.cropIcon}</span>
                  <span className="truncate flex-1">{room.name}</span>
                  <span className="text-[10px] text-gray-500 font-mono">{room.id}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </>
  );
};

export default ControlSelector;
