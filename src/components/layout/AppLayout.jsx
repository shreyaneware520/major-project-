import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar';
import DashboardHeader from '../Dashboard/DashboardHeader';
import { TelemetryProvider } from '../../context/TelemetryContext';
import { LayoutProvider } from '../../context/LayoutContext';

/**
 * Enterprise AppLayout Shell
 * Maintains persistent Sidebar and DashboardHeader across all protected routes.
 * Prevents layout thrashing, component re-mounting, and unnecessary re-renders.
 */
const AppLayout = () => {
  return (
    <LayoutProvider>
      <TelemetryProvider>
        <div className="flex min-h-screen bg-[#0a0f1a] text-white font-sans selection:bg-[#00ff88] selection:text-black">
          {/* Persistent Sidebar (never unmounts during route changes) */}
          <Sidebar />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
            {/* Persistent Topbar Header */}
            <DashboardHeader />

            {/* Active Page View */}
            <Outlet />
          </div>
        </div>
      </TelemetryProvider>
    </LayoutProvider>
  );
};

export default AppLayout;
