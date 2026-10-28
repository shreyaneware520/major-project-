import React from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';

const ReportFilters = ({
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeChange,
  sortOrder,
  onSortChange,
  totalCount,
  filteredCount,
}) => {
  return (
    <div className="bg-[#131c2e] border border-slate-800/80 p-4 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[240px]">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by Report Name, Grow Room, Crop, Report ID, Author..."
          className="w-full bg-[#0a0f1a] text-xs md:text-sm text-white placeholder-gray-500 pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-[#00ff88] transition-all"
        />
      </div>

      {/* Filters & Sorting */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Type Filter */}
        <div className="relative flex items-center">
          <Filter className="absolute left-3 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          <select
            value={typeFilter}
            onChange={(e) => onTypeChange(e.target.value)}
            className="bg-[#0a0f1a] text-xs font-semibold text-gray-300 pl-8 pr-8 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-[#00ff88] cursor-pointer appearance-none"
          >
            <option value="all">All Reports</option>
            <option value="Crop Health">Crop Health</option>
            <option value="Environmental">Environmental</option>
            <option value="Harvest">Harvest</option>
            <option value="Irrigation">Irrigation</option>
            <option value="Hardware">Hardware</option>
            <option value="Monthly Summary">Monthly Summary</option>
          </select>
        </div>

        {/* Sort Filter */}
        <div className="relative flex items-center">
          <ArrowUpDown className="absolute left-3 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          <select
            value={sortOrder}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-[#0a0f1a] text-xs font-semibold text-gray-300 pl-8 pr-8 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-[#00ff88] cursor-pointer appearance-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {/* Count Pill */}
        <div className="bg-[#0a0f1a] border border-slate-800 px-3 py-2 rounded-xl text-xs font-semibold text-gray-400">
          Showing <span className="text-[#00ff88]">{filteredCount}</span> of {totalCount}
        </div>
      </div>
    </div>
  );
};

export default ReportFilters;
