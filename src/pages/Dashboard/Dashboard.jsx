import React, { lazy, Suspense } from 'react';
import { useAuth } from '../../context/AuthContext';
import SensorCards from '../../components/Dashboard/SensorCards';
import AlertsFeed from '../../components/Dashboard/AlertsFeed';

// Lazy-loaded heavy components for optimal code-splitting and immediate initial paint
const AdminDashboardView = lazy(() => import('./AdminDashboardView'));
const EnvironmentalChart = lazy(() => import('../../components/Dashboard/EnvironmentalChart'));
const CropHealth = lazy(() => import('../../components/Dashboard/CropHealth'));
const NPKAnalysis = lazy(() => import('../../components/Dashboard/NPKAnalysis'));
const HarvestPrediction = lazy(() => import('../../components/Dashboard/HarvestPrediction'));

// Lightweight, independent widget skeletons
const ChartSkeleton = () => (
  <div className="bg-[#131c2e] border border-slate-800/80 p-6 rounded-2xl shadow-lg h-[440px] animate-pulse flex flex-col justify-between">
    <div className="flex justify-between items-center">
      <div className="h-6 w-48 bg-slate-800 rounded" />
      <div className="h-8 w-32 bg-slate-800/60 rounded-lg" />
    </div>
    <div className="h-64 w-full bg-slate-800/30 rounded-xl" />
    <div className="flex justify-between">
      <div className="h-4 w-24 bg-slate-800/50 rounded" />
      <div className="h-4 w-24 bg-slate-800/50 rounded" />
    </div>
  </div>
);

const WidgetCardSkeleton = () => (
  <div className="bg-[#131c2e] border border-slate-800/80 p-5 rounded-2xl shadow-lg h-56 animate-pulse space-y-4">
    <div className="h-5 w-1/2 bg-slate-800 rounded" />
    <div className="h-10 w-full bg-slate-800/40 rounded-xl" />
    <div className="h-12 w-full bg-slate-800/30 rounded-xl" />
  </div>
);

const AdminSkeleton = () => (
  <div className="p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto animate-pulse">
    <div className="h-8 w-64 bg-slate-800 rounded" />
    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-24 bg-slate-800/50 rounded-2xl" />
      ))}
    </div>
    <div className="h-96 bg-slate-800/30 rounded-2xl" />
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {isAdmin ? (
        <Suspense fallback={<AdminSkeleton />}>
          <AdminDashboardView />
        </Suspense>
      ) : (
        <main className="p-6 md:p-8 space-y-8 flex-1">
          {/* Top Row: Sensor Stat Cards (Renders immediately via SWR cache < 50ms) */}
          <SensorCards />

          {/* Middle Row: Analytics Chart (2 cols, lazy) & Alerts Feed (1 col, instant) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Suspense fallback={<ChartSkeleton />}>
                <EnvironmentalChart />
              </Suspense>
            </div>
            <div className="lg:col-span-1">
              <AlertsFeed />
            </div>
          </div>

          {/* Biology & Yield Row: Crop Health, Soil NPK, and Harvest Predictions (Independent Suspense) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Suspense fallback={<WidgetCardSkeleton />}>
              <CropHealth />
            </Suspense>
            <Suspense fallback={<WidgetCardSkeleton />}>
              <NPKAnalysis />
            </Suspense>
            <Suspense fallback={<WidgetCardSkeleton />}>
              <HarvestPrediction />
            </Suspense>
          </div>
        </main>
      )}
    </div>
  );
};

export default Dashboard;
