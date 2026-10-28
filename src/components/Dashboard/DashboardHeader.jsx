import React, { useState, useMemo } from 'react';
import { Search, Bell, ChevronDown, Building2, Wifi, Menu, ArrowLeft, LogOut } from 'lucide-react';
import { useTelemetry } from '../../context/TelemetryContext';
import { useAuth } from '../../context/AuthContext';
import { useLayout } from '../../context/LayoutContext';
import logo from '../../assets/logo.png';
import LogoutConfirmModal from '../common/LogoutConfirmModal';

const DashboardHeader = React.memo(() => {
  const { activeSensorId } = useTelemetry();
  const { user, logout } = useAuth();
  const { openDrawer, isSearchModalOpen, openSearchModal, closeSearchModal } = useLayout();

  const [headerSearchQuery, setHeaderSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const isAdmin = user?.role === 'admin';

  const userInitials = useMemo(() => {
    if (!user?.displayName && !user?.name) return 'US';
    const nameStr = user?.displayName || user?.name || '';
    return nameStr
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }, [user?.displayName, user?.name]);

  return (
    <>
      <header className="bg-[#0d1424]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between sticky top-0 z-20 transition-all duration-200">
        {/* Left Section: Hamburger (Mobile/Tablet) + Facility Info / Brand Logo */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Hamburger Menu Toggle Button for Tablet/Mobile Drawer */}
          <button
            onClick={openDrawer}
            className="lg:hidden p-2.5 rounded-xl bg-[#131c2e] text-gray-300 hover:text-white border border-slate-700/60 hover:border-slate-600 transition-colors shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Open Navigation Drawer"
          >
            <Menu className="w-5 h-5 text-gray-200" />
          </button>

          {/* Mobile Only: Brand Logo */}
          <div className="flex sm:hidden items-center gap-2">
            <img src={logo} alt="Logo" className="w-7 h-7 object-contain" />
            <span className="font-bold text-sm text-white tracking-wide">
              कृषी<span className="text-[#00ff88]">Dristi</span>
            </span>
          </div>

          {/* Facility Info (Tablet, Laptop, Desktop) */}
          <div className="hidden sm:flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-xl bg-[#131c2e] border border-slate-700/60 text-[#00ff88] shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-white truncate leading-tight">
                Greenhouse Alpha — Sector 4
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] font-mono text-gray-400">ID: {activeSensorId}</span>
                <span className="text-gray-600">•</span>
                <span className="inline-flex items-center gap-1 text-[11px] text-[#00ff88] font-medium">
                  <Wifi className="w-3 h-3 animate-pulse" /> Live Telemetry
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Section: Search Bar (Desktop / Laptop) */}
        <div className="hidden sm:flex items-center flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={headerSearchQuery}
              onChange={(e) => setHeaderSearchQuery(e.target.value)}
              placeholder="Search sensors, metrics, alerts, or controls..."
              className="w-full bg-[#131c2e] text-sm text-white placeholder-gray-500 pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-[#00ff88]/50 focus:ring-1 focus:ring-[#00ff88]/30 transition-all"
            />
          </div>
        </div>

        {/* Right Section: Mobile Search Trigger + Notifications + Profile Badge Dropdown */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Mobile Search Button Trigger (<640px) */}
          <button
            onClick={openSearchModal}
            className="sm:hidden p-2.5 rounded-xl bg-[#131c2e] text-gray-300 hover:text-white border border-slate-700/60 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Open Mobile Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Notification Bell Icon */}
          <button className="relative p-2.5 rounded-xl bg-[#131c2e] text-gray-300 hover:text-white border border-slate-700/60 hover:border-slate-600 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#00ff88] ring-4 ring-[#0d1424]"></span>
          </button>

          {/* User Profile Avatar / Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen((prev) => !prev)}
              className="flex items-center gap-3 sm:pl-2 sm:border-l border-slate-800 hover:opacity-90 transition-opacity cursor-pointer text-left"
              aria-label="User Menu"
            >
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User Avatar'}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-[#00ff88]/50 object-cover shadow-[0_0_10px_rgba(0,255,136,0.2)] shrink-0"
                />
              ) : (
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#00ff88]/30 to-emerald-600/30 border border-[#00ff88]/50 flex items-center justify-center font-bold text-[#00ff88] text-xs sm:text-sm shadow-[0_0_10px_rgba(0,255,136,0.2)] shrink-0">
                  {userInitials}
                </div>
              )}
              <div className="hidden lg:block text-left min-w-0">
                <p className="text-sm font-semibold text-white leading-none truncate max-w-[120px]">{user?.displayName || 'User'}</p>
                <p className="text-xs text-gray-400 mt-1 max-w-[130px] truncate">{user?.email || 'Operator'}</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 hidden lg:block transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isUserMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsUserMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-[#131c2e] border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2.5 border-b border-slate-800">
                    <p className="text-sm font-bold text-white truncate">{user?.displayName || 'User'}</p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{user?.email}</p>
                    <span className={`inline-block mt-1.5 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md border ${
                      isAdmin
                        ? 'bg-red-500/10 text-red-400 border-red-500/30'
                        : 'bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/30'
                    }`}>
                      {isAdmin ? 'System Admin' : 'Crop Operator'}
                    </span>
                  </div>

                  <div className="pt-1">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setShowLogoutModal(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer text-left"
                    >
                      <LogOut className="w-4 h-4 text-red-400" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Full-Screen Search Modal for Mobile (<640px) */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0d1424]/95 backdrop-blur-md p-4 flex flex-col sm:hidden">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={closeSearchModal}
              className="p-2 text-gray-400 hover:text-white rounded-xl"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search rooms, crops, devices..."
                value={headerSearchQuery}
                onChange={(e) => setHeaderSearchQuery(e.target.value)}
                autoFocus
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#131c2e] border border-slate-800 text-sm text-white focus:outline-none focus:border-[#00ff88]"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>
          <div className="space-y-2 mt-2">
            <div className="text-xs font-semibold text-gray-400 px-1 mb-2">Popular Searches</div>
            {['Hydroponics Alpha', 'Lettuce Health', 'pH Sensor Diagnostics', 'Automated Irrigation'].map((term, i) => (
              <button
                key={i}
                onClick={() => {
                  setHeaderSearchQuery(term);
                  closeSearchModal();
                }}
                className="w-full text-left p-3 rounded-xl bg-[#131c2e] border border-slate-800 text-sm text-gray-200 hover:border-slate-700 flex items-center justify-between"
              >
                <span>{term}</span>
                <Search className="w-3.5 h-3.5 text-gray-500" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => {
          setShowLogoutModal(false);
          logout();
        }}
      />
    </>
  );
});

export default DashboardHeader;
