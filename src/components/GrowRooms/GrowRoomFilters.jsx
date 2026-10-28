import React, { useState } from 'react';
import { Search, Filter, Leaf, ChevronDown } from 'lucide-react';

const GrowRoomFilters = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  cropFilter,
  onCropChange,
  cropTypes,
  totalRooms,
  filteredCount,
}) => {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showCropDropdown, setShowCropDropdown] = useState(false);

  return (
    <>
      <div className="bg-[#131c2e] border border-slate-800/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search rooms by name, ID, or crop..."
            className="w-full bg-[#0a0f1a] text-sm text-white placeholder-gray-400 pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-[#00ff88] transition-all"
          />
        </div>

        {/* Status Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => { setShowStatusDropdown(!showStatusDropdown); setShowCropDropdown(false); }}
            className="flex items-center gap-2 bg-[#0a0f1a] border border-slate-800 hover:border-slate-700 text-gray-300 hover:text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer min-w-[140px]"
          >
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <span>{statusFilter === 'all' ? 'All Status' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-auto" />
          </button>
          {showStatusDropdown && (
            <div className="absolute top-full mt-2 left-0 bg-[#0d1424] border border-slate-800 rounded-xl shadow-2xl z-50 min-w-[160px] overflow-hidden">
              {['all', 'online', 'alert', 'offline'].map(s => (
                <button
                  key={s}
                  onClick={() => { onStatusChange(s); setShowStatusDropdown(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                    statusFilter === s
                      ? 'bg-[#00ff88]/10 text-[#00ff88] font-semibold'
                      : 'text-gray-300 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  {s === 'all' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Crop Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => { setShowCropDropdown(!showCropDropdown); setShowStatusDropdown(false); }}
            className="flex items-center gap-2 bg-[#0a0f1a] border border-slate-800 hover:border-slate-700 text-gray-300 hover:text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer min-w-[160px]"
          >
            <Leaf className="w-3.5 h-3.5 text-gray-400" />
            <span>{cropFilter === 'all' ? 'All Crops' : cropFilter}</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-auto" />
          </button>
          {showCropDropdown && (
            <div className="absolute top-full mt-2 right-0 bg-[#0d1424] border border-slate-800 rounded-xl shadow-2xl z-50 min-w-[180px] overflow-hidden">
              <button
                onClick={() => { onCropChange('all'); setShowCropDropdown(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                  cropFilter === 'all'
                    ? 'bg-[#00ff88]/10 text-[#00ff88] font-semibold'
                    : 'text-gray-300 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                All Crops
              </button>
              {cropTypes.map(crop => (
                <button
                  key={crop}
                  onClick={() => { onCropChange(crop); setShowCropDropdown(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                    cropFilter === crop
                      ? 'bg-[#00ff88]/10 text-[#00ff88] font-semibold'
                      : 'text-gray-300 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  {crop}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results count */}
        <div className="text-xs text-gray-500 font-medium whitespace-nowrap">
          {filteredCount} of {totalRooms} rooms
        </div>
      </div>

      {/* Close dropdowns on outside click */}
      {(showStatusDropdown || showCropDropdown) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => { setShowStatusDropdown(false); setShowCropDropdown(false); }}
        />
      )}
    </>
  );
};

export default GrowRoomFilters;
