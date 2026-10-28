import React from 'react';

// Common shimmer animation pulse block
export const SkeletonPulse = ({ className = '' }) => (
  <div
    className={`animate-pulse bg-emerald-950/40 border border-emerald-900/30 rounded-xl ${className}`}
  />
);

// Full Page Loading Fallback (used in App.jsx Suspense)
export const PageSkeleton = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar Placeholder */}
      <div className="hidden md:flex flex-col w-64 bg-slate-900/50 border-r border-slate-800 p-4 space-y-4">
        <div className="h-10 w-3/4 bg-slate-800/60 rounded-lg animate-pulse mb-6" />
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-9 w-full bg-slate-800/40 rounded-lg animate-pulse" />
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Placeholder */}
        <div className="h-16 border-b border-slate-800 bg-slate-900/30 px-6 flex items-center justify-between">
          <div className="h-6 w-48 bg-slate-800/60 rounded-md animate-pulse" />
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-slate-800/60 rounded-full animate-pulse" />
            <div className="h-8 w-24 bg-slate-800/60 rounded-lg animate-pulse" />
          </div>
        </div>

        {/* Dashboard/Page Body Skeleton */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          <div className="h-8 w-64 bg-slate-800/70 rounded-md animate-pulse" />
          
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 bg-slate-900/40 border border-slate-800 rounded-xl p-4 space-y-3 animate-pulse">
                <div className="h-4 w-1/2 bg-slate-800/60 rounded" />
                <div className="h-7 w-3/4 bg-slate-800/80 rounded" />
                <div className="h-3 w-1/3 bg-slate-800/40 rounded" />
              </div>
            ))}
          </div>

          {/* Large Main Chart Block */}
          <div className="h-72 bg-slate-900/40 border border-slate-800 rounded-xl p-6 space-y-4 animate-pulse">
            <div className="h-5 w-44 bg-slate-800/60 rounded" />
            <div className="h-48 w-full bg-slate-800/30 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Card Skeleton for list/grid items
export const CardSkeleton = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-48 bg-slate-900/40 border border-slate-800 rounded-xl p-5 space-y-4 animate-pulse">
          <div className="flex justify-between items-center">
            <div className="h-5 w-1/2 bg-slate-800/70 rounded" />
            <div className="h-6 w-16 bg-slate-800/50 rounded-full" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-3/4 bg-slate-800/40 rounded" />
            <div className="h-4 w-2/3 bg-slate-800/40 rounded" />
          </div>
          <div className="pt-2 flex justify-between">
            <div className="h-8 w-24 bg-slate-800/60 rounded-lg" />
            <div className="h-8 w-20 bg-slate-800/60 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
};

// Table Skeleton
export const TableSkeleton = ({ rows = 5 }) => {
  return (
    <div className="w-full bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden animate-pulse">
      <div className="h-12 bg-slate-800/40 border-b border-slate-800 px-6 flex items-center">
        <div className="h-4 w-full bg-slate-800/60 rounded" />
      </div>
      <div className="divide-y divide-slate-800/60">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-14 px-6 flex items-center space-x-4">
            <div className="h-4 w-1/4 bg-slate-800/50 rounded" />
            <div className="h-4 w-1/4 bg-slate-800/40 rounded" />
            <div className="h-4 w-1/4 bg-slate-800/40 rounded" />
            <div className="h-4 w-1/4 bg-slate-800/50 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};

// Chart Skeleton
const SKELETON_BAR_HEIGHTS = [35, 60, 45, 75, 30, 85, 50, 65, 40, 70, 55, 80];

export const ChartSkeleton = ({ height = 'h-72' }) => {
  return (
    <div className={`w-full ${height} bg-slate-900/40 border border-slate-800 rounded-xl p-6 space-y-4 animate-pulse`}>
      <div className="flex justify-between items-center">
        <div className="h-5 w-44 bg-slate-800/60 rounded" />
        <div className="h-7 w-28 bg-slate-800/40 rounded-lg" />
      </div>
      <div className="h-full w-full bg-slate-800/20 rounded-lg flex items-end p-4 space-x-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 bg-slate-800/50 rounded-t"
            style={{ height: `${SKELETON_BAR_HEIGHTS[i % SKELETON_BAR_HEIGHTS.length]}%` }}
          />
        ))}
      </div>
    </div>
  );
};

export default PageSkeleton;
